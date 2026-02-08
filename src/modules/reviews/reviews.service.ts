import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const postReview = async (payload: any) => {
  try {
    return await prisma.review.create({ data: payload });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("DUPLICATE_REVIEW");
    }

    throw error;
  }
};
export const ReviewService = {
  postReview,
};
