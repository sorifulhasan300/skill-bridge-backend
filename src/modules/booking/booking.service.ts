import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../lib/query-builder";
import { QueryOptions, QueryResult } from "../../types/query.types";

const bookings = async (studentId: string, queryOptions?: QueryOptions) => {
  console.log("Received query options:", queryOptions);
  const queryBuilder = new QueryBuilder(prisma.booking);

  // Default filters and includes for student view
  queryBuilder.where({ studentId });
  queryBuilder.include(queryOptions?.includes || { tutor: true });

  // Apply additional query options
  if (queryOptions?.filters) {
    queryBuilder.where(queryOptions.filters);
  }

  if (queryOptions?.search) {
    queryBuilder.search(queryOptions.search, ["tutorName", "tutorEmail"]);
  }

  if (queryOptions?.sort) {
    queryBuilder.orderBy(queryOptions.sort as any);
  }

  if (queryOptions?.pagination) {
    queryBuilder.paginate(queryOptions.pagination);
  }

  return await queryBuilder.executeWithCount();
};

const tutorBookings = async (tutorId: string, queryOptions?: QueryOptions) => {
  const queryBuilder = new QueryBuilder(prisma.booking);

  // Default filters and includes for tutor view
  queryBuilder.where({ tutor: { userId: tutorId } });
  queryBuilder.include(
    queryOptions?.includes || {
      student: { select: { email: true, name: true } },
    },
  );

  // Apply additional query options
  if (queryOptions?.filters) {
    queryBuilder.where(queryOptions.filters);
  }

  if (queryOptions?.search) {
    queryBuilder.search(queryOptions.search, ["studentName", "studentEmail"]);
  }

  if (queryOptions?.sort) {
    queryBuilder.orderBy(queryOptions.sort as any);
  }

  if (queryOptions?.pagination) {
    queryBuilder.paginate(queryOptions.pagination);
  }

  return await queryBuilder.executeWithCount();
};

const adminBookingManagement = async (
  queryOptions?: QueryOptions,
): Promise<QueryResult<any>> => {
  console.log("Received query options:", queryOptions);

  const queryBuilder = new QueryBuilder(prisma.booking);

  // Default includes for admin view
  const defaultIncludes = {
    student: { select: { email: true, name: true } },
    tutor: { include: { user: { select: { name: true, email: true } } } },
  };

  // Apply query options
  if (queryOptions?.filters) {
    queryBuilder.where(queryOptions.filters);
  }

  if (queryOptions?.search) {
    queryBuilder.search(queryOptions.search, [
      "studentName",
      "studentEmail",
      "tutorName",
      "tutorEmail",
    ]);
  }

  if (queryOptions?.sort) {
    queryBuilder.orderBy(queryOptions.sort as any);
  }

  if (queryOptions?.pagination) {
    queryBuilder.paginate(queryOptions.pagination);
  }

  queryBuilder.include(queryOptions?.includes || defaultIncludes);

  return await queryBuilder.executeWithCount();
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
