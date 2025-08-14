// src/models/bookingModel.js

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  showtimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Showtime",
    required: true,
  },
  showtimeSeatIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Showtime_Seats",
      required: true,
    },
  ],
  booking_date: { type: Date, default: Date.now },
  totalAmount: { type: Number, required: true },
  ticketNo: { type: String },
  seatCount: { type: Number, required: true },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
