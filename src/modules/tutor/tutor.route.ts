import { Router } from "express";
import { TutorController } from "./tutor.controller";

const router: Router = Router();

router.get("/", TutorController.allTutors);
router.post("/create-profile", TutorController.createTutorProfile);
router.get("/:id", TutorController.tutorDetails);

export const TutorRoute = router;
