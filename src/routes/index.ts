import {
  Request, Response, NextFunction, Router,
} from 'express';
import usersRouter from './users';
import cardsRouter from './cards';
import authRouter from './auth';
import auth from '../middlewares/auth';
import NotFoundError from '../errors/NotFoundError';

const router = Router();

router.use('/', authRouter);
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Такой страницы нет'));
});
export default router;
