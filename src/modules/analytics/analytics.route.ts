import { Router } from "express";
import { AnalyticsController } from "./analytics.controller";
import { middleware, UserRole } from "../../middlewares/auth.middleware";

const router: Router = Router();

// Single endpoint for all admin analytics data
router.get(
  "/admin",
  middleware(UserRole.ADMIN),
  AnalyticsController.getAdminAnalytics,
);

export default router;