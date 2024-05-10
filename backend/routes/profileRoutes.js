import express from 'express';
import {getUserByUsername,
  updateUserPassword,
  deleteUser
} from '../controllers/profileController.js'
import protect from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/:username', protect, getUserByUsername);
router.post('/update', updateUserPassword);
router.post('/delete', deleteUser);

export default router;
