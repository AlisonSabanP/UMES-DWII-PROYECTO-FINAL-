import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0 
  },
  gameData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  achievedAt: {
    type: Date,
    default: Date.now
  }
});

scoreSchema.index({ game: 1, score: -1 });
scoreSchema.index({ user: 1, game: 1 });

const Score = mongoose.model('Score', scoreSchema);

export default Score;