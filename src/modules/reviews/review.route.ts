import { Router } from "express";
import { ReviewController } from "./reviews.controller";
import { middleware, UserRole } from "../../middlewares/auth.middleware";

const router: Router = Router();

router.post("/", middleware(UserRole.USER), ReviewController.postReview);

export const ReviewRouter = router;
