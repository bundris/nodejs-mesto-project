import { Router } from 'express';
import http2 from 'http2';
import usersRouter from './users';
import cardsRouter from './cards';

const router = Router();

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({
    message: 'Такой страницы нет',
  });
});
export default router;
