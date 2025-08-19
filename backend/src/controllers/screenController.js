import Screen from "../models/screenModel.js";
import Seat from "../models/seatModel.js"; 

// Helper function to generate seats
function generateSeats(screenId, rowCount, seatPerRow) {
  const seats = [];
  for (let row_num = 0; row_num < rowCount; row_num++) {
    const row_char = String.fromCharCode(65 + row_num); 
    for (let seat_num = 1; seat_num <= seatPerRow; seat_num++) {
      const seatNumber = `${row_char}${seat_num}`;
      seats.push({
        screenId: screenId,
        seatNumber: seatNumber,
      });
    }
  }
  return seats;
}

// Create a new screen
export const createScreen = async (req, res) => {
  try {
    const { theatreId, screenNumber, format, rowCount, seatPerRow } = req.body;
    const screen = new Screen({
      theatreId,
      screenNumber,
      format,
      rowCount,
      seatPerRow,
    });
    const newScreen = await screen.save();

    // Generate seats for the new screen
    if (rowCount > 0 && seatPerRow > 0) {
      const seats = generateSeats(newScreen._id, rowCount, seatPerRow);
      await Seat.insertMany(seats);
    }

    res.status(201).json(newScreen);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all screens
export const getScreens = async (req, res) => {
  try {
    const screens = await Screen.find().populate("theatreId", "location");
    res.status(200).json(screens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a screen by ID
export const getScreenById = async (req, res) => {
  try {
    const screen = await Screen.findById(req.params.id);
    if (!screen) {
      return res.status(404).json({ message: "Cannot find screen" });
    }
    res.json(screen);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
