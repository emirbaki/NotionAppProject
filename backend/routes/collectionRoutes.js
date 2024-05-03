import express from 'express';
import protect  from '../middlewares/authMiddleware.js'; // Assuming you have authentication middleware
import {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from '../controllers/collectionController.js';

const router = express.Router();

// Middleware to protect routes, assuming you have authentication middleware
// router.use(protect);

router.route('/').get(getCollections).post(createCollection);
router.route('/:id').put(updateCollection).delete(deleteCollection);

export default router;
