import { celebrate, Joi } from 'celebrate';
import avatarRegexp from '../utils/validation';

// User related validations
const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUser = celebrate({
  // Валидируем body при создании пользователя
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().regex(avatarRegexp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
const validateUserInfo = celebrate({
  // Валидируем name/about
  params: Joi.object().keys({
    userId: Joi.string().required().hex(),
  }),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
});
const validateAvatar = celebrate({
  body: {
    avatar: Joi.string().regex(avatarRegexp),
  },
});

// Card related validations
const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex(),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().regex(avatarRegexp),
  }),
});

export {
  validateLogin, validateUser, validateUserInfo, validateAvatar,
  validateCard,
  validateId,
};
