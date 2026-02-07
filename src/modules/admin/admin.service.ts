import { prisma } from "../../lib/prisma";

const allUsers = async () => {
  try {
    const tutors = await prisma.user.findMany();
    return tutors;
  } catch (error) {
    return error;
  }
};

export const AdminServices = {
  allUsers,
};
