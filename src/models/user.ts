import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { IUser, UserModel } from '../utils/types';
import avatarRegexp from '../utils/validation';
import NotAuthorizedError from '../errors/NotAuthorizedError';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина имени - 2 символа'],
      maxlength: [30, 'Максимальная длина имени - 30 символов'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина описания - 2 символа'],
      maxlength: [200, 'Максимальная длина описания - 200 символов'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (url: string) => validator.matches(url, avatarRegexp),
        message: 'Некорректный URL',
      },
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Пароль обязателен'],
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this
    .findOne({ email })
    .select('+password')
    .then((user: IUser) => {
      if (!user) {
        return Promise.reject(new NotAuthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt
        .compare(password, user.password)
        .then((matched: Boolean) => {
          if (!matched) {
            return Promise.reject(new NotAuthorizedError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
});

export default model<IUser, UserModel>('user', userSchema);
