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

const featuredTutors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await TutorService.featuredTutors();
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
    const userId = req.user?.id;
    const data = await TutorService.createTutorProfile(
      payload,
      userId as string,
    );
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

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
    const newStatus = req.body.availability;
    const id = req.params.id;
    const userId = req.user?.id;
    const data = await TutorService.updateVisibility(
      id as string,
      userId as string,
      newStatus,
    );
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
    const id = req.user?.id;
    await TutorService.updateTutorProfile(id as string, payload);
    res.status(200).json({
      success: true,
      message: "Profile update successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.user?.id;
    const data = await TutorService.getTutorProfile(id as string);
    res.status(200).json({
      success: true,
      data: data,
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
  featuredTutors,
  getTutorProfile,
};
