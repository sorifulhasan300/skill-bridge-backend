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
const statistics = async () => {
  const [
    totalUsers,
    totalTutors,
    totalBookings,
    revenueData,
    bookingStats,
    recentBookings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.tutorProfile.count(),
    prisma.booking.count(),

    prisma.booking.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    }),

    prisma.booking.groupBy({
      by: ["status"],
      _count: true,
    }),

    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        student: { select: { name: true } },
        tutor: { select: { user: { select: { name: true } } } },
      },
    }),
  ]);

  return {
    overview: {
      totalUsers,
      totalTutors,
      totalBookings,
      totalRevenue: revenueData._sum.amount || 0,
    },
    bookingStats,
    recentBookings,
  };
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
  statistics,
};
