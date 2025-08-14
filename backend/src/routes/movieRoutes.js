import express from "express";
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieCount, 
} from "../controllers/movieController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/stats/count", protect, admin, getMovieCount);

//Public and Admin Routes
router.route("/").get(getMovies).post(protect, admin, createMovie);
router
  .route("/:id")
  .get(getMovieById)
  .put(protect, admin, updateMovie)
  .delete(protect, admin, deleteMovie);

export default router;
