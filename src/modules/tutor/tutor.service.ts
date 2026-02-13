import { TutorStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const allTutors = async (queries: {
  search?: string;
  categories?: string;
  minRate?: string | number;
  maxRate?: string | number;
}) => {
  const { search, categories, minRate, maxRate } = queries;
  const where: any = {};
  if (search) {
    where.OR = [
      {
        bio: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        user: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  // filter by categories
  if (categories?.length) {
    const categoryIds = categories.split(",");
    where.categories = {
      some: {
        categoryId: {
          in: categoryIds,
        },
      },
    };
  }

  //filter by hourly rate
  if (minRate || maxRate) {
    where.hourlyRate = {};
    if (minRate) where.hourlyRate.gte = Number(minRate);
    if (maxRate) where.hourlyRate.lte = Number(maxRate);
  }
  const tutors = await prisma.tutorProfile.findMany({
    where,
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
  return tutors;
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
  payload: { bio?: string; hourlyRate?: number },
) => {
  const { bio, hourlyRate } = payload;
  console.log(payload);
  try {
    const data = await prisma.tutorProfile.update({
      where: { id },
      data: { bio: bio as string, hourlyRate: hourlyRate as number },
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const TutorService = {
  allTutors,
  featuredTutors,
  createTutorProfile,
  tutorDetails,
  updateVisibility,
  updateTutorProfile,
};
