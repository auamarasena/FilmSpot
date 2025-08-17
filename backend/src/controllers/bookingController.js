import Booking from "../models/bookingModel.js";
import Showtime from "../models/showtimeModel.js";
import ShowtimeSeats from "../models/showtimeSeatsModel.js";
import { broadcastMessage } from "../websocket.js";
import shortid from "shortid";

export const createBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const { showtimeId, showtimeSeatIds } = req.body;

    if (!showtimeId || !showtimeSeatIds || !showtimeSeatIds.length) {
      return res
        .status(400)
        .json({ message: "Showtime and selected seats are required" });
    }

    // Additional check to prevent double booking
    const seatsInDB = await ShowtimeSeats.find({
      _id: { $in: showtimeSeatIds },
    });
    if (seatsInDB.some((seat) => seat.status === "booked")) {
      return res
        .status(409)
        .json({
          message:
            "Sorry, one or more seats have just been booked by another user. Please select again.",
        });
    }

    const showtime = await Showtime.findById(showtimeId).populate("movieId");
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    const totalAmount = showtime.seatPrice * showtimeSeatIds.length;

    const booking = new Booking({
      userId,
      showtimeId,
      showtimeSeatIds,
      totalAmount,
      seatCount: showtimeSeatIds.length,
      ticketNo: shortid.generate(),
    });
    const newBooking = await booking.save();

    await ShowtimeSeats.updateMany(
      { _id: { $in: showtimeSeatIds } },
      { $set: { status: "booked" } }
    );

    broadcastMessage({ type: "BOOKING_UPDATE", showtimeId: showtimeId });

    res.status(201).json(newBooking);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating booking", error: err.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate(
      "userId",
      "firstName lastName"
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Cannot find booking" });
    }
    if (
      booking.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({ message: "Not authorized to view this booking" });
    }
    res.json(booking);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ booking_date: -1 }) // Sort by newest booking first
      .populate({
        path: "showtimeId",
        select: "start_date start_time", // Select the fields we need from the showtime
        populate: [
          {
            path: "movieId",
            model: "Movie",
            select: "title moviePoster", // Get the movie title and poster
          },
          {
            path: "screenId",
            model: "Screens",
            select: "screenNumber", // Get the screen number
            populate: {
              path: "theatreId",
              model: "Theatre",
              select: "location", // Get the theatre location
            },
          },
        ],
      });

    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
    }

    res.json(bookings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user's bookings", error: err.message });
  }
};

export const deleteBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Cannot find booking" });
    }
    await ShowtimeSeats.updateMany(
      { _id: { $in: booking.showtimeSeatIds } },
      { $set: { status: "available" } }
    );
    await booking.deleteOne();
    res.json({ message: "Booking deleted and seats released" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
