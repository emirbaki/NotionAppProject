import db from '../db/connection.js';
import express from 'express'; 

const router = express.Router();


router.get('/', async (req, res) => {
    let username = null , password = null;

    const result = db.collection('users').findOne().then(user => {
            //console.log(user.username);
            username = user.username;
            password = user.password;
            res.status(201).send({ username, password });
    });
    

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
