import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { broadcastMessage } from "../websocket.js";

//Generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

//Register a new user
//POST /api/auth/register
export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, mobile } = req.body;
  
  // Validate required fields
  if (!firstName || !lastName || !email || !password || !mobile) {
    return res.status(400).json({ 
      message: "All fields are required (firstName, lastName, email, password, mobile)" 
    });
  }
  
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with that email already exists" });
    }
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      mobile,
    });
    if (user) {
      broadcastMessage({ type: "USER_COUNT_UPDATE" });
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        token: generateToken(user._id),
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//Authenticate user & get token
//POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        token: generateToken(user._id),
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/*--- Private---*/

//Get user profile
//GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

//Update user profile
//PUT /api/auth/profile
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.mobile = req.body.mobile || user.mobile;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

//Get total user count for admin dashboard
//GET /api/auth/count
export const getTotalUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
