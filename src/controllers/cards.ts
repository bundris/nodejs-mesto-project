import { Request, Response } from 'express';
import mongoose from 'mongoose';
import http2 from 'http2';
import Card from '../models/card';
import { SessionRequest } from '../utils/types';

// Create operations
const createCard = (req: SessionRequest, res: Response) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user?._id,
  })
    .then((card) => res
      .status(http2.constants.HTTP_STATUS_CREATED)
      .send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Невалидные входные данные',
        });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: err.message,
      });
    });
};

// Read operations
const getAllCards = (req: SessionRequest, res: Response) => {
  Card.find({})
    .then((card) => {
      res.send({ data: card });
    })
    .catch(() => res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'На сервере произошла ошибка',
    }));
};

// Update operations
const likeCard = (req: SessionRequest, res: Response) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user?._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({
          message: 'Карточка не найдена',
        });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Некорректный ID карточки',
        });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const dislikeCard = (req: SessionRequest, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({
          message: 'Карточка не найдена',
        });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Некорректный ID карточки',
        });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

// Delete operations
const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .orFail()
    .then(() => res.status(200).send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({
          message: 'Карточка не найдена',
        });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Некорректный ID карточки',
        });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

export {
  createCard, getAllCards, deleteCard, dislikeCard, likeCard,
};
