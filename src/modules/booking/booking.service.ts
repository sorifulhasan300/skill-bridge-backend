import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const bookings = async (studentId: string) => {
  const response = await prisma.booking.findMany({
    where: { studentId },
    include: { tutor: true },
  });
  return response;
};

const tutorBookings = async (tutorId: string) => {
  console.log(tutorId);
  const response = await prisma.booking.findMany({
    where: { tutor: { userId: tutorId } },
    include: { student: { select: { email: true, name: true } } },
  });
  return response;
};

const adminBooking = async () => {
  const response = await prisma.booking.findMany({
    include: {
      student: { select: { email: true, name: true } },
    },
  });
  return response;
};

export const createBooking = async (payload: {
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
  const existingBooking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
      tutor: {
        userId,
      },
    },
    include: {
      tutor: {
        select: { userId: true },
      },
    },
  });
  console.log(existingBooking?.tutor.userId);
  if (!existingBooking) {
    throw new Error("Booking not found");
  }
  if (
    existingBooking.tutor.userId !== userId &&
    existingBooking.studentId !== userId
  ) {
    throw new Error("You are not authorized to update this booking");
  }
  if (
    existingBooking.status === "CANCELLED" ||
    existingBooking.status === "COMPLETED"
  ) {
    throw new Error(
      `Cannot update a booking that is already ${existingBooking.status}`,
    );
  }
  if (newStatus === "COMPLETED" && existingBooking.tutor.userId !== userId) {
    throw new Error("Only tutors can mark a booking as completed");
  }
  const res = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: newStatus,
    },
  });
  return res;
};
export const bookingService = {
  bookings,
  createBooking,
  bookingDetails,
  updateBookingStatus,
  tutorBookings,
  adminBooking,
};
