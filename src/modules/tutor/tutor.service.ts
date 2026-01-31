import { prisma } from "../../lib/prisma";

const allTutors = async () => {
  const tutors = await prisma.user.findMany();
  return tutors;
};

export const TutorService = {
  allTutors,
};
