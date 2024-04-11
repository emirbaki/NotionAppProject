import db from '../db/connection.js';
import { ObjectId } from 'mongodb';
import express from 'express';
import mongoose from "mongoose";



const router = express.Router();

// Connect to MongoD

// Define a schema for the user data
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });
// Create a new note
router.post('/register', async (req, res) => {
    try{
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        const newNote = req.body;
        const result = await db.collection('users').insertOne(newNote);
        res.status(201).send('User added successfully with id: ${result.insertedId}');
    } catch (err) {
        console.error('Error adding note:', err);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
