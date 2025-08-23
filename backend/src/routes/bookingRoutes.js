import express from "express";
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getTotalBookingCount,
} from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/mybookings").get(protect, getUserBookings);
router.route("/count").get(protect, admin, getTotalBookingCount);
router.route("/").post(protect, createBooking);
router
  .route("/:id")
  .get(protect, getBookingById)
  .delete(protect, admin, cancelBooking);

export default router;
