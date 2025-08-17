import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  screenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Screens",
    required: true,
  },
  seatNumber: {
    type: String, 
    required: true,
  },
});

const Seat = mongoose.model("Seats", seatSchema);


export default Seat;
