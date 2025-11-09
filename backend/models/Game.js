import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['action', 'puzzle', 'strategy', 'adventure', 'arcade', 'other']
  },
  icon: {
    type: String,
    default: ''
  },
  gameType: {
    type: String,
    required: true,
    enum: ['balloon-pop', 'puzzle', 'other']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

gameSchema.virtual('isFree').get(function() {
  return this.price === 0;
});

const Game = mongoose.model('Game', gameSchema);

export default Game;