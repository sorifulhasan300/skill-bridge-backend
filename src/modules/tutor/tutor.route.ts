import { Router } from "express";
import { TutorController } from "./tutor.controller";

const router: Router = Router();

router.get("/", TutorController.allTutors);
router.post("/create-profile", TutorController.createTutorProfile);
router.get("/:id", TutorController.tutorDetails);
router.patch("/:id/availability", TutorController.updateVisibility);
router.patch("/:id/profile", TutorController.updateTutorProfile);

export const TutorRoute = router;
