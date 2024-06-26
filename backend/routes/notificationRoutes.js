import express from 'express';
import protect  from '../middlewares/authMiddleware.js'; // Assuming you have authentication middleware
import {
  getNotifications, createNotification, updateNotification, deleteNotification,
} from '../controllers/notificationController.js';

const router = express.Router();

// Middleware to protect routes, assuming you have authentication middleware
// router.use(protect);

router.route('/').get(getNotifications).post(createNotification);
router.route('/:id').put(updateNotification).delete(deleteNotification);

export default router;
