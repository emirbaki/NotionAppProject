import express from 'express';
import protect from '../middlewares/authMiddleware.js';


import { getNotes,createNote, updateNote,deleteNote, getNote,} from '../controllers/noteController.js';
const router = express.Router();


// router.route('/').get(protect, getNotes).post(protect, createNote);
// router.route('/:id').put(protect, updateNote).delete(protect, deleteNote);

router.route('/').get(protect,getNotes).post(protect,createNote);
router.route('/:id').put(protect,updateNote).delete(protect,deleteNote).get(protect,getNote);

export default router;
