import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['Order', 'Cashback', 'Coupon', 'Sale', 'System'], default: 'System' },
    isRead: { type: Boolean, default: false },
    time: { type: String, default: 'Just now' }
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
