import { Router } from "express";
import { bookingController } from "./booking.controller";
import { middleware, UserRole } from "../../middlewares/auth.middleware";

const router: Router = Router();

router.get(
  "/student",
  middleware(UserRole.STUDENT),
  bookingController.bookings,
);
router.get(
  "/tutor",
  middleware(UserRole.TUTOR),
  bookingController.tutorBooking,
);
router.get(
  "/admin",
  middleware(UserRole.ADMIN),
  bookingController.adminBooking,
);
router.post("/", middleware(UserRole.STUDENT), bookingController.createBooking);
router.get("/:id", bookingController.bookingDetails);

router.put(
  "/:id",
  middleware(UserRole.STUDENT, UserRole.TUTOR),
  bookingController.updateBookingStatus,
);

export const BookingRoutes = router;
