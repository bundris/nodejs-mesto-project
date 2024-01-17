import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import CONFIG from '../config';

const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        CONFIG.SECRET_KEY,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    })
    .catch(next);
};

export default login;
