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

const createBooking = async (payload: {
  studentId: string;
  tutorId: string;
  amount: number;
  startTime: string;
  endTime: string;
}) => {
  const { studentId, tutorId, amount, startTime, endTime } = payload;

  const conflict = await prisma.booking.findFirst({
    where: {
      tutorId,
      OR: [
        {
          startTime: { lt: new Date(endTime) },
          endTime: { gt: new Date(startTime) },
        },
      ],
    },
  });

  if (conflict) {
    throw new Error("Tutor already booked");
  }

  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  if (end <= start) {
    throw new Error(
      "Invalid time range: End time must be later than start time.",
    );
  }
  const response = await prisma.booking.create({
    data: {
      studentId,
      tutorId,
      amount,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    },
  });
  return response;
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
