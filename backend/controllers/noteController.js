
import asyncHandler from "express-async-handler";

import { Note } from "../models/noteModel.js";
import { User } from "../models/userModel.js";

// @desc    Get Notes
// @route   GET /api/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user.id });

  res.status(200).send(notes);
});

const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  res.status(200).send(note);
})

// @desc    Create Note
// @route   POST /api/notes
// @access  Private
const createNote = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    res.status(400);
    throw new Error('Please add text fields');
  }

  const { title, content } = req.body;
  const note = await Note.create({
    title,
    content,
    user: req.user.id,
  });

  res.status(201).send(note);
});

// @desc    Update Note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(400);
    throw new Error('Note not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User Not Found');
  }

  // Make sure the logged in user matches notes user
  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User Not Authorized');
  }

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).send(updatedNote);
});

// @desc    Delete Note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  console.log("ne bu " + req.params.id)
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(400);
    throw new Error('Note not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User Not Found');
  }

  // Make sure the logged in user matches notes user
  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User Not Authorized');
  }

  // await note.remove();
  await Note.deleteOne({ _id: req.params.id });
  // res.status(200).send({ id: req.params.id });
  res.status(200).send({ id: req.params.id });
});

export {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};
