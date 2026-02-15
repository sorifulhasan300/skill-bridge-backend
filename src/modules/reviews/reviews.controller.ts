import { NextFunction, Request, Response } from "express";
import { ReviewService } from "./reviews.service";

const postReviewAndCloseBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload = req.body;
  try {
    await ReviewService.postReviewAndCloseBooking(payload);
    res.status(201).json({
      success: true,
      message: "Review successfully created",
    });
  } catch (error) {
    next(error);
  }
};

export const ReviewController = {
  postReviewAndCloseBooking,
};
