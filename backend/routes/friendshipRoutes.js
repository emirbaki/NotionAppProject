import { Friendship } from "../models/friendshipModel.js";

import express from 'express';
import { checkIfFriendshipExist, createNewFriendship, deleteFriendship, getFriendsByUserName } from "../controllers/friendshipContoller.js";

const router = express.Router();

router.route('/').post(createNewFriendship)
router.route('/delete').delete(deleteFriendship);
router.route('/:username_1/:username_2').get(checkIfFriendshipExist);
router.route('/:username').get(getFriendsByUserName)



export default router;
