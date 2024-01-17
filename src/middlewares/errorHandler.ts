import { Request, NextFunction, Response } from 'express';
import CustomError from '../errors/CustomError';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'Ошибка сервера' : message });
};

export default errorHandler;
