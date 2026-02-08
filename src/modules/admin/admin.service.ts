import { prisma } from "../../lib/prisma";

const allUsers = async () => {
  const tutors = await prisma.user.findMany();
  return tutors;
};

const updateUserStatus = async (id: string, status: any) => {
  const response = await prisma.user.update({
    where: { id },
    data: { status },
  });
  return response;
};

export const AdminServices = {
  allUsers,
  updateUserStatus,
};
