import { Request } from 'express';
import { Schema } from 'mongoose';

// Data types and interfaces
interface ICard {
  name: string,
  link: string,
  owner: Schema.Types.ObjectId,
  likes: Array<Schema.Types.ObjectId>,
  createdAt: Date
}

interface IUser {
  name: string,
  about: string,
  avatar: string,
}

// Express extensions
interface SessionRequest extends Request {
  user?: {
    _id: string,
  }
}

export { SessionRequest, IUser, ICard };
