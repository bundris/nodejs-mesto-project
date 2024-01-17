import { Request, NextFunction, Response } from 'express';

interface IError extends Error {
  statusCode: number
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'Ошибка сервера' : message });
};

export default errorHandler;
