import { TutorStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import QueryBuilder from "../../lib/query-builder";

export const allTutors = async (query: any) => {
  const queryBuilder = new QueryBuilder({}, query)
    .search(["title", "bio"])
    .filter()
    .sort()
    .paginate()
    .fields();

  // Apply tutor-specific filters manually
  const { category, rating } = query;
  
  // Base where conditions
  queryBuilder.modelQuery.where = {
    ...queryBuilder.modelQuery.where,
    user: { status: "ACTIVE" },
  };

  // Category filter
  if (category && category !== "all") {
    queryBuilder.modelQuery.where.categories = {
      some: {
        category: {
          name: category,
        },
      },
    };
  }

  // Rating filter
  if (rating) {
    queryBuilder.modelQuery.where.averageRating = {
      gte: Number(rating),
    };
  }

  // Add includes
  queryBuilder.modelQuery.include = {
    user: true,
    reviews: true,
  };

  const [data, total] = await Promise.all([
    prisma.tutorProfile.findMany(queryBuilder.modelQuery),
    prisma.tutorProfile.count({ where: queryBuilder.modelQuery.where })
  ]);

  return {
    meta: {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      total,
      totalPage: Math.ceil(total / (Number(query.limit) || 10)),
    },
    data,
  };
};

const featuredTutors = async () => {
  const response = await prisma.tutorProfile.findMany({
    where: { isFeatured: true },
    take: 8,
    include: {
      user: {
        select: {
          name: true,
          email: true,
          status: true,
          image: true,
        },
      },
      categories: {
        include: {
          category: {
            select: {
              name: true,
              icon: true,
            },
          },
        },
      },
    },
  });
  return response;
};

const createTutorProfile = async (
  payload: {
    title: string;
    bio: string;
    hourlyRate: number;
    categories: string[];
    timeSlots: any;
  },
  userId: string,
) => {
  const { bio, hourlyRate, categories, timeSlots, title } = payload;

  const existProfile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (existProfile) {
    throw new Error("Tutor profile already exists");
  }

  const data = await prisma.tutorProfile.create({
    data: {
      userId,
      title,
      bio,
      timeSlots,
      hourlyRate,
      categories: {
        create: categories.map((id) => ({
          category: {
            connect: { id: id },
          },
        })),
      },
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  return data;
};
const tutorDetails = async (tutorId: string) => {
  const data = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          status: true,
          image: true,
        },
      },

      reviews: {
        take: 4,
        select: {
          comment: true,
          rating: true,
          student: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });
  return data;
};

const updateVisibility = async (
  id: string,
  userId: string,
  newStatus: TutorStatus,
) => {
  const existTutorProfile = await prisma.tutorProfile.findUnique({
    where: { id },
  });
  if (!existTutorProfile) {
    throw new Error("Tutor profile not found");
  }
  if (existTutorProfile.userId !== userId) {
    throw new Error("You can only update your own profile");
  }
  const data = await prisma.tutorProfile.update({
    where: { id },
    data: { availability: newStatus },
  });
  return data;
};

const updateTutorProfile = async (
  id: string,
  payload: {
    title?: string;
    bio?: string;
    hourlyRate?: number;
    categories?: string[]; // Array of Category IDs
    timeSlots?: any;
    experience: number;
  },
) => {
  const { title, bio, hourlyRate, categories, experience, timeSlots } = payload;
  const existProfile = await prisma.tutorProfile.findUnique({
    where: {
      userId: id,
    },
  });
  if (!existProfile) {
    throw new Error("Tutor profile not found");
  }
  await prisma.tutorProfile.update({
    where: { id: existProfile?.id },
    data: {
      ...(title !== undefined && { title }),
      ...(bio !== undefined && { bio }),
      ...(hourlyRate !== undefined && { hourlyRate }),
      ...(experience !== undefined && { experience }),
      ...(timeSlots !== undefined && { timeSlots }),

      ...(categories && {
        categories: {
          deleteMany: {},
          create: categories.map((catId) => ({
            category: {
              connect: { id: catId },
            },
          })),
        },
      }),
    },
    include: {
      categories: true,
    },
  });
};

const getTutorProfile = async (id: string) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: {
      userId: id,
    },
    select: {
      title: true,
      hourlyRate: true,
      experience: true,
      bio: true,
      timeSlots: true,
      categories: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }

  return tutorProfile;
};

export const TutorService = {
  allTutors,
  featuredTutors,
  createTutorProfile,
  tutorDetails,
  updateVisibility,
  updateTutorProfile,
  getTutorProfile,
};
