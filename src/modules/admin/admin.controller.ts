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

const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const status = req.body;
    const result = await AdminServices.updateUserStatus(id as string, status);
    res.status(200).json({
      success: true,
      message: "User status update successfully",
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  allUsers,
  updateUserStatus,
};
