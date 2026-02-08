import { Router } from "express";
import { bookingController } from "./booking.controller";

const router: Router = Router();

router.get("/", bookingController.bookings);
router.post("/", bookingController.createBooking);

export const BookingRoutes = router;
