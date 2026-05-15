import { NextFunction, Request, Response } from "express";
import { AnalyticsService } from "./analytics.service";
import catchAsync from "../../utils/catch.async";
import sendResponse from "../../utils/send.response";

const getAdminAnalytics = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = await AnalyticsService.getAdminAnalytics(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin analytics retrieved successfully",
    data: result,
  });
});

export const AnalyticsController = {
  getAdminAnalytics,
};