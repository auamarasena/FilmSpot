import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({
  theatreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theatre",
    required: true,
  },
  screenNumber: { type: String, required: true },
  format: { type: String },
  rowCount: { type: Number },
  seatPerRow: { type: Number },
});

const Screen = mongoose.model("Screens", screenSchema);

export default Screen;
