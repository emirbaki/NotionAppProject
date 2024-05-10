import asyncHandler from "express-async-handler";
import { NoteCollection } from "../models/noteCollectionModel.js";
import { User } from "../models/userModel.js";
import { Types } from "mongoose";

// @desc    Get Collections
// @route   GET /api/collections
// @access  Private
// await NoteCollection.find({ user: req.user.id });
const getCollections = asyncHandler(async (req, res) => {
  const collections = await NoteCollection.find();

  res.status(200).send(collections);
});
const getCollectionsByUser = asyncHandler(async(req, res) => {
  const userObjectId = new Types.ObjectId(req.user.id);
  const collections = await NoteCollection.find({user: userObjectId});

  res.status(200).send(collections);
}) 
const getCollection = asyncHandler(async (req, res) => {
  try {
    const collection = await NoteCollection.findById(req.params.id);
    await collection.populate('noteCollection');
    if (collection) {
      // console.log('Fetched collection:', collection);
      res.status(200).send(collection);
    } else {
      console.log('Collection not found!');
      res.status(404).send({ message: 'Collection not found' });
    }
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

const InsertNoteIntoCollection = asyncHandler(async (req, res)=> {
  try {
    const collectionId = req.params.id;
    const noteId = req.body.noteId;

    const collection = await NoteCollection.findById(collectionId);

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
    // Update the noteCollection array in the NoteCollection model
    // Update the noteCollection array in the collection document
    collection.noteCollection.push(noteId);
    await collection.save();

    res.status(200).send(collection)
} catch (error) {
    console.error('Error adding note to collection:', error);
    res.status(500).json({ message: 'Server Error' });
}
} );


const DeleteNoteFromCollection = asyncHandler(async (req, res)=> {
  try {
    const collectionId = req.params.id;
    const noteId = req.params.noteid;
     

    const collection = await NoteCollection.findById(collectionId);

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
    // Update the noteCollection array in the NoteCollection model
    // Update the noteCollection array in the collection document
    collection.noteCollection.pull(noteId);
    await collection.save();

    res.status(200).send(collection)
} catch (error) {
    console.error('Error deleting note from collection:', error);
    res.status(500).json({ message: 'Server Error' });
}
} );

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
  const collectionId = req.params.id;
  const collection = await NoteCollection.findById(collectionId);

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

  // await collection.remove();
  await NoteCollection.deleteOne({ _id: collectionId });
  res.status(200).send({ id: req.params.id });
});

export {
  getCollections,
  InsertNoteIntoCollection,
  DeleteNoteFromCollection,
  getCollectionsByUser,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
};