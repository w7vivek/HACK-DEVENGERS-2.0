import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  sender: {
    type: String,
    required: true,
    trim: true,
  },
  receiver: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  mode: {
    type: String,
    enum: ['UPI', 'Cash', 'Net Banking'],
    required: true,
  },
  accountHolder: {
    type: String,
    trim: true,
  },
  accountNumber: {
    type: String,
    trim: true,
  },
  ifsc: {
    type: String,
    trim: true,
    uppercase: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
    index: true,
  },
  syncedToExcel: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Transaction', transactionSchema);
