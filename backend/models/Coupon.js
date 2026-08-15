import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    discountText: { type: String, required: true },
    minOrderAmount: { type: Number, default: 200 },
    expiryDate: { type: String, default: '31 Aug 2026' },
    isApplied: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Coupon = mongoose.model('Coupon', couponSchema);
