import { prisma } from "../../lib/prisma";

const allTutors = async () => {
  const tutors = await prisma.user.findMany();
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
export const TutorService = {
  allTutors,
  createTutorProfile,
};
