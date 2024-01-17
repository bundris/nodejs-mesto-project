import { Request, NextFunction, Response } from 'express';
import CustomError from '../errors/CustomError';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    const { statusCode = 500, message } = err;
    res
      .status(statusCode)
      .send({ message: statusCode === 500 ? 'Ошибка сервера' : message });
  }
  res.status(500).send({ errors: [{ message: 'Ошибка сервера' }] });
};

export default errorHandler;
