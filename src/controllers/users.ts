import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import http2 from 'http2';
import { IUser, SessionRequest } from '../utils/types';
import User from '../models/user';
import NotAuthorizedError from '../errors/NotAuthorizedError';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import CustomError from '../errors/CustomError';
import ConflictResourceError from '../errors/ConflictResourceError';

const getUser = (userId: string) => User.findById(userId)
  .orFail()
  .catch((err) => {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      throw new NotFoundError('Пользователь не найден');
    }
    if (err instanceof mongoose.Error.CastError) {
      throw new BadRequestError('Некорректный ID пользователя');
    }
    throw new CustomError('На сервере произошла ошибка');
  });
// Create operations
export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res
      .status(http2.constants.HTTP_STATUS_CREATED)
      .send({ data: user._id }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Некорректный формат входных данных'));
      }
      if (err.code === 11000) {
        next(new ConflictResourceError('Такой пользователь уже существует'));
      }
      next(new CustomError('На сервере произошла ошибка'));
    });
};

// Read operations
export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  getUser(userId)
    .then((user) => res.send({ data: user }))
    .catch(next);
};

export const getSignedUser = (req: SessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (userId === undefined) {
    next(new NotAuthorizedError('Пользователь не авторизован'));
  } else {
    getUser(userId)
      .then((user) => res.send({ data: user }))
      .catch(next);
  }
};

export const getAllUsers = (_req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => next(new CustomError('На сервере произошла ошибка')));
};

// Update operations
const updateUser = (userId: String, newData: Partial<IUser>) => User.findByIdAndUpdate(
  userId,
  { ...newData },
  {
    new: true,
    runValidators: true,
  },
)
  .orFail()
  .catch((err) => {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      throw new NotFoundError('Пользователь не найден');
    }
    if (err instanceof mongoose.Error.ValidationError) {
      throw new BadRequestError('Некорректный формат входных данных');
    }
    if (err instanceof mongoose.Error.CastError) {
      throw new BadRequestError('Некорректный ID пользователя');
    }
    throw new CustomError('На сервере произошла ошибка');
  });

export const updateProfile = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { name, about } = req.body;
  updateUser(userId, { name, about })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { avatar } = req.body;
  updateUser(userId, { avatar })
    .then((user) => res.send({ data: user }))
    .catch(next);
};
