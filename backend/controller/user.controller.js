const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { generateToken } = require("../utils/generateToken.utils.js");

const userSignUp = async (req, res) => {
  const registerSchema = Joi.object({
    fullname: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { email, password, fullname } = req.body;

  const { error } = registerSchema.validate({ email, password, fullname });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      email,
      password: hash,
      fullname,
    });

    const token = generateToken(user);
    res.cookie("token", token);
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { fullname, email },
    });
  } catch (err) {
    res.status(500).json({ error: "Name already registered" });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = generateToken(user);
      res.cookie("token", token);
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          email: user.email,
          fullname: user.fullname,
        },
      });
    } else {
      return res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Error logging in:", err.message);
    res.status(500).json({ error: "Something went wrong. Try again!" });
  }
};

const getUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await userModel.findById(userId).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      user: {
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ error: "Something went wrong. Try again!" });
  }
};

module.exports = {
  getUser,
  userLogin,
  userSignUp,
};
