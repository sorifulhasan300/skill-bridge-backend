import { prisma } from "../../lib/prisma";
import QueryBuilder from "../../lib/query-builder";

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
const getCategories = async (query: any) => {
  const queryBuilder = new QueryBuilder({}, query)
    .search(["name"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [data, total] = await Promise.all([
    prisma.category.findMany(queryBuilder.modelQuery),
    prisma.category.count({ where: queryBuilder.modelQuery.where })
  ]);

  return {
    meta: {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      total,
    },
    data,
  };
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
