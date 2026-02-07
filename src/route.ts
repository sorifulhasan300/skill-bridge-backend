import { Router, Express } from "express";
import { TutorRoute } from "./modules/tutor/tutor.route";
import { categoryRouter } from "./modules/category/category.route";
import { adminRoutes } from "./modules/admin/admin.route";

const router: Router = Router();

router.use("/tutors", TutorRoute);
router.use("/student", TutorRoute);
router.use("/category", categoryRouter);
router.use("/api/admin/users", adminRoutes);

export default router;
