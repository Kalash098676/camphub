import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    category: { type: String, default: 'General' },
    status: { type: String, enum: ['Completed', 'Pending', 'Failed'], default: 'Completed' },
    date: { type: String, default: () => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
  },
  { timestamps: true }
);

export const WalletTransaction = mongoose.model('WalletTransaction', walletTransactionSchema);
