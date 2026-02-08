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

const createTutorProfile = async (payload: {
  userId: string;
  bio: string;
  hourlyRate: number;
  categories: string[];
}) => {
  try {
    const { userId, bio, hourlyRate, categories } = payload;
    const data = await prisma.tutorProfile.create({
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
    return data;
  } catch (error) {
    return error;
  }
};

const tutorDetails = async (tutorId: string) => {
  try {
    const data = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
    });
    return data;
  } catch (error) {
    return error;
  }
};

const updateVisibility = async (
  id: string,
  payload: { availability: string },
) => {
  const { availability } = payload;
  try {
    const data = await prisma.tutorProfile.update({
      where: { id },
      data: { availability: availability as any },
    });
    return data;
  } catch (error) {
    return error;
  }
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
  createTutorProfile,
  tutorDetails,
  updateVisibility,
  updateTutorProfile,
};
