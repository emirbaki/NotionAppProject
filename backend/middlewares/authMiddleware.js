import jwt from 'jsonwebtoken';
import asyncHandler from'express-async-handler';
import {User} from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;
  console.log(req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, "${process.env.JWT_SECRET}");

      // Get th user from the token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (err) {
      console.log(err);
      res.status(401);
      throw new Error('Not Authorized');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not Authorized, No token');
  }
});

export default protect;