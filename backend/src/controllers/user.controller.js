const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { generateToken } = require('../middlewares/auth.middleware') 

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "User Email Already Exists" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User Registered Successfully" });
  } catch (e) {
    res.status(500).json({ message: "Error in registering user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user._id)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,  
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login successful",
    });
  } catch (e) {
    res.status(500).json({ message: "Error in logging in user" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });
  res.status(200).json({ message: "Logout successful" });
};

const checkUser = (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }
  return res.status(200).json({ authenticated: true });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    checkUser
}