import { NextFunction, Request, Response } from "express";
import { bookingService } from "./booking.service";
import catchAsync from "../../utils/catch.async";
import sendResponse from "../../utils/send.response";

const bookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) {
    return sendResponse(res, {
      success: false,
      message: "Student id not found",
      data: null,
      statusCode: 400,
    });
  }
  const result = await bookingService.bookings(studentId as string, req.query);
  sendResponse(res, {
    success: true,
    message: "Bookings retrieved successfully",
    data: result.data,
    meta: result.meta,
    statusCode: 200,
  });
});

const tutorBooking = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const tutorId = req.user?.id;

  if (!tutorId) {
    return res.status(400).json({ message: "Tutor id not found" });
  }
  const result = await bookingService.tutorBookings(tutorId as string, req.query);
  sendResponse(res, {
    success: true,
    message: "Tutor bookings retrieved successfully",
    data: result.data,
    meta: result.meta,
    statusCode: 200,
  });
});

const adminBookingManagement = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = await bookingService.adminBookingManagement(req.query);
  sendResponse(res, {
    success: true,
    message: "Admin bookings retrieved successfully",
    data: result.data,
    meta: result.meta,
    statusCode: 200,
  });
});

const createBooking = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.studentId !== req.user?.id) {
    return res.status(400).json({ message: "user not match" });
  }
  await bookingService.createBooking(req.body);
  sendResponse(res, {
    success: true,
    message: "Booking created successfully",
    data: null,
    statusCode: 200,
  });
});

const bookingDetails = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  if (!req.params.id) {
    return res.status(400).json({ message: "id is required" });
  }
  const data = await bookingService.bookingDetails(id as string);
  sendResponse(res, {
    success: true,
    message: "Booking details retrieved successfully",
    data: data,
    statusCode: 200,
  });
});

const updateBookingStatus = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  const bookingId = req.params.id;
  const { status: newStatus } = req.body;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!newStatus) {
    return res.status(400).json({ message: "Status is required" });
  }
  const data = await bookingService.updateBookingStatus(
    bookingId as string,
    userId as string,
    newStatus,
  );
  sendResponse(res, {
    success: true,
    message: "Booking status updated successfully",
    data: data,
    statusCode: 200,
  });
});

const attendBooking = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  const bookingId = req.params.id;
  const { isAttending } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  await bookingService.attendBooking(
    bookingId as string,
    userId as string,
    isAttending,
  );
  sendResponse(res, {
    success: true,
    message: isAttending ? "Student attended" : "Student left the session",
    data: null,
    statusCode: 200,
  });
});
export const bookingController = {
  bookings,
  createBooking,
  bookingDetails,
  updateBookingStatus,
  tutorBooking,
  adminBookingManagement,
  attendBooking,
};
