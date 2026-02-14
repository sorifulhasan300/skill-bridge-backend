import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./category.service";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = req.body;
    const data = await CategoryService.createCategory(payload);
    res.status(201).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = req.body;
    const catId = req.params.id;
    await CategoryService.updateCategory(catId as string, payload);
    res.status(201).json({
      success: true,
      message: "Category update successfully",
    });
  } catch (error) {
    next(error);
  }
};
const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const searchValue =
      typeof req.query.search === "string" ? req.query.search : "";
    const data = await CategoryService.getCategories(searchValue);
    res.status(201).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const catId = req.params.id;
    const data = await CategoryService.deleteCategories(catId as string);
    res.status(200).json({
      success: true,
      message: "category delete successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const CategoryController = {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
};
