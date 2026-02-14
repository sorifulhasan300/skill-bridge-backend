import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const postReview = async (payload: any) => {
  await prisma.review.create({ data: payload });
};
export const ReviewService = {
  postReview,
};
