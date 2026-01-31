import { Router } from "express";
import { TutorController } from "./tutor.controller";

const router: Router = Router();

router.get("/", TutorController.allTutors);

export const TutorRoute = {
  router,
};
