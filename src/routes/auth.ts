import { Router } from 'express';
import { createUser } from '../controllers/users';
import login from '../controllers/auth';
import { validateLogin, validateUser } from '../middlewares/validator';

const router = Router();

router.get('/signin', validateLogin, login);
router.get('/signup', validateUser, createUser);

export default router;
