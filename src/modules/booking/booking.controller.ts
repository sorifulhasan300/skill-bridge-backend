import { NextFunction, Request, Response } from "express";
import { bookingService } from "./booking.service";
import { parseQueryParams } from "../../lib/parse-query-params";

const bookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(400).json({ message: "Student id not found" });
    }
    const queryOptions = parseQueryParams(req.query);
    const result = await bookingService.bookings(
      studentId as string,
      queryOptions,
    );
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
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

    if (!tutorId) {
      return res.status(400).json({ message: "Tutor id not found" });
    }
    const queryOptions = parseQueryParams(req.query);
    const result = await bookingService.tutorBookings(
      tutorId as string,
      queryOptions,
    );
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

const adminBookingManagement = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const queryOptions = parseQueryParams(req.query);
    const result = await bookingService.adminBookingManagement(queryOptions);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
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

const attendBooking = async (
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
  try {
    await bookingService.attendBooking(
      bookingId as string,
      userId as string,
      isAttending,
    );
    res.status(200).json({
      success: true,
      message: isAttending ? "Student attended" : "Student left the session",
    });
  } catch (error: any) {
    next(error);
  }
};
export const bookingController = {
  bookings,
  createBooking,
  bookingDetails,
  updateBookingStatus,
  tutorBooking,
  adminBookingManagement,
  attendBooking,
};
