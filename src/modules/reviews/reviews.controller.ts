import { NextFunction, Request, Response } from "express";
import { ReviewService } from "./reviews.service";
import catchAsync from "../../utils/catch.async";
import sendResponse from "../../utils/send.response";



const postReviewAndCloseBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  await ReviewService.postReviewAndCloseBooking(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review successfully created",
  });
});

export const ReviewController = {
  postReviewAndCloseBooking,
};
