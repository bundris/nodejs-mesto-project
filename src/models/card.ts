import { model, Schema } from 'mongoose';
import validator from 'validator';
import { ICard } from '../utils/types';
import avatarRegexp from '../utils/validation';

const cardSchema = new Schema<ICard>(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина названия карточки - 2 символа'],
      maxlength: [30, 'Максимальная длина названия карточки - 30 символов'],
      required: [true, 'Название карточки обязательно'],
    },
    link: {
      type: String,
      required: [true, 'Картинка карточки обязательна'],
      validate: {
        validator: (url: string) => validator.matches(url, avatarRegexp),
        message: 'Некорректный URL',
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: 'user',
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
  },
);

export default model<ICard>('card', cardSchema);
