import { model, Schema } from 'mongoose';
import validator from 'validator';
import { IUser } from '../utils/types';
import avatarRegexp from '../utils/validation';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина имени - 2 символа'],
      maxlength: [30, 'Максимальная длина имени - 30 символов'],
      required: [true, 'Имя пользователя обязательное'],
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина описания - 2 символа'],
      maxlength: [200, 'Максимальная длина описания - 200 символов'],
      required: [true, 'Описание пользователя обязательное'],
    },
    avatar: {
      type: String,
      required: [true, 'Ссылка на аватар обязательна'],
      validate: {
        validator: (url: string) => validator.matches(url, avatarRegexp),
        message: 'Некорректный URL',
      },
    },
  },
  {
    versionKey: false,
  },
);

export default model<IUser>('user', userSchema);
