import asyncHandler from "express-async-handler";
import { NoteCollection } from "../models/noteCollectionModel.js";
import { User } from "../models/userModel.js";

// @desc    Get Collections
// @route   GET /api/collections
// @access  Private
// await NoteCollection.find({ user: req.user.id });
const getCollections = asyncHandler(async (req, res) => {
  const collections = await NoteCollection.find();

  res.status(200).send(collections);
});

// @desc    Create Collection
// @route   POST /api/collections
// @access  Private
const createCollection = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    res.status(400);
    throw new Error('Please add a title');
  }

  const { title } = req.body;
  const collection = await NoteCollection.create({
    title,
    user: req.user.id,
  });

  res.status(201).send(collection);
});

// @desc    Update Collection
// @route   PUT /api/collections/:id
// @access  Private
const updateCollection = asyncHandler(async (req, res) => {
  const collection = await NoteCollection.findById(req.params.id);

  if (!collection) {
    res.status(404);
    throw new Error('Collection not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches collection's user
  if (collection.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedCollection = await NoteCollection.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).send(updatedCollection);
});

// @desc    Delete Collection
// @route   DELETE /api/collections/:id
// @access  Private
const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await NoteCollection.findById(req.params.id);

  if (!collection) {
    res.status(404);
    throw new Error('Collection not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches collection's user
  if (collection.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await collection.remove();

  res.status(200).send({ id: req.params.id });
});

export {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
};