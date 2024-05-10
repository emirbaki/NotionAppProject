
import asyncHandler from 'express-async-handler';

import {User} from '../models/userModel.js'; // Assuming User model is in models/userModel.js




// @desc    Get User by Username
// @route   GET /api/users/:username
// @access  Public (can be made private later)
const getUserByUsername = asyncHandler(async (req, res) => {
  const username = req.params.username;

  const user = await User.findOne({ username: username });

  if (!user) {
    res.status(404).send('User not found');
    return; // Exit the function early to prevent sending unnecessary data
  }

  res.status(200).json({ username: user.username, email: user.email, name: user.name, surname: user.surname, _id: req.user._id, admin: user.admin}); // Don't send password
});

// @desc    Update User Password
// @route   POST /api/users/update
// @access  Private (implement authentication later)
const updateUserPassword = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new Error('Please provide username and password');
  }

  const updatedUser = await User.findOneAndUpdate(
    { username },
    { password }, // Update only the password field
    { new: true } // Return the updated document
  );

  if (!updatedUser) {
    throw new Error('User not found');
  }

  res.status(200).json({ message: 'User password updated successfully' }); // Don't send sensitive data like password
});

// @desc    Delete User
// @route   POST /api/users/delete
// @access  Private (implement authentication later)
const deleteUser = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const deletedUser = await User.findOneAndDelete({ username });

  if (!deletedUser) {
    throw new Error('User not found');
  }

  res.status(200).json({ message: 'User deleted successfully' });
});

export {
    deleteUser,
    updateUserPassword,
    getUserByUsername
}