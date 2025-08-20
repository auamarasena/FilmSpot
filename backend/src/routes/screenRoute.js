import express from "express";
import {
  createScreen,
  getScreens,
  getScreenById,
} from "../controllers/screenController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

//Public Routes
router.get("/", getScreens);
router.get("/:id", getScreenById);

//Protected
router.post("/", protect, admin, createScreen);

export default router;
