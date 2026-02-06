import { Router, Express } from "express";
import { TutorRoute } from "./modules/tutor/tutor.route";
import { categoryRouter } from "./modules/category/category.route";

const router: Router = Router();

router.use("/tutor", TutorRoute);
router.use("/student", TutorRoute);
router.use("/category", categoryRouter);

export default router;
