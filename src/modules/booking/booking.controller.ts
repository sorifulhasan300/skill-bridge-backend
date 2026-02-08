import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { bookingService } from "./booking.service";

const bookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bookingService.bookings();
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
    const result = await bookingService.createBooking(req.body);
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
};
