import { NextFunction, Request, Response } from "express";
import { AdminServices } from "./admin.service";

const allUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AdminServices.allUsers();
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
const statistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AdminServices.statistics();
    res.status(200).json({
      success: true,
      data: data,
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
    const { status } = req.body;
    const data = await AdminServices.updateUserStatus(id as string, status);
    res.status(200).json({
      success: true,
      message: "User status update successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  allUsers,
  updateUserStatus,
  statistics,
};
