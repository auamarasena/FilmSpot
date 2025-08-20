import express from "express";
import {
  createShowtime,
  getAllShowtimes,
  getAllShowtimesWithAllDetails,
  getShowtimeById,
  getShowtimesByMovie,
  getShowtimeCountFromToday,
  getShowtimeSeatsByShowtimeId,
  getShowtimeSeatsByShowtimeSeatId,
  updateShowtimeById,
  deleteShowtimeById,
} from "../controllers/showtimeController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/movie/:movieId", getShowtimesByMovie);

router.get("/seats/search", getShowtimeSeatsByShowtimeSeatId);

router.get("/:showtimeId/seats", getShowtimeSeatsByShowtimeId);

router.get("/:id", getShowtimeById);

//Protected
router.get("/", protect, admin, getAllShowtimes);

router.get("/all/details", protect, admin, getAllShowtimesWithAllDetails);

router.get("/count/today", protect, admin, getShowtimeCountFromToday);

router.post("/", protect, admin, createShowtime);

router.put("/:id", protect, admin, updateShowtimeById);

router.delete("/:id", protect, admin, deleteShowtimeById);

export default router;
