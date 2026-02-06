import { NextFunction, Request, Response } from "express";
import { TutorService } from "./tutor.service";

const allTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queries = req.query;
    const result = await TutorService.allTutors(queries);
    res.status(200).json({
      success: true,
      data: result,
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
    const data = req.body;
    const result = await TutorService.createTutorProfile(data);
    res.status(200).json({
      success: true,
      data: result,
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
    const result = await TutorService.tutorDetails(tutorId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const TutorController = {
  allTutors,
  createTutorProfile,
  tutorDetails,
};
