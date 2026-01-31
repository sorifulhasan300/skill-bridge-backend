import { Router } from "express";
import { TutorController } from "./tutor.controller";
import { middleware, UserRole } from "../../middlewares/auth.middleware";

const router: Router = Router();

router.get("/", middleware(UserRole.ADMIN), TutorController.allTutors);

export const TutorRoute = {
  router,
};
