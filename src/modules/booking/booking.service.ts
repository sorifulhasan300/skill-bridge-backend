import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import QueryBuilder from "../../lib/query-builder";

const bookings = async (studentId: string, query: any) => {
  // Flatten nested filters structure
  const flattenedQuery = { ...query };
  if (query.filters && typeof query.filters === 'object') {
    Object.assign(flattenedQuery, query.filters);
    delete flattenedQuery.filters;
  }

  // Handle nested sort parameters if present
  if (query.sort && typeof query.sort === 'object') {
    flattenedQuery.sort = Object.values(query.sort)[0] as string;
  }
  if (query.sortOrder && typeof query.sortOrder === 'object') {
    flattenedQuery.sortOrder = Object.values(query.sortOrder)[0] as string;
  }

  const queryBuilder = new QueryBuilder({}, flattenedQuery)
    .search(["tutorName", "tutorEmail"])
    .filter()
    .sort()
    .paginate()
    .fields();

  // Apply student filter manually since it's specific to this query
  queryBuilder.modelQuery.where = {
    ...queryBuilder.modelQuery.where,
    studentId,
  };

  // Add includes for tutor information
  queryBuilder.modelQuery.include = {
    tutor: {
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    },
  };

  const [data, total] = await Promise.all([
    prisma.booking.findMany(queryBuilder.modelQuery),
    prisma.booking.count({ where: queryBuilder.modelQuery.where })
  ]);

  return {
    meta: {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      total,
    },
    data,
  };
};

const tutorBookings = async (tutorId: string, query: any) => {
  // Flatten nested filters structure
  const flattenedQuery = { ...query };
  if (query.filters && typeof query.filters === 'object') {
    Object.assign(flattenedQuery, query.filters);
    delete flattenedQuery.filters;
  }

  // Handle nested sort parameters if present
  if (query.sort && typeof query.sort === 'object') {
    flattenedQuery.sort = Object.values(query.sort)[0] as string;
  }
  if (query.sortOrder && typeof query.sortOrder === 'object') {
    flattenedQuery.sortOrder = Object.values(query.sortOrder)[0] as string;
  }

  const queryBuilder = new QueryBuilder({}, flattenedQuery)
    .search(["studentName", "studentEmail"])
    .filter()
    .sort()
    .paginate()
    .fields();

  // Apply tutor filter manually since it's specific to this query
  queryBuilder.modelQuery.where = {
    ...queryBuilder.modelQuery.where,
    tutor: {
      userId: tutorId,
    },
  };

  // Add includes for student information
  queryBuilder.modelQuery.include = {
    student: {
      select: {
        name: true,
        email: true,
      },
    },
  };

  const [data, total] = await Promise.all([
    prisma.booking.findMany(queryBuilder.modelQuery),
    prisma.booking.count({ where: queryBuilder.modelQuery.where })
  ]);

  return {
    meta: {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      total,
    },
    data,
  };
};

const adminBookingManagement = async (query: any) => {
  // Flatten nested filters structure
  const flattenedQuery = { ...query };
  if (query.filters && typeof query.filters === 'object') {
    Object.assign(flattenedQuery, query.filters);
    delete flattenedQuery.filters;
  }

  // Handle nested sort parameters if present
  if (query.sort && typeof query.sort === 'object') {
    flattenedQuery.sort = Object.values(query.sort)[0] as string;
  }
  if (query.sortOrder && typeof query.sortOrder === 'object') {
    flattenedQuery.sortOrder = Object.values(query.sortOrder)[0] as string;
  }

  const queryBuilder = new QueryBuilder({}, flattenedQuery)
    .search(["studentName", "studentEmail", "tutorName", "tutorEmail"])
    .filter()
    .sort()
    .paginate()
    .fields();

  // Add includes for admin view
  queryBuilder.modelQuery.include = {
    student: {
      select: {
        name: true,
        email: true,
      },
    },
    tutor: {
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    },
  };

  const [data, total] = await Promise.all([
    prisma.booking.findMany(queryBuilder.modelQuery),
    prisma.booking.count({ where: queryBuilder.modelQuery.where })
  ]);

  return {
    meta: {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      total,
    },
    data,
  };
};

const createBooking = async (payload: {
  tutorId: string;
  day: string;
  slotId: string;
  studentId: string;
}) => {
  const { tutorId, day, slotId, studentId } = payload;

  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    select: { timeSlots: true, hourlyRate: true },
  });

  if (!tutor) throw new Error("Tutor not found");

  const timeSlots = tutor.timeSlots as any;
  const dayKey = day.toLowerCase().slice(0, 3);

  const targetSlot = timeSlots[dayKey].find((s: any) => s.id === slotId);
  if (!targetSlot || targetSlot.isBooked) throw new Error("Slot not available");

  await prisma.$transaction([
    prisma.tutorProfile.update({
      where: { id: tutorId },
      data: {
        timeSlots: {
          ...timeSlots,
          [dayKey]: timeSlots[dayKey].map((s: any) =>
            s.id === slotId ? { ...s, isBooked: true } : s,
          ),
        },
      },
    }),
    prisma.booking.create({
      data: {
        studentId,
        tutorId,
        slotId,
        day,
        startTime: targetSlot.start,
        endTime: targetSlot.end,
        amount: tutor.hourlyRate,
      },
    }),
  ]);

  return { success: true };
};

const bookingDetails = async (id: string) => {
  const response = await prisma.booking.findUnique({
    where: { id },
  });
  return response;
};

const updateBookingStatus = async (
  bookingId: string,
  userId: string,
  newStatus: BookingStatus,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutor: true },
  });

  if (!booking) throw new Error("Booking not found");

  const shouldReleaseSlot =
    newStatus === "CANCELLED" || newStatus === "COMPLETED";

  return await prisma.$transaction(async (tx) => {
    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: { status: newStatus as any },
    });

    if (shouldReleaseSlot) {
      const timeSlots = booking.tutor.timeSlots as any;
      const dayKey = booking.day.toLowerCase().slice(0, 3);

      const updatedDaySlots = timeSlots[dayKey].map((slot: any) => {
        if (slot.id === booking.slotId) {
          return { ...slot, isBooked: false };
        }
        return slot;
      });

      await tx.tutorProfile.update({
        where: { id: booking.tutorId },
        data: {
          timeSlots: {
            ...timeSlots,
            [dayKey]: updatedDaySlots,
          },
        },
      });
    }

    return updatedBooking;
  });
};

const attendBooking = async (
  bookingId: string,
  userId: string,
  isAttending: boolean,
) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      studentId: userId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found or unauthorized");
  }

  return await prisma.booking.update({
    where: { id: bookingId },
    data: {
      studentAttend: isAttending,
    },
  });
};

export const bookingService = {
  bookings,
  createBooking,
  bookingDetails,
  updateBookingStatus,
  tutorBookings,
  adminBookingManagement,
  attendBooking,
};
