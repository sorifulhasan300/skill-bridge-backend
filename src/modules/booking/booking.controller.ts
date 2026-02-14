import { NextFunction, Request, Response } from "express";
import { bookingService } from "./booking.service";

const bookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(400).json({ message: "Student id not found" });
    }
    const data = await bookingService.bookings(studentId as string);
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const tutorBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tutorId = req.user?.id;
    console.log("tutorbooking ", tutorId);

    if (!tutorId) {
      return res.status(400).json({ message: "Tutor id not found" });
    }
    const data = await bookingService.tutorBookings(tutorId as string);
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const adminBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await bookingService.adminBooking();
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.body.studentId !== req.user?.id) {
      return res.status(400).json({ message: "user not match" });
    }
    await bookingService.createBooking(req.body);
    res.status(200).json({
      success: true,
      data: "booking create successfully",
    });
  } catch (error) {
    next(error);
  }
};

const bookingDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    if (!req.params.id) {
      return res.status(400).json({ message: "id is required" });
    }
    const data = await bookingService.bookingDetails(id as string);

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  const bookingId = req.params.id;
  const { status: newStatus } = req.body;
  console.log(userId, bookingId, newStatus);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!newStatus) {
    return res.status(400).json({ message: "Status is required" });
  }
  try {
    const data = await bookingService.updateBookingStatus(
      bookingId as string,
      userId as string,
      newStatus,
    );
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error?.message || "something went wrong",
    });
  }
};

export const bookingController = {
  bookings,
  createBooking,
  bookingDetails,
  updateBookingStatus,
  tutorBooking,
  adminBooking,
};
