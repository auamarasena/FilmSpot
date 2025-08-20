import express from "express";
import {
  getAllTheatres,
  createTheatre,
  getTheatreById,
  deleteTheatreById,
  updateTheatreById,
  getAllTheatresWithScreens,
} from "../controllers/theatreController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

//Public routes
router.get("/", getAllTheatres);
router.get("/with-screens", getAllTheatresWithScreens);
router.get("/:id", getTheatreById);

//Admin routes
router.post("/", protect, admin, createTheatre);
router.delete("/:id", protect, admin, deleteTheatreById);
router.put("/:id", protect, admin, updateTheatreById);

export default router;
