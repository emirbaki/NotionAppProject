import db from '../db/connection.js';
import { ObjectId } from 'mongodb';
import express from 'express';
import {User} from "../models/user.js";



const router = express.Router();



router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });
// Create a new note
router.post('/register', async (req, res) => {
    try{
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        const result = await db.collection('users').insertOne(newUser);
        res.status(201).send('User added successfully with id: ${result.insertedId}');
    } catch (err) {
        console.error('Error adding note:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/login', async (req, res) => {
    try {
        // Extract username and password from request body
        const { username, password } = req.body;

        // Validate username and password presence (optional but recommended)
        if (!username || !password) {
            return res.status(400).json({ message: 'Missing username or password' });
        }

        // Find user by username using a secure comparison method
        const user = db.collection('users').findOne({ username : username })
        .then(user => {
            if(user === null){
                return res.status(401).json({ message: 'Invalid username' });
            }else{
                const isPasswordValid = user.password === password;
                console.log(user.password);
                console.log(password);

                if (!isPasswordValid) {
                    return res.status(402).json({ message: 'Invalid username or password' });
                }

                return res.status(200).json({ message: 'All okay' });
            }
        })
        .catch(error => {
            console.error(error); // Handle any errors that occurred during the query
        });

    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;
