import { Router, Express } from "express";
import { TutorRoute } from "./modules/tutor/tutor.route";

const router: Router = Router();

router.use("/tutor", TutorRoute.router);
router.use("/student", TutorRoute.router);
router.use("/admin", TutorRoute.router);

export default router;
