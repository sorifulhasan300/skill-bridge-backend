import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import QueryBuilder from "../../lib/query-builder";

const allUsers = async (query: any) => {
  console.log('all users')
  debugger
  const queryBuilder = new QueryBuilder({}, query)
    .search(["name", "email"])
    .filter()
    .sort()
    .paginate()
    .fields();

  // Apply role filter manually since it's specific to this query
  queryBuilder.modelQuery.where = {
    ...queryBuilder.modelQuery.where,
    role: {
      in: ["TUTOR", "STUDENT"],
    },
  };

  const [data, total] = await Promise.all([
    prisma.user.findMany(queryBuilder.modelQuery),
    prisma.user.count({ where: queryBuilder.modelQuery.where })
  ]);

  const users = data.map((user: any) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    image: user.image,
    role: user.role,
    createdAt: user.createdAt,
  }));

  return {
    meta: {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      total,
    },
    data: users,
  };
};
const statistics = async (query: any) => {
  const queryBuilder = new QueryBuilder(prisma.booking, query)
    .filter()
    .sort()
    .paginate();

  // Get recent bookings with query builder
  const recentBookingsQuery = {
    ...queryBuilder.modelQuery,
    take: 5,
    include: {
      student: { select: { name: true } },
      tutor: { select: { user: { select: { name: true } } } },
    },
  };

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

    prisma.booking.findMany(recentBookingsQuery),
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
