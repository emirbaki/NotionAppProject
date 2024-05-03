import db from '../db/connection.js';
import express from 'express'; 
import { ObjectId } from 'mongodb';

const router = express.Router();


router.get('/:username', async (req, res) => {
    
    let username = null , password = null, email = null, name = null, surname = null;
    console.log(req.params.username);
    if (!(req.params.username == null)){
        console.log(req.params.username);
        const result = db.collection('users').findOne({ "username": req.params.username }).then(user => {
            //console.log(user.username);
            username = user.username;
            password = user.password;
            email = user.email;
            name = user.name;
            surname = user.surname;
            res.status(201).send({ username, password, email, name, surname });
        });
    }
    

});

router.post('/update', async (req, res) => {

    try {
        const { username, password } = req.body;
        if (!(username == '' || password == '')) {
            const result = db.collection('users').updateOne(
                { "username": username },
                { $set: { "password": password} }
            );

            res.status(201).send('User updated successfully');
        }
    } catch (err) {
        console.error('Error updating user', err);
        res.status(500).send('Internal Server Error');
    }


});

router.post('/delete', async (req, res) => {

    try {
        const { username } = req.body;
    
        const result = db.collection('users').deleteOne(
            { "username": username }
        );

        res.status(201).send('User deleted successfully');
        
    } catch (err) {
        console.error('Error deleting user', err);
        res.status(500).send('Internal Server Error');
    }


});

export default router;
