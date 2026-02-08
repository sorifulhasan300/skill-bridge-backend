import { prisma } from "../../lib/prisma";

const createCategory = async (payload: any) => {
  try {
    const data = await prisma.category.create({ data: payload });
    return data;
  } catch (error) {
    return error;
  }
};

const getCategories = async (query: string) => {
  try {
    const data = await prisma.category.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
      },
    });
    return data;
  } catch (error) {
    return error;
  }
};

const deleteCategories = async (catId: string) => {
  try {
    const data = await prisma.category.delete({ where: { id: catId } });
    return data;
  } catch (error) {
    return error;
  }
};

export const CategoryService = {
  createCategory,
  getCategories,
  deleteCategories,
};
