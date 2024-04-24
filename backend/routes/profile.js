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

export default router;
