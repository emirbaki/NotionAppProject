import asyncHandler from "express-async-handler";

import Notification from "../models/notificationModel.js"; // Assuming Notification model is in models/notificationModel.js

// @desc    Get All Notifications for a User
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const { username } = req.params; // Assuming user ID is in the URL params

  const notifications = await Notification.find({ recipient: username });

  res.status(200).json(notifications);
});

// @desc    Create a Notification
// @route   POST /api/notifications
// @access  Private
const createNotification = asyncHandler(async (req, res) => {
  const { user, recipient, type, content } = req.body;

  // Basic validation (can be extended as needed)
  if (!user || !type) {
    throw new Error('Please add required fields (user, type)');
  }

  const newNotification = new Notification({ user, recipient, type, content });

  const savedNotification = await newNotification.save();

  res.status(201).json(savedNotification);
});

// @desc    Update a Notification
// @route   PUT /api/notifications/:id
// @access  Private
const updateNotification = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;
  const updates = req.body;

  const updatedNotification = await Notification.findByIdAndUpdate(
    notificationId,
    updates,
    { new: true } // Return the updated document
  );

  if (!updatedNotification) {
    throw new Error('Notification not found');
  }

  res.status(200).json(updatedNotification);
});

// @desc    Delete a Notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;

  const deletedNotification = await Notification.findByIdAndDelete(notificationId);

  if (!deletedNotification) {
    throw new Error('Notification not found');
  }

  res.status(200).json({ message: 'Notification deleted' });
});

export { getNotifications, createNotification, updateNotification, deleteNotification };
