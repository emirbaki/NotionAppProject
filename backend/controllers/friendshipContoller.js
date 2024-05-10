import asyncHandler from "express-async-handler";
import { Friendship } from "../models/friendshipModel.js";

const getFriendsByUserName = asyncHandler(async (req,res) => {
    try {
        const { username } = req.params;

        // Input validation (optional but recommended)
        if (!username) {
            return res.status(400).send('User Blank');
        }

        const friendship = await Friendship.find({
            $or: [
                { username_1: username },
                { username_2: username }
            ]
        });

        if (friendship) {
            res.status(200).json({ friends: friendship });
            
        } else {
            res.status(404);
        }
    } catch (err) {
        console.error('Error checking friendship:', err);
        res.status(500).send('Internal Server Error');
    }
});

const checkIfFriendshipExist = asyncHandler(async (req,res) => {
    try {
        const { username_1, username_2 } = req.params;

        // Input validation (optional but recommended)
        if (!username_1 || !username_2) {
            return res.status(400).send('User Blank');
        }

        if (username_1 === username_2) {
            return res.status(400).send('Same user');
        }

        // Efficient alphabetical order determination
        const usernames = [username_1, username_2].sort();
        const username_first_in_alphabetical_order = usernames[0];
        const username_second_in_alphabetical_order = usernames[1];

        // Check if friendship exists
        const friendship = await Friendship.findOne({
            username_1: username_first_in_alphabetical_order,
            username_2: username_second_in_alphabetical_order,
        });

        if (friendship) {
            res.status(200).json({ exists: true });
        } else {
            res.status(200).json({ exists: false });
        }
    } catch (err) {
        console.error('Error checking friendship:', err);
        res.status(500).send('Internal Server Error');
    }
});
const deleteFriendship = asyncHandler(async (req, res) => {
    try {
        const { username_1, username_2 } = req.body;
    
        // Input validation (optional but recommended)
    
        if (!username_1 || !username_2) {
            return res.status(401).send('User Blank');
        }
    
        if (username_1 === username_2) {
            return res.status(401).send('Same user');
        }
    
        // Efficient alphabetical order determination
        const usernames = [username_1, username_2].sort();
    
    
        const username_first_in_alphabetical_order = usernames[0];
        const username_second_in_alphabetical_order = usernames[1];
    
    
        const friendship = await Friendship.findOneAndDelete({
            username_1: username_first_in_alphabetical_order,
            username_2: username_second_in_alphabetical_order,
        });
    
        if (friendship) {
            res.status(201).send('All okay');;
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (err) {
        console.error('Error deleting friendship:', err);
        res.status(500).send('Internal Server Error');
    }
});

const createNewFriendship = asyncHandler(async (req ,res) => {
    try {
        const { username_1, username_2 } = req.body;

        // Input validation (optional but recommended)
        
        if (!username_1 || !username_2) {
            return res.status(401).send('User Blank');
        }

        if (username_1 === username_2) {
            return res.status(401).send('Same user');
        }

        // Efficient alphabetical order determination
        const usernames = [username_1, username_2].sort(); 

        
        const  username_first_in_alphabetical_order= usernames[0];
        const  username_second_in_alphabetical_order=usernames[1];
        

        const friendship = await Friendship.create({
            username_1: username_first_in_alphabetical_order,
            username_2: username_second_in_alphabetical_order,
        });

        if (friendship) {
            res.status(201).send('All okay');;
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (err) { 
        console.error('Error adding friendship:', err);
        res.status(500).send('Internal Server Error');
    }
});

export{
    createNewFriendship,
    deleteFriendship,
    checkIfFriendshipExist,
    getFriendsByUserName
};