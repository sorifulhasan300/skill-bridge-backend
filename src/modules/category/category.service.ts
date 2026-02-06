import { prisma } from "../../lib/prisma";

const createCategory = async (data: any) => {
  try {
    const result = await prisma.category.create({ data });
    return result;
  } catch (error) {
    return error;
  }
};

export const CategoryService = {
  createCategory,
};
