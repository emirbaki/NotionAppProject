import db from '../db/connection.js';
import {ObjectId } from 'mongodb';
import express  from 'express';

const router = express.Router();

// Connection URL

    // Get all notes
router.get('/', async (req, res) => {
    try {
        const notes = await db.collection('notes').find({}).toArray();
        res.json(notes);
    } catch (err) {
        console.error('Error fetching notes:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Get the length of notes
router.get('/length', async (req, res) => {
    try {
        const count = await db.collection('notes').countDocuments();
        res.json(count);
    } catch (err) {
        console.error('Error counting notes:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Get a single note
router.get('/:id', async (req, res) => {
    try {
        const note = await db.collection('notes').findOne({ _id: new ObjectId(req.params.id) });
        if (note) {
            res.json(note);
        } else {
            res.status(404).send('Note not found');
        }
    } catch (err) {
        console.error('Error fetching note:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Create a new note
router.post('/', async (req, res) => {
    try {
        const newNote = req.body;
        const result = await db.collection('notes').insertOne(newNote);
        res.status(201).send(`Note added successfully with id: ${result.insertedId}`);
    } catch (err) {
        console.error('Error adding note:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Update a note
router.put('/:id', async (req, res) => {
    try {
        const noteId = req.params.id;
        const updatedNote = req.body;
        const result = await db.collection('notes').updateOne({ _id: new ObjectId(noteId) }, { $set: updatedNote });
        if (result.modifiedCount > 0) {
            res.send('Note updated successfully');
        } else {
            res.status(404).send('Note not found');
        }
    } catch (err) {
        console.error('Error updating note:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Delete a note
router.delete('/:id', async (req, res) => {
    try {
        const noteId = req.params.id;
        const result = await db.collection('notes').deleteOne({ _id: new ObjectId(noteId) });
        if (result.deletedCount > 0) {
            res.send('Note deleted successfully');
        } else {
            res.status(404).send('Note not found');
        }
    } catch (err) {
        console.error('Error deleting note:', err);
        res.status(500).send('Internal Server Error');
    }
});
export default router;
// module.exports = router;
