import { NextFunction, Request, Response } from "express";
import { AdminServices } from "./admin.service";
import catchAsync from "../../utils/catch.async";
import sendResponse from "../../utils/send.response";


const allUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const response = await AdminServices.allUsers(req.query);
  sendResponse(res, {
    success: true,
    message: "Users retrieved successfully",
    data: response.data,
    meta: response.meta,
    statusCode: 200,
  });
})
const statistics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const response = await AdminServices.statistics(req.query);
  sendResponse(res, {
    success: true,
    message: "Statistics retrieved successfully",
    data: response,
    meta: {
      page: Number(req.query?.page) || 1,
      limit: Number(req.query?.limit) || 10,
      total: 1,
    },
    statusCode: 200,
  });
})


const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { status } = req.body;
  const response = await AdminServices.updateUserStatus(id as string, status);
  sendResponse(res, {
    success: true,
    message: "User status updated successfully",
    data: response,
    statusCode: 200,
  });
})



export const AdminController = {
  allUsers,
  updateUserStatus,
  statistics,
};
