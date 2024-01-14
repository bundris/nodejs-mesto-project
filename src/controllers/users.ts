import { Request, Response } from 'express';
import mongoose from 'mongoose';
import http2 from 'http2';
import User from '../models/user';

// Create operations
export const createUser = (req: Request, res: Response) => {
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
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Невалидные входные данные',
        });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

// Read operations
export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        // Если сработала orFail
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Некорректный ID пользователя',
        });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

export const getAllUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'На сервере произошла ошибка',
    }));
};

// Update operations
export const updateUser = (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Некорректный формат входных данных',
        });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Некорректный ID пользователя',
        });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

export const updateAvatar = (req: Request, res: Response) => {
  const { userId } = req.params;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Некорректный формат входных данных',
        });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Некорректный ID пользователя',
        });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};
