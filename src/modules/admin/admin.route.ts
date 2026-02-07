import { Router } from "express";
import { AdminController } from "./admin.controller";
import { middleware, UserRole } from "../../middlewares/auth.middleware";

const router: Router = Router();

router.get("/", middleware(UserRole.ADMIN), AdminController.allUsers);

export const adminRoutes = router;
