import { Router } from 'express';
import http2 from 'http2';
import usersRouter from './users';
import cardsRouter from './cards';
import authRouter from './auth';
import auth from '../middlewares/auth';

const router = Router();

router.use('/', authRouter);
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({
    message: 'Такой страницы нет',
  });
});
export default router;
