import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
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
  price: {
    type: Number,
    required: true,
    min: 0
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    default: 'fictitious'
  }
});

purchaseSchema.index({ user: 1, game: 1 }, { unique: true });

const Purchase = mongoose.model('Purchase', purchaseSchema);

export default Purchase;