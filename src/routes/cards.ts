import { Router } from 'express';
import {
  createCard, getAllCards, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';
import { validateId, validateCard } from '../middlewares/validator';

const router = Router();

router.get('/', getAllCards);
router.post('/', validateCard, createCard);
router.delete('/:cardId', validateId, deleteCard);

router.put('/:cardId/likes', validateId, likeCard);
router.delete('/:cardId/likes', validateId, dislikeCard);

export default router;
