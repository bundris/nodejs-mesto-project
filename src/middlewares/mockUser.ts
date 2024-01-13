import { NextFunction, Response } from 'express';
import { SessionRequest } from '../utils/types';

const mockUser = (req: SessionRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };

  next();
};

export default mockUser;
