import { prisma } from "../../lib/prisma";

const postReview = async (payload: any) => {
  const response = await prisma.review.create({ data: payload });
  if (!response) {
    throw new Error("REVIEW_NOT_FOUND");
  }
  return response;
};

export const ReviewService = {
  postReview,
};
