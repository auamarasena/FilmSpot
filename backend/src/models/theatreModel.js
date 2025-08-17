import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema({
  location: { type: String, required: true },
});

theatreSchema.virtual("screens", {
  ref: "Screens",
  localField: "_id",
  foreignField: "theatreId",
});

theatreSchema.set("toObject", { virtuals: true });
theatreSchema.set("toJSON", { virtuals: true });

const Theatre = mongoose.model("Theatre", theatreSchema);

export default Theatre;
