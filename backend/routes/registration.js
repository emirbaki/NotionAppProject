import db from '../db/connection.js';
import express from 'express';
import {User} from "../models/userModel.js";

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
    const { username, password } = req.body;
    const user = User.findOne({
        name: username,
        password : password
    })
    if(user){
        res.status(200).send("yeap");
    }else{
        res.status(500).send("You are making something stupid");
    }
});

export default router;
