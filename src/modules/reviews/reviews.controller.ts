import { NextFunction, Request, Response } from "express";
import { ReviewService } from "./reviews.service";

const postReview = async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  try {
    const data = await ReviewService.postReview(payload);
    res.status(201).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export const ReviewController = {
  postReview,
};
