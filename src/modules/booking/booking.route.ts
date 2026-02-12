import { Router } from "express";
import { bookingController } from "./booking.controller";
import { middleware, UserRole } from "../../middlewares/auth.middleware";

const router: Router = Router();

router.get("/", middleware(UserRole.STUDENT), bookingController.bookings);
router.post("/", middleware(UserRole.STUDENT), bookingController.createBooking);
router.get("/:id", bookingController.bookingDetails);

router.put(
  "/:id",
  middleware(UserRole.STUDENT, UserRole.TUTOR),
  bookingController.updateBookingStatus,
);

export const BookingRoutes = router;
