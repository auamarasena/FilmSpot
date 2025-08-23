import Showtime from "../models/showtimeModel.js";
import Screen from "../models/screenModel.js";
import Seat from "../models/seatModel.js";
import ShowtimeSeats from "../models/showtimeSeatsModel.js";
import { startOfDay } from "date-fns";

export const getAllShowtimesWithAllDetails = async (req, res) => {
  try {
    const showtimes = await Showtime.find({})
      .populate({ path: "movieId", select: "title" })
      .populate({
        path: "screenId",
        populate: { path: "theatreId", select: "location" },
        select: "screenNumber format",
      })
      .sort({ start_date: 1, start_time: 1 })
      .lean();
    const formattedShowtimes = showtimes.map((st) => ({
      _id: st._id,
      movieTitle: st.movieId?.title || "Deleted Movie",
      theatreLocation: st.screenId?.theatreId?.location || "Deleted Theatre",
      screenNumber: st.screenId?.screenNumber || "N/A",
      startDate: st.start_date,
      startTime: st.start_time,
      seatPrice: st.seatPrice,
    }));
    res.json(formattedShowtimes);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching detailed showtimes",
      error: err.message,
    });
  }
};

export const getShowtimesByMovie = async (req, res) => {
  try {
    const showtimes = await Showtime.find({ movieId: req.params.movieId })
      .populate({
        path: "screenId",
        select: "screenNumber format",
        populate: { path: "theatreId", select: "location" },
      })
      .lean();
    const formattedShowtimes = showtimes.map((st) => ({
      _id: st._id,
      startTime: st.start_time,
      startDate: st.start_date,
      theatreLocation: st.screenId?.theatreId?.location || "Unknown Theatre",
      screenFormat: st.screenId?.format || "Standard",
    }));
    res.json(formattedShowtimes);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching showtimes for movie",
      error: error.message,
    });
  }
};

export const getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate("movieId")
      .populate({ path: "screenId", populate: { path: "theatreId" } });
    if (!showtime)
      return res.status(404).json({ message: "Showtime not found" });
    res.json(showtime);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching showtime", error: err.message });
  }
};

export const getShowtimeSeatsByShowtimeId = async (req, res) => {
  try {
    const showtimeSeats = await ShowtimeSeats.find({
      showtimeId: req.params.showtimeId,
    })
      .populate({ path: "seatId", select: "seatNumber" })
      .lean();
    if (!showtimeSeats || showtimeSeats.length === 0)
      return res
        .status(404)
        .json({ message: "No seats found for this showtime" });
    const formattedSeats = showtimeSeats.map((sts) => ({
      _id: sts._id,
      seatNumber: sts.seatId.seatNumber,
      status: sts.status,
    }));
    res.json(formattedSeats);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching showtime seats", error: err.message });
  }
};

export const createShowtime = async (req, res) => {
  try {
    const { movieId, screenId, start_date, start_time, seatPrice, recurrence } =
      req.body;
    const screen = await Screen.findById(screenId);
    if (!screen) return res.status(404).json({ message: "Screen not found" });
    const seats = await Seat.find({ screenId: screen._id });
    if (seats.length === 0)
      return res
        .status(400)
        .json({ message: "No seats are configured for this screen." });
    const newShowtime = new Showtime({
      movieId,
      screenId,
      start_date,
      start_time,
      seatPrice,
      recurrence,
    });
    const savedShowtime = await newShowtime.save();
    const showtimeSeats = seats.map((seat) => ({
      showtimeId: savedShowtime._id,
      seatId: seat._id,
      status: "available",
    }));
    await ShowtimeSeats.insertMany(showtimeSeats);
    res.status(201).json(savedShowtime);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating showtime", error: err.message });
  }
};

export const deleteShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);
    if (!showtime)
      return res.status(404).json({ message: "Showtime not found" });
    await ShowtimeSeats.deleteMany({ showtimeId: showtime._id });
    await showtime.deleteOne();
    res.json({ message: "Showtime and associated seats deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting showtime", error: err.message });
  }
};

export const getShowtimeCountFromToday = async (req, res) => {
  try {
    const today = startOfDay(new Date());
    const count = await Showtime.countDocuments({
      start_date: { $gte: today },
    });
    res.json({ count });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching showtime count", error: err.message });
  }
};

export const getAllShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.find({}).populate("movieId", "title");
    res.json(showtimes);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching showtimes", error: err.message });
  }
};

export const getShowtimeSeatsByShowtimeSeatId = async (req, res) => {
  try {
    const { showtimeSeatIds } = req.query;
    if (!showtimeSeatIds)
      return res
        .status(400)
        .json({ message: "showtimeSeatIds parameter is required" });
    const idsArray = showtimeSeatIds.split(",");
    const showtimeSeats = await ShowtimeSeats.find({ _id: { $in: idsArray } })
      .populate({ path: "seatId", select: "seatNumber" })
      .lean();
    if (!showtimeSeats || showtimeSeats.length === 0)
      return res.status(404).json({ message: "No showtime seats found" });
    const formattedSeats = showtimeSeats.map((sts) => ({
      _id: sts._id,
      seatNumber: sts.seatId.seatNumber,
      status: sts.status,
    }));
    res.json(formattedSeats);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching showtime seats", error: err.message });
  }
};

export const updateShowtimeById = async (req, res) => {
  try {
    const updatedShowtime = await Showtime.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedShowtime)
      return res.status(404).json({ message: "Cannot find showtime" });
    res.json(updatedShowtime);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating showtime", error: err.message });
  }
};
