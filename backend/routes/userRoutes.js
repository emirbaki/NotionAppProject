import express from 'express';

import {registerUser,loginUser,getMe} from '../controllers/userController.js';
import  protect  from '../middlewares/authMiddleware.js';
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/register', registerUser);
router.post('/login', protect,loginUser);

router.get('/me', protect, getMe);

export default router;

