import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./category.service";
import catchAsync from "../../utils/catch.async";
import sendResponse from "../../utils/send.response";

const createCategory = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload = req.body;
  const data = await CategoryService.createCategory(payload);
  sendResponse(res, {
    success: true,
    message: "Category created successfully",
    data: data,
    statusCode: 201,
  });
});
const updateCategory = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload = req.body;
  const catId = req.params.id;
  await CategoryService.updateCategory(catId as string, payload);
  sendResponse(res, {
    success: true,
    message: "Category updated successfully",
    data: null,
    statusCode: 200,
  });
});
const getCategories = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = await CategoryService.getCategories(req.query);
  sendResponse(res, {
    success: true,
    message: "Categories retrieved successfully",
    data: result.data,
    meta: result.meta,
    statusCode: 200,
  });
});

const deleteCategory = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const catId = req.params.id;
  await CategoryService.deleteCategories(catId as string);
  sendResponse(res, {
    success: true,
    message: "Category deleted successfully",
    data: null,
    statusCode: 200,
  });
});

export const CategoryController = {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
};
