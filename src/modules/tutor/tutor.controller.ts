import { NextFunction, Request, Response } from "express";
import { TutorService } from "./tutor.service";
import catchAsync from "../../utils/catch.async";
import sendResponse from "../../utils/send.response";
  
const allTutors = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const queries = req.query;
    const data = await TutorService.allTutors(queries);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: data.data,
      meta:data.meta
    });
});

const featuredTutors = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await TutorService.featuredTutors();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: data,
    });
});
  


const createTutorProfile = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload = req.body;
  const userId = req.user?.id;
  const data = await TutorService.createTutorProfile(
    payload,
    userId as string,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tutor profile created successfully",
    data: data,
  });
});

const tutorDetails = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const tutorId = req.params.id as string;
  const data = await TutorService.tutorDetails(tutorId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tutor details retrieved successfully",
    data: data,
  });
});

const updateVisibility = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const newStatus = req.body.availability;
  const id = req.params.id;
  const userId = req.user?.id;
  const data = await TutorService.updateVisibility(
    id as string,
    userId as string,
    newStatus,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Visibility updated successfully",
    data: data,
  });
});
const updateTutorProfile = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload = req.body;
  const id = req.user?.id;
  await TutorService.updateTutorProfile(id as string, payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated successfully",
  });
});

const getTutorProfile = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.user?.id;
  const data = await TutorService.getTutorProfile(id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tutor profile retrieved successfully",
    data: data,
  });
});

export const TutorController = {
  allTutors,
  createTutorProfile,
  tutorDetails,
  updateVisibility,
  updateTutorProfile,
  featuredTutors,
  getTutorProfile,
};
