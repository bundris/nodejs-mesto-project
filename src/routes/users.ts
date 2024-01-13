import { Router } from 'express';
import {
  createUser, getAllUsers, getUserById, updateUser, updateAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getAllUsers);
router.get('/:userId', getUserById);

router.post('/', createUser);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;
