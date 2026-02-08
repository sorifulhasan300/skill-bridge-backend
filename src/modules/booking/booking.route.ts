import { Router } from "express";
import { bookingController } from "./booking.controller";
import { middleware, UserRole } from "../../middlewares/auth.middleware";

const router: Router = Router();

router.get("/", middleware(UserRole.USER), bookingController.bookings);
router.post("/", middleware(UserRole.USER), bookingController.createBooking);
router.get("/:id", bookingController.bookingDetails);

export const BookingRoutes = router;
