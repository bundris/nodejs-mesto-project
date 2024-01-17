import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SessionRequest } from '../utils/types';
import NotAuthorizedError from '../errors/NotAuthorizedError';
import CONFIG from '../config';

const auth = (req: SessionRequest, _res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, CONFIG.SECRET_KEY);
  } catch (err) {
    next(new NotAuthorizedError('Ошибка авторизации'));
  }

  req.user = payload as { _id: string }; // записываем пейлоуд в объект запроса
  next();
};

export default auth;
