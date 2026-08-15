import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: '+91 98765 43210' },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' },
    role: { type: String, enum: ['student', 'seller', 'admin'], default: 'student' },
    studentId: { type: String, default: 'CH-2024-8901' },
    department: { type: String, default: 'Computer Science & Engineering' },
    semester: { type: String, default: 'Semester 5 (Junior)' },
    hostelBlock: { type: String, default: 'H-3 (Boys Hostel)' },
    roomNo: { type: String, default: '304-B' },
    isStudentVerified: { type: Boolean, default: true },
    profileCompletion: { type: Number, default: 85 },
    walletBalance: { type: Number, default: 1450.00 },
    campusCoins: { type: Number, default: 350 },
    memberSince: { type: String, default: 'August 2024' }
  },
  { timestamps: true }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);

