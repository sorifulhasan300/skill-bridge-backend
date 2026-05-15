import { prisma } from "../../lib/prisma";

// Comprehensive Admin Analytics - Single endpoint for all analytics data
const getAdminAnalytics = async (query: any) => {
  const { startDate, endDate } = query;

  const dateFilter: any = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.gte = new Date(startDate);
    if (endDate) dateFilter.createdAt.lte = new Date(endDate);
  }

  // Stats Cards - Key metrics for dashboard
  const [
    totalUsers,
    totalTutors,
    totalStudents,
    totalBookings,
    totalRevenue,
    activeUsers,
    completedBookings,
    pendingBookings,
    cancelledBookings,
    totalReviews,
  ] = await Promise.all([
    prisma.user.count({ where: dateFilter }),
    prisma.tutorProfile.count({ where: dateFilter }),
    prisma.user.count({ where: { ...dateFilter, role: "STUDENT" } }),
    prisma.booking.count({ where: dateFilter }),
    prisma.booking.aggregate({
      where: { ...dateFilter, status: "COMPLETED" },
      _sum: { amount: true },
    }),
    prisma.user.count({ where: { ...dateFilter, status: "ACTIVE" } }),
    prisma.booking.count({ where: { ...dateFilter, status: "COMPLETED" } }),
    prisma.booking.count({ where: { ...dateFilter, status: "CONFIRMED" } }),
    prisma.booking.count({ where: { ...dateFilter, status: "CANCELLED" } }),
    prisma.review.count({ where: dateFilter }),
  ]);

  // Pie Charts Data
  const [usersByRole, usersByStatus, bookingStats, availabilityStats, ratingDistribution] = await Promise.all([
    // User distribution by role (Pie Chart)
    prisma.user.groupBy({
      by: ["role"],
      _count: true,
      where: dateFilter,
    }),
    // User distribution by status (Pie Chart)
    prisma.user.groupBy({
      by: ["status"],
      _count: true,
      where: dateFilter,
    }),
    // Booking status distribution (Pie Chart)
    prisma.booking.groupBy({
      by: ["status"],
      _count: true,
      where: dateFilter,
    }),
    // Tutor availability stats (Pie Chart)
    prisma.tutorProfile.groupBy({
      by: ["availability"],
      _count: true,
      where: dateFilter,
    }),
    // Rating distribution (Pie Chart)
    prisma.review.groupBy({
      by: ["rating"],
      _count: true,
      where: dateFilter,
    }),
  ]);

  // Bar Charts Data
  const [revenueByMonth, topTutorsByRevenue, topRatedTutors] = await Promise.all([
    // Revenue by month (Bar Chart)
    prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        SUM("amount") as revenue
      FROM "Booking"
      WHERE "status" = 'COMPLETED'
        ${startDate ? prisma.$queryRaw`AND "createdAt" >= ${new Date(startDate)}` : prisma.$queryRaw``}
        ${endDate ? prisma.$queryRaw`AND "createdAt" <= ${new Date(endDate)}` : prisma.$queryRaw``}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `,
    // Top tutors by revenue (Bar Chart)
    prisma.tutorProfile.findMany({
      include: {
        user: { select: { name: true, email: true } },
        bookings: {
          where: { ...dateFilter, status: "COMPLETED" },
          select: { amount: true },
        },
      },
      orderBy: { averageRating: "desc" },
      take: 10,
    }),
    // Top rated tutors (Bar Chart)
    prisma.tutorProfile.findMany({
      include: {
        user: { select: { name: true, image: true } },
      },
      orderBy: { averageRating: "desc" },
      take: 10,
    }),
  ]);

  const topTutorsByRevenueFormatted = topTutorsByRevenue.map((tutor) => ({
    id: tutor.id,
    name: tutor.user.name,
    email: tutor.user.email,
    averageRating: tutor.averageRating,
    totalReviews: tutor.totalReviews,
    hourlyRate: tutor.hourlyRate,
    totalRevenue: tutor.bookings.reduce((sum, b) => sum + b.amount, 0),
    totalBookings: tutor.bookings.length,
  }));

  // Additional metrics
  const [avgBookingValue, avgRating, featuredTutorsCount, completionRateData] = await Promise.all([
    prisma.booking.aggregate({
      where: { ...dateFilter, status: "COMPLETED" },
      _avg: { amount: true },
    }),
    prisma.review.aggregate({
      where: dateFilter,
      _avg: { rating: true },
    }),
    prisma.tutorProfile.count({
      where: { ...dateFilter, isFeatured: true },
    }),
    Promise.all([
      prisma.booking.count({ where: { ...dateFilter, status: "COMPLETED" } }),
      prisma.booking.count({ where: dateFilter }),
    ]),
  ]);

  const completionRate = completionRateData[1] > 0 ? (completionRateData[0] / completionRateData[1]) * 100 : 0;

  return {
    statsCards: {
      totalUsers,
      totalTutors,
      totalStudents,
      totalBookings,
      totalRevenue: totalRevenue._sum.amount || 0,
      activeUsers,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      totalReviews,
      avgBookingValue: avgBookingValue._avg.amount || 0,
      avgRating: avgRating._avg.rating || 0,
      completionRate,
      featuredTutorsCount,
    },
    pieCharts: {
      usersByRole,
      usersByStatus,
      bookingStats,
      availabilityStats,
      ratingDistribution,
    },
    barCharts: {
      revenueByMonth,
      topTutorsByRevenue: topTutorsByRevenueFormatted,
      topRatedTutors,
    },
  };
};

export const AnalyticsService = {
  getAdminAnalytics,
};