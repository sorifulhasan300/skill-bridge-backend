import { Router, Express } from "express";
import { TutorRoute } from "./modules/tutor/tutor.route";
import { categoryRouter } from "./modules/category/category.route";
import { AdminRoutes } from "./modules/admin/admin.route";
import { BookingRoutes } from "./modules/booking/booking.route";
import { ReviewRouter } from "./modules/reviews/review.route";
import analyticsRouter from "./modules/analytics/analytics.route";

const router: Router = Router();

router.use("/api/tutors", TutorRoute);
router.use("/api/student", TutorRoute);
router.use("/api/category", categoryRouter);
router.use("/api/admin", AdminRoutes);
router.use("/api/bookings", BookingRoutes);
router.use("/api/review", ReviewRouter);
router.use("/api/analytics", analyticsRouter);

export default router;
