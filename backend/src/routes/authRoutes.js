import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getTotalUserCount,
  updateUserProfile,
} from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get("/count", protect, admin, getTotalUserCount);

export default router;
