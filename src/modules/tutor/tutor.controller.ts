import { NextFunction, Request, Response } from "express";
import { TutorService } from "./tutor.service";

const allTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await TutorService.allTutors();
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
};
