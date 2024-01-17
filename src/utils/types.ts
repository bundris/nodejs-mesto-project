import { Request } from 'express';
import mongoose, { Model, Schema } from 'mongoose';

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
  email: string,
  password: string,
}

interface UserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) =>
    Promise<mongoose.Document<unknown, any, IUser>>;
}

// Express extensions
interface SessionRequest extends Request {
  user?: {
    _id: string,
  }
}

export {
  SessionRequest, IUser, ICard, UserModel,
};
