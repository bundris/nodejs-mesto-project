import { Router } from 'express';
import {
  getAllUsers, getUserById, updateProfile, updateAvatar, getSignedUser,
} from '../controllers/users';
import { validateUserInfo, validateAvatar, validateId } from '../middlewares/validator';

const router = Router();

router.get('/', getAllUsers);
router.get('/:userId', validateId, getUserById);
router.get('/me', validateId, getSignedUser);

router.patch('/me', validateUserInfo, updateProfile);
router.patch('/me/avatar', validateAvatar, updateAvatar);

export default router;
