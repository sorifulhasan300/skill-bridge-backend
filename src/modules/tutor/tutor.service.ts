import { prisma } from "../../lib/prisma";

const allTutors = async (queries: string) => {
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
    where.categories = {
      some: {
        categoryId: {
          in: categories,
        },
      },
    };
  }

  //filter by hourly rate
  if (minRate || maxRate) {
    where.hourlyRate = {};
    if (minRate) where.hourlyRate.gte = minRate;
    if (maxRate) where.hourlyRate.lte = maxRate;
  }
  const tutors = await prisma.tutorProfile.findMany({
    where,
    include: {
      user: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
  });
  return tutors;
};

const createTutorProfile = async (data: {
  userId: string;
  bio: string;
  hourlyRate: number;
  categories: string[];
}) => {
  try {
    const { userId, bio, hourlyRate, categories } = data;
    const result = await prisma.tutorProfile.create({
      data: {
        userId,
        bio,
        hourlyRate,
        categories: {
          create: categories.map((name) => ({
            category: { create: { name } },
          })),
        },
      },
    });
    return result;
  } catch (error) {
    return error;
  }
};

const tutorDetails = async (tutorId: string) => {
  try {
    const result = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
    });
    return result;
  } catch (error) {
    return error;
  }
};

export const TutorService = {
  allTutors,
  createTutorProfile,
  tutorDetails,
};
