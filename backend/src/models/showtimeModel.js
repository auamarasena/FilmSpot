import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  screenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Screens",
    required: true,
  },
  start_date: { type: Date, required: true },
  start_time: { type: String, required: true },
  seatPrice: { type: Number, required: true },
  recurrence: {
    type: { type: String, enum: ["none", "daily"], default: "none" },
    endDate: { type: Date },
  },
});

const Showtime = mongoose.model("Showtime", showtimeSchema);

export default Showtime;
