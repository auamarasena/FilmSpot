import Theatre from "../models/theatreModel.js";
import Screen from "../models/screenModel.js";

// Get all theatres with screen info
export const getAllTheatresWithScreens = async (req, res) => {
  try {
    const theatres = await Theatre.find()
      .populate({
        path: "screens",
        select: "screenNumber format rowCount seatPerRow",
      })
      .lean();
    res.json(theatres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all theatres
export const getAllTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find();
    res.json(theatres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new theatre
export const createTheatre = async (req, res) => {
  const theatre = new Theatre(req.body);
  try {
    const newTheatre = await theatre.save();
    res.status(201).json(newTheatre);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a theatre by id
export const getTheatreById = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ message: "Cannot find theatre" });
    }
    res.json(theatre);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Delete a theatre with screens
export const deleteTheatreById = async (req, res) => {
  try {
    const theatreId = req.params.id;
    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(404).json({ message: "Cannot find theatre" });
    }
    await Screen.deleteMany({ theatreId: theatreId });
    await Theatre.findByIdAndDelete(theatreId);
    res.json({
      message: "Theatre and associated screens deleted successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error deleting theatre", error: err.message });
  }
};

// Update a theatre
export const updateTheatreById = async (req, res) => {
  try {
    const updatedTheatre = await Theatre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTheatre) {
      return res.status(404).json({ message: "Cannot find theatre" });
    }
    res.json(updatedTheatre);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
