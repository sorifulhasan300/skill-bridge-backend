import { NextFunction, Request, Response } from "express";
import { ReviewService } from "./reviews.service";

const postReview = async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  try {
    await ReviewService.postReview(payload);
    res.status(201).json({
      success: true,
      message: "Review successfully created",
    });
  } catch (error) {
    next(error);
  }
};

export const ReviewController = {
  postReview,
};
