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
          success: false,
          message: "Duplicate value. This already exists.",
          fields: err.meta?.target,
        });
      case "P2003":
        return res.status(400).json({
          success: false,
          message: "Invalid reference. Related record not found.",
        });
      case "P2025":
        return res.status(404).json({
          success: false,
          message: "Record not found.",
        });
      default:
        return res.status(400).json({
          success: false,
          message: "Database error.",
          code: err.code,
        });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: "Invalid request data. Please check your input fields.",
    });
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return res.status(500).json({
      success: false,
      message: "Database connection failed.",
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  if (err.data?.code === "P2002") {
    return res
      .status(400)
      .json({ success: false, message: "Category already exists!" });
  }

  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};
