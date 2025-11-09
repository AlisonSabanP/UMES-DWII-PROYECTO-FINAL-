import express from 'express';
import {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  purchaseGame,
  getUserGames,
  submitScore,
  getGameRankings
} from '../controllers/gameController.js';
import { authenticate } from '../middleware/auth.js'; 
import { validate, validateParams } from '../middleware/validation.js';
import { gameSchema, updateGameSchema, purchaseSchema, scoreSchema, idSchema } from '../utils/validation.js';

const router = express.Router();

router.get('/', getAllGames);
router.get('/:id', validateParams(idSchema), getGameById);
router.get('/:id/rankings', validateParams(idSchema), getGameRankings);

router.use(authenticate);

router.post('/purchase', validate(purchaseSchema), purchaseGame);
router.get('/user/library', getUserGames);
router.post('/submit-score', validate(scoreSchema), submitScore);

router.post('/', validate(gameSchema), createGame);
router.put('/:id', validateParams(idSchema), validate(updateGameSchema), updateGame);
router.delete('/:id', validateParams(idSchema), deleteGame);

export default router;