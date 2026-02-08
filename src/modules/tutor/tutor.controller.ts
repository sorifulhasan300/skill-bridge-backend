import { NextFunction, Request, Response } from "express";
import { TutorService } from "./tutor.service";

const allTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queries = req.query;
    const data = await TutorService.allTutors(queries);
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const createTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = req.body;
    const data = await TutorService.createTutorProfile(payload);
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

// get tutor details

const tutorDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tutorId = req.params.id as string;
    const data = await TutorService.tutorDetails(tutorId);
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const updateVisibility = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = req.body as { availability: string };
    const id = req.params.id;
    const data = await TutorService.updateVisibility(id as string, payload);
    res.status(200).json({
      success: true,
      message: "Visibility update successfully",
    });
  } catch (error) {
    next(error);
  }
};
const updateTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = req.body;
    const id = req.params.id;
    const data = await TutorService.updateTutorProfile(id as string, payload);
    res.status(200).json({
      success: true,
      message: "Profile update successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const TutorController = {
  allTutors,
  createTutorProfile,
  tutorDetails,
  updateVisibility,
  updateTutorProfile,
};
