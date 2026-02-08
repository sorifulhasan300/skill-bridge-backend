import { prisma } from "../../lib/prisma";

const bookings = async () => {
  const response = await prisma.booking.findMany();
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
    throw new Error("Tutor already booked in this time slot");
  }
  if (new Date(endTime) <= new Date(startTime)) {
    throw new Error("End time must be after start time");
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

export const bookingService = {
  bookings,
  createBooking,
};
