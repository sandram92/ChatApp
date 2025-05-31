const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

// Testing12345&&


const generateToken = (_id) => {
  const jwtKey = process.env.JWT_SECRET_KEY;
  if (!jwtKey) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json( "All fields are required"  );
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json( "Invalid email" );
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json( "Password is weak");
    }

    let user = await userModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json( "User already exists");
    }

    user = new userModel({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = generateToken(user._id);
    res.status(200).json({ _id: user._id, name, token, email });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });
    if (!user)
      return res.status(400).json( "Invalid email or password");
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(400).json("Invalid email or password");
    const token = generateToken(user._id);
    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (error) {
    console.error("Error login user:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
module.exports = { registerUser, loginUser, getUser, getUsers };
