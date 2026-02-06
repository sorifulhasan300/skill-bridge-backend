import { Router } from "express";
import { CategoryController } from "./category.controller";
import { middleware, UserRole } from "../../middlewares/auth.middleware";

const router: Router = Router();
router.post("/", middleware(UserRole.ADMIN), CategoryController.createCategory);

export const categoryRouter = router;
