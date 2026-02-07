import { NextFunction, Request, Response } from "express";
import { AdminServices } from "./admin.service";

const allUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminServices.allUsers();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  allUsers,
};
