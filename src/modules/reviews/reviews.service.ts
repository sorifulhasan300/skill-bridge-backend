import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export const postReviewAndCloseBooking = async (payload: {
  tutorId: string;
  studentId: string;
  comment: string;
  rating: number;
  bookingId: string;
}) => {
  const { tutorId, studentId, comment, rating, bookingId } = payload;

  await prisma.$transaction(async (tx) => {
    await tx.review.create({
      data: {
        tutorId,
        studentId,
        comment,
        rating,
      },
    });

    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new Error("Booking not found");

    const tutor = await tx.tutorProfile.findUnique({
      where: { id: tutorId },
    });

    if (tutor) {
      const timeSlots = tutor.timeSlots as any;
      const dayKey = booking.day.toLowerCase().slice(0, 3);

      const updatedDaySlots = timeSlots[dayKey].map((slot: any) => {
        if (slot.id === booking.slotId) {
          return { ...slot, isBooked: false };
        }
        return slot;
      });

      await tx.tutorProfile.update({
        where: { id: tutorId },
        data: {
          timeSlots: {
            ...timeSlots,
            [dayKey]: updatedDaySlots,
          },
        },
      });
    }

    await tx.booking.delete({
      where: { id: bookingId },
    });

    return { success: true, message: "Review posted and booking closed." };
  });
};
export const ReviewService = {
  postReviewAndCloseBooking,
};
