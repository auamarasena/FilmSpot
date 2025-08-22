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
    });
    if (seatsInDB.some((seat) => seat.status === "booked")) {
      return res
        .status(409)
        .json({
          message:
            "Sorry, one or more seats have just been booked by another user. Please select again.",
        });
    }

    const showtime = await Showtime.findById(showtimeId)
      .populate("movieId")
      .populate({
        path: "screenId",
        populate: {
          path: "theatreId",
          model: "Theatre"
        }
      });
      
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

    // Get seat details for email
    const seatDetails = await ShowtimeSeats.find({
      _id: { $in: showtimeSeatIds }
    }).populate('seatId');

    const seatNumbers = seatDetails.map(ss => ss.seatId.seatNumber).join(', ');

    // Get user details
    const user = req.user;

    // Prepare email details
    const bookingDetails = {
      customerName: `${user.firstName} ${user.lastName}`,
      ticketNo: newBooking.ticketNo,
      movieTitle: showtime.movieId.title,
      theatreLocation: showtime.screenId.theatreId.location,
      screenNumber: showtime.screenId.screenNumber,
      seats: seatNumbers,
      date: new Date(showtime.start_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: showtime.start_time,
      totalAmount: totalAmount,
      seatCount: showtimeSeatIds.length
    };

    // Send email asynchronously (don't wait for it)
    sendBookingConfirmationEmail(user.email, bookingDetails)
      .then(result => {
        if (result.success) {
          console.log('Booking confirmation email sent successfully');
        } else {
          console.error('Failed to send booking confirmation email:', result.error);
        }
      })
      .catch(err => {
        console.error('Error sending booking email:', err);
      });

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
