import { TutorStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const allTutors = async (query: any) => {
  const {
    searchTerm,
    rating,
    minPrice,
    maxPrice,
    category,
    page = 1,
    limit = 10,
  } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const whereConditions: any = {
    user: { status: "ACTIVE" },
  };

  if (category && category !== "all") {
    whereConditions.categories = {
      some: {
        category: {
          name: category,
        },
      },
    };
  }

  if (searchTerm) {
    whereConditions.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { bio: { contains: searchTerm, mode: "insensitive" } },
      { user: { name: { contains: searchTerm, mode: "insensitive" } } },
    ];
  }

  if (rating) {
    whereConditions.averageRating = {
      gte: Number(rating),
    };
  }

  if (minPrice || maxPrice) {
    whereConditions.hourlyRate = {
      ...(minPrice && { gte: Number(minPrice) }),
      ...(maxPrice && { lte: Number(maxPrice) }),
    };
  }

  const result = await prisma.tutorProfile.findMany({
    where: whereConditions,
    include: {
      user: true,
      reviews: true,
    },
    skip,
    take: Number(limit),
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.tutorProfile.count({ where: whereConditions });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
    },
    data: result,
  };
};

const featuredTutors = async () => {
  const response = await prisma.tutorProfile.findMany({
    where: { isFeatured: true },
    take: 6,
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
