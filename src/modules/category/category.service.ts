import { prisma } from "../../lib/prisma";

const createCategory = async (payload: any) => {
  const data = await prisma.category.create({ data: payload });
  return data;
};
const updateCategory = async (
  id: string,
  payload: { name?: string; icon?: string },
) => {
  const isExist = await prisma.category.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new Error("Category not found!");
  }
  await prisma.category.update({
    where: {
      id: id,
    },
    data: payload,
  });
};
const getCategories = async (query: string) => {
  const data = await prisma.category.findMany({
    where: {
      name: { contains: query, mode: "insensitive" },
    },
  });
  return data;
};

const deleteCategories = async (catId: string) => {
  const data = await prisma.category.delete({ where: { id: catId } });
  return data;
};

export const CategoryService = {
  createCategory,
  getCategories,
  deleteCategories,
  updateCategory,
};
