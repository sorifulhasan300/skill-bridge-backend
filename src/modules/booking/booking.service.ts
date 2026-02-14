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
  console.log(newStatus);
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
  console.log(isAttending, bookingId, userId);
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
  adminBooking,
  attendBooking,
};
