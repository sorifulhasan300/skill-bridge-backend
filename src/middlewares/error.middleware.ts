import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return res.status(409).json({
          message: "Duplicate value. This already exists.",
          fields: err.meta?.target,
        });

      case "P2003":
        return res.status(400).json({
          message: "Invalid reference. Related record not found.",
        });

      case "P2025":
        return res.status(404).json({
          message: "Record not found.",
        });

      case "P2011":
        return res.status(400).json({
          message: "Required field cannot be null.",
        });

      default:
        return res.status(400).json({
          message: "Database error.",
          code: err.code,
        });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: "Invalid request data.",
    });
  }

  if (err.message === "BOOKING_NOT_FOUND") {
    return res.status(404).json({ message: "Booking not found" });
  }
  if (err.message === "TUTOR_ALREADY_BOOKED") {
    return res.status(404).json({ message: "Tutor already booked this time" });
  }
  if (err.message === "BOOKING_TIME_CONFLICT") {
    return res
      .status(404)
      .json({ message: "End time must be after start time" });
  }
  if (err.message === "You have already submitted a review for this item") {
    return res
      .status(404)
      .json({ message: "End time must be after start time" });
  }
  if (err.message === "REVIEW_NOT_FOUND") {
    return res.status(404).json({ message: "Review not found" });
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return res.status(500).json({
      message: "Database connection failed.",
    });
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return res.status(500).json({
      message: "Unexpected database error.",
    });
  }

  return res.status(500).json({
    message: "Internal server error.",
  });
};
