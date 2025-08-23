import Booking from "../models/bookingModel.js";
import Showtime from "../models/showtimeModel.js";
import ShowtimeSeats from "../models/showtimeSeatsModel.js";
import { broadcastMessage } from "../websocket.js";
import shortid from "shortid";
import { sendBookingConfirmationEmail } from "../services/emailService.js";

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
      showtimeId: showtimeId,
    }).populate("seatId");

    if (seatsInDB.length !== showtimeSeatIds.length) {
      return res.status(400).json({ message: "Invalid seat selection" });
    }

    const seatsBooked = seatsInDB.filter((seat) => seat.status === "booked");
    if (seatsBooked.length > 0) {
      return res.status(409).json({
        message: "One or more selected seats are already booked",
        bookedSeats: seatsBooked.map((s) => s.seatNumber),
      });
    }

    const showtime = await Showtime.findById(showtimeId)
      .populate("movieId")
      .populate({
        path: "screenId",
        populate: {
          path: "theatreId",
          model: "Theatre",
        },
      });

    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    // Create booking
    const bookingId = shortid.generate();
    const booking = await Booking.create({
      user: userId,
      showtime: showtimeId,
      showtimeSeatIds,
      totalPrice: showtimeSeatIds.length * showtime.seatPrice,
      bookingStatus: "confirmed",
      bookingId,
    });

    // Update seat status to booked
    await ShowtimeSeats.updateMany(
      { _id: { $in: showtimeSeatIds } },
      { $set: { status: "booked" } }
    );

    // Send booking confirmation email
    try {
      const user = req.user;

      // Create proper datetime by combining date and time
      const showDate = new Date(showtime.start_date);
      const [hours, minutes] = showtime.start_time.split(":");
      showDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const emailData = {
        customerName: `${user.firstName} ${user.lastName}`,
        ticketNo: booking.bookingId,
        movieTitle: showtime.movieId?.title || "Movie",
        theatreLocation: showtime.screenId?.theatreId?.location || "Theatre",
        screenNumber: showtime.screenId?.screenNumber || "N/A",
        seats: seatsInDB.map((s) => s.seatId?.seatNumber || "N/A").join(", "),
        date: showDate.toLocaleDateString(),
        time: showDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        totalAmount: booking.totalPrice,
        seatCount: showtimeSeatIds.length,
      };

      console.log("Email data being sent:", emailData);

      await sendBookingConfirmationEmail(user.email, emailData);
      console.log(
        "Booking confirmation email sent successfully to:",
        user.email
      );
    } catch (emailError) {
      console.error("Failed to send booking confirmation email:", emailError);
      console.error("Email error details:", emailError.stack);
      // Don't fail the booking if email fails
    }

    // Get populated booking data
    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "firstName lastName email")
      .populate({
        path: "showtime",
        populate: {
          path: "movieId",
          select: "title",
        },
      })
      .populate({
        path: "showtimeSeatIds",
        select: "seatNumber row",
      });

    // Broadcast seat updates to all connected clients
    broadcastMessage({
      type: "SEAT_UPDATE",
      showtimeId,
      seatIds: showtimeSeatIds,
      status: "booked",
    });

    // Also broadcast booking count update
    broadcastMessage({ type: "BOOKING_COUNT_UPDATE" });

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: "showtime",
        populate: [
          {
            path: "movieId",
            select: "title moviePoster releaseDate duration rating",
          },
          {
            path: "screenId",
            select: "screenNumber format",
            populate: {
              path: "theatreId",
              select: "name location",
            },
          },
        ],
      })
      .populate({
        path: "showtimeSeatIds",
        select: "seatNumber row",
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "firstName lastName email")
      .populate({
        path: "showtime",
        populate: [
          {
            path: "movieId",
            select: "title moviePoster",
          },
          {
            path: "screenId",
            select: "screenNumber format",
            populate: {
              path: "theatreId",
              select: "name location",
            },
          },
        ],
      })
      .populate({
        path: "showtimeSeatIds",
        select: "seatNumber row",
      });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the user is authorized to view this booking
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this booking" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Cannot find booking" });
    }
    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }
    booking.bookingStatus = "cancelled";
    await booking.save();
    await ShowtimeSeats.updateMany(
      { _id: { $in: booking.showtimeSeatIds } },
      { $set: { status: "available" } }
    );
    // Broadcast seat updates
    broadcastMessage({
      type: "SEAT_UPDATE",
      showtimeId: booking.showtime,
      seatIds: booking.showtimeSeatIds,
      status: "available",
    });
    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get total booking count
export const getTotalBookingCount = async (req, res) => {
  try {
    const count = await Booking.countDocuments();
    res.json({ count });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
