import { Router, Express } from "express";
import { TutorRoute } from "./modules/tutor/tutor.route";

const router: Router = Router();

router.use("/tutors", TutorRoute.router);

export default router;
