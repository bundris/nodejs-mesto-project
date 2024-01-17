import { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import http2 from 'http2';
import Card from '../models/card';
import { ICard, SessionRequest } from '../utils/types';
import BadRequestError from '../errors/BadRequestError';
import CustomError from '../errors/CustomError';
import NotFoundError from '../errors/NotFoundError';
import ForbiddenError from '../errors/ForbiddenError';

// Create operations
const createCard = (req: SessionRequest, res: Response, next: NextFunction) => {
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
        next(new BadRequestError('Невалидные входные данные'));
      }
      next(new CustomError('На сервере произошла ошибка'));
    });
};

// Read operations
const getAllCards = (req: SessionRequest, res: Response, next: NextFunction) => {
  Card.find({})
    .then((card) => {
      res.send({ data: card });
    })
    .catch(() => next(new CustomError('На сервере произошла ошибка')));
};

// Update operations
const likeCard = (req: SessionRequest, res: Response, next: NextFunction) => {
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
        next(new NotFoundError('Карточка не найдена'));
      }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный ID карточки'));
      }
      next(new CustomError('На сервере произошла ошибка'));
    });
};

const dislikeCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка не найдена'));
      }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный ID карточки'));
      }
      next(new CustomError('На сервере произошла ошибка'));
    });
};

// Delete operations
const deleteCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail()
    .then((card: ICard) => {
      if (req.user?._id !== String(card.owner)) {
        next(new ForbiddenError('Нехорошо удалять чужие карточки'));
      }
    });
  Card.findByIdAndDelete(cardId)
    .orFail()
    .then(() => res.status(200).send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка не найдена'));
      }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный ID карточки'));
      }
      next(new CustomError('На сервере произошла ошибка'));
    });
};

export {
  createCard, getAllCards, deleteCard, dislikeCard, likeCard,
};
