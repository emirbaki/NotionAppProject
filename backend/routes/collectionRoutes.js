import express from 'express';
import protect  from '../middlewares/authMiddleware.js'; // Assuming you have authentication middleware
import {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  getCollectionsByUser,
  InsertNoteIntoCollection,
  DeleteNoteFromCollection,
  createBySharingCollection,
} from '../controllers/collectionController.js';

const router = express.Router();

// Middleware to protect routes, assuming you have authentication middleware
router.use(protect);

router.route('/getByUser').get(getCollectionsByUser);
router.route('/createBySharing').post(createBySharingCollection);
router.route('/').get(getCollections).post(createCollection);
router.route('/:id').delete(deleteCollection).get(getCollection).put(updateCollection);
router.route('/:id/note').put(InsertNoteIntoCollection);
router.route('/:id/note/:noteId').delete(DeleteNoteFromCollection);
// router.route('?userId')

export default router;
