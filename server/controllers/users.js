import User from "../models/User.js";
import mongoose from "mongoose";

//GET PROFILE
export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    res
      .status(404)
      .send({ success: false, message: `No user found with id: ${id}` });

  const user = await User.findById(id);

  res.status(200).json({ success: true, data: user });
};

//REGISTER
export const registerUser = async (req, res) => {
  const newUser = new User(req.body);

  const user = await User.findOne({ email: newUser.email });

  if (user)
    res.status(400).json({ success: false, message: "User already exists!" });

  try {
    await newUser.save();
    sendToken(newUser, 201, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    res
      .status(422)
      .json({ success: false, message: "Please provide Email & Password!" });

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user)
      res.status(404).json({ success: false, message: "User Not Registered!" });

    //check password matches using method
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(404).json({ success: false, message: "Invalid Credentials!" });
    } else {
      sendToken(user, 200, res);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//JWT TOKEN
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  const userWithoutPassword = {
    city: user.city,
    email: user.email,
    firstName: user.firstName,
    gender: user.gender,
    lastName: user.lastName,
    number: user.number,
    username: user.username,
    _id: user._id,
  };
  res
    .status(statusCode)
    .json({ success: true, token, user: userWithoutPassword });
};
