import { Request, Response } from "express";
import { TutorService } from "./tutor.service";

const allTutors = async (req: Request, res: Response) => {
  try {
    const result = await TutorService.allTutors();
    console.log(result);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something was wrong",
      error: error,
    });
  }
};

export const TutorController = {
  allTutors,
};
