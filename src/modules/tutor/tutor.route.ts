import { Router } from "express";
import { TutorController } from "./tutor.controller";
import { middleware, UserRole } from "../../middlewares/auth.middleware";

const router: Router = Router();

router.get("/", TutorController.allTutors);

router.get("/featured", TutorController.featuredTutors);

router.get("/:id", TutorController.tutorDetails);

router.post(
  "/create-profile",
  middleware(UserRole.TUTOR),
  TutorController.createTutorProfile,
);
router.patch(
  "/:id/availability",
  middleware(UserRole.TUTOR),
  TutorController.updateVisibility,
);
router.get(
  "/tutor/profile",
  middleware(UserRole.TUTOR),
  TutorController.getTutorProfile,
);
router.patch(
  "/update/profile",
  middleware(UserRole.TUTOR),
  TutorController.updateTutorProfile,
);

export const TutorRoute = router;
