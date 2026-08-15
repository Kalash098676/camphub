import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hostel: { type: String, required: true },
    roomNumber: { type: String, required: true },
    label: { type: String, enum: ['Hostel', 'Library', 'Academic Block', 'Gate'], default: 'Hostel' },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Address = mongoose.model('Address', addressSchema);
