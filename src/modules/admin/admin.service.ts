import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const allUsers = async () => {
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["TUTOR", "STUDENT"],
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      image: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return users;
};

const updateUserStatus = async (id: string, status: UserStatus) => {
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
