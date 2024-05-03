import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";


// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  //   check if user exists
  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  //   Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //   create user
  const user = await User.create({
    name: username,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  //  Check for user email
  const user = await User.findOne({ name: username });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Public
const getMe = asyncHandler(async (req, res) => {
  const { _id, name } = await User.findById(req.user.id);

  res.status(200).json(req.user);
});

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, "${process.env.JWT_SECRET}", {
    expiresIn: '30d',
  });
};

export {
  registerUser,
  loginUser,
  getMe,
};