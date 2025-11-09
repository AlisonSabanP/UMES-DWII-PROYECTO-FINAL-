import { Game, Purchase, User, Score } from '../models/index.js';
import mongoose from 'mongoose';

export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find({ isActive: true })
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });
    res.json({ games });
  } catch (error) {
    console.error('Error al obtener los juegos:', error);
    res.status(500).json({ error: 'Error del servidor al obtener los juegos' });
  }
};

export const getGameById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID de juego inválido' }); 
    }
    const game = await Game.findById(req.params.id)
      .populate('createdBy', 'fullName email');
    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    res.json({ game });
  } catch (error) {
    console.error('Error al obtener el juego:', error);
    res.status(500).json({ error: 'Error del servidor al obtener el juego' });
  }
};

export const createGame = async (req, res) => {
  try {
    const game = new Game({
      ...req.body,
      createdBy: req.user._id
    });
    await game.save();
    const populatedGame = await Game.findById(game._id)
      .populate('createdBy', 'fullName email');
    res.status(201).json({
      message: 'Juego creado exitosamente',
      game: populatedGame
    });
  } catch (error) {
    console.error('Error al crear el juego:', error);
    res.status(500).json({ error: 'Error del servidor al crear el juego' });
  }
};

export const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de juego inválido' });
    }
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    if (game.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Solo puedes actualizar tus propios juegos.' });
    }
    Object.assign(game, req.body);
    await game.save();
    const updatedGame = await Game.findById(game._id)
      .populate('createdBy', 'fullName email');
    res.json({
      message: 'Juego actualizado exitosamente',              
      game: updatedGame
    });
  } catch (error) {
    console.error('Update game error:', error);
    res.status(500).json({ error: 'Error del servidor al actualizar el juego' });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de juego inválido' });
    }
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    if (game.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. solo puedes borrar tus propios juegos.' });
    }
    await Game.findByIdAndDelete(id);
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Delete game error:', error);
    res.status(500).json({ error: 'Error del servidor al eliminar el juego' });
  }
};

export const purchaseGame = async (req, res) => {
  try {
    const { gameId } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ error: 'ID de juego inválido' });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    const existingPurchase = await Purchase.findOne({ user: userId, game: gameId });
    if (existingPurchase) {
      return res.status(400).json({ error: 'Ya tienes este juego' });
    }

    const isFree = game.price === 0;
    const purchasePrice = isFree ? 0 : game.price;

    const purchase = new Purchase({
      user: userId,
      game: gameId,
      price: purchasePrice
    });
    await purchase.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { ownedGames: gameId }
    });

    const message = isFree
      ? 'Juego gratuito agregado a tu biblioteca exitosamente'
      : 'Juego comprado exitosamente';

    res.json({ message, purchase });
  } catch (error) {
    console.error('Purchase game error:', error);
    res.status(500).json({ error: 'Error del servidor al comprar el juego' });
  }
};

export const getUserGames = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('ownedGames')
      .select('ownedGames');
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ games: user.ownedGames });
  } catch (error) {
    console.error('Error al obtener los juegos del usuario:', error);
    res.status(500).json({ error: 'Error del servidor al obtener los juegos del usuario' });
  }
};

export const submitScore = async (req, res) => {
  try {
    const { gameId, score, gameData } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ error: 'ID de juego inválido' });
    }

    const user = await User.findById(userId);
    const game = await Game.findById(gameId);
    if (!user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    const ownsGame = user.ownedGames.map(id => id.toString()).includes(gameId);
    const isFreeGame = game && game.price === 0;
    if (!ownsGame && !isFreeGame) {
      return res.status(403).json({ error: 'Debes tener este juego para enviar puntuaciones' });
    }

    const newScore = new Score({
      user: userId,
      game: gameId,
      score,
      gameData: gameData || {}
    });
    await newScore.save();

    res.json({
      message: 'Puntuación enviada exitosamente',
      score: newScore
    });
  } catch (error) {
    console.error('Submit score error:', error);
    res.status(500).json({ error: 'Error del servidor al enviar la puntuación' });
  }
};

export const getGameRankings = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de juego inválido' });
    }
    const rankings = await Score.find({ game: id })
      .populate('user', 'fullName')
      .sort({ score: -1 })
      .limit(10);
    res.json({ rankings });
  } catch (error) {
    console.error('Get rankings error:', error);
    res.status(500).json({ error: 'Error del servidor al obtener las puntuaciones' });
  }
};
