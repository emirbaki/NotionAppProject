// import db from '../db/connection.js';
// import express from 'express'; 
// import { ObjectId } from 'mongodb';

// const router = express.Router();


// router.get('/:username', async (req, res) => {
    
//     let username = null , password = null, email = null, name = null, surname = null;
//     console.log(req.params.username);
//     if (!(req.params.username == null)){
//         console.log(req.params.username);
//         const result = db.collection('users').findOne({ "username": req.params.username }).then(user => {
//             //console.log(user.username);
//             username = user.username;
//             password = user.password;
//             email = user.email;
//             name = user.name;
//             surname = user.surname;
//             res.status(201).send({ username, password, email, name, surname });
//         });
//     }
    

// });

// router.post('/update', async (req, res) => {

//     try {
//         const { username, password } = req.body;
//         if (!(username == '' || password == '')) {
//             const result = db.collection('users').updateOne(
//                 { "username": username },
//                 { $set: { "password": password} }
//             );

//             res.status(201).send('User updated successfully');
//         }
//     } catch (err) {
//         console.error('Error updating user', err);
//         res.status(500).send('Internal Server Error');
//     }


// });

// router.post('/delete', async (req, res) => {

//     try {
//         const { username } = req.body;
    
//         const result = db.collection('users').deleteOne(
//             { "username": username }
//         );

//         res.status(201).send('User deleted successfully');
        
//     } catch (err) {
//         console.error('Error deleting user', err);
//         res.status(500).send('Internal Server Error');
//     }


// });

// export default router;
import express from 'express';
import asyncHandler from 'express-async-handler';

import {User} from '../models/userModel.js'; // Assuming User model is in models/userModel.js
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

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

  res.status(200).json({ username: user.username, email: user.email, name: user.name, surname: user.surname, _id: req.user._id}); // Don't send password
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

router.get('/:username', protect, getUserByUsername);
router.post('/update', updateUserPassword);
router.post('/delete', deleteUser);

export default router;
