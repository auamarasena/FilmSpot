import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  deleteBookingById,
  getMyBookings,
} from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/mybookings").get(protect, getMyBookings);
router.route("/").get(protect, admin, getAllBookings);
router.route("/").post(protect, createBooking);
router
  .route("/:id")
  .get(protect, getBookingById)
  .delete(protect, admin, deleteBookingById);

export default router;
