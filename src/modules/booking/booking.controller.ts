import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { bookingService } from "./booking.service";

const bookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(400).json({ message: "Student id not found" });
    }
    const result = await bookingService.bookings(studentId as string);
    res.status(200).json({
      success: true,
      data: result,
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
    if (req.body.userId !== req.user?.id) {
      return res.status(400).json({ message: "user not match" });
    }
    const result = await bookingService.createBooking(req.body);
    res.status(200).json({
      success: true,
      data: result,
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
    const result = await bookingService.bookingDetails(id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const bookingController = {
  bookings,
  createBooking,
  bookingDetails,
};
