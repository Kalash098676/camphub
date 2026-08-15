import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    icon: { type: String },
    itemsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Category = mongoose.model('Category', categorySchema);
