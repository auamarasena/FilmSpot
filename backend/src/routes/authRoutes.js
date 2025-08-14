import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getTotalUserCount,
} from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

//GET /api/auth/count
router.get("/count", protect, admin, getTotalUserCount);

export default router;
