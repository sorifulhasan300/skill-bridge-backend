import { Router } from "express";
import { AdminController } from "./admin.controller";
import { middleware, UserRole } from "../../middlewares/auth.middleware";

const router: Router = Router();

router.get("/users", middleware(UserRole.ADMIN), AdminController.allUsers);
router.get(
  "/statistics",
  middleware(UserRole.ADMIN),
  AdminController.statistics,
);

router.patch(
  "/:id",
  middleware(UserRole.ADMIN),
  AdminController.updateUserStatus,
);

export const AdminRoutes = router;
