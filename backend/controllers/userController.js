import { User } from '../models/User.js';
import { Address } from '../models/Address.js';
import { WalletTransaction } from '../models/WalletTransaction.js';
import { Notification } from '../models/Notification.js';
import { Coupon } from '../models/Coupon.js';
import { Order } from '../models/Order.js';

// Helper to get authenticated user or fallback user
const getOrCreateUser = async (req) => {
  if (req && req.user) return req.user;
  let user = await User.findOne();
  if (!user) {
    user = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav.sharma@campushub.edu.in',
      password: 'password123',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      role: 'student',
      studentId: 'CH-2024-8901',
      department: 'Computer Science & Engineering',
      semester: 'Semester 5 (Junior)',
      hostelBlock: 'H-3 (Boys Hostel)',
      roomNo: '304-B',
      isStudentVerified: true,
      profileCompletion: 85,
      walletBalance: 0.00,
      campusCoins: 0,
      memberSince: 'August 2024'
    });
  }
  return user;
};

// 1. GET /api/user/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await getOrCreateUser(req);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 2. PUT /api/user/profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await getOrCreateUser(req);
    Object.assign(user, req.body);
    await user.save();
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};

// 3. GET /api/user/orders
export const getUserOrders = async (req, res) => {
  try {
    const user = await getOrCreateUser(req);
    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching orders', error: error.message });
  }
};


// 4. GET /api/user/wallet
export const getWalletData = async (req, res) => {
  try {
    const user = await getOrCreateUser(req);
    const transactions = await WalletTransaction.find({ userId: user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: {
        walletBalance: user.walletBalance,
        transactions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 5. POST /api/user/wallet/add
export const addWalletMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await getOrCreateUser(req);
    user.walletBalance += Number(amount);
    await user.save();

    const transaction = await WalletTransaction.create({
      userId: user._id,
      title: `+₹${amount} Wallet Recharge`,
      amount: Number(amount),
      type: 'credit',
      category: 'Recharge',
      status: 'Completed'
    });

    res.status(200).json({ success: true, walletBalance: user.walletBalance, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Top-up failed', error: error.message });
  }
};

// 6. GET /api/user/addresses
export const getAddresses = async (req, res) => {
  try {
    const user = await getOrCreateUser(req);
    const addresses = await Address.find({ userId: user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: addresses.length, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 7. POST /api/user/addresses
export const addAddress = async (req, res) => {
  try {
    const user = await getOrCreateUser(req);
    const count = await Address.countDocuments({ userId: user._id });
    const newAddress = await Address.create({
      userId: user._id,
      ...req.body,
      isDefault: count === 0 ? true : req.body.isDefault || false
    });
    res.status(201).json({ success: true, data: newAddress });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Could not add address', error: error.message });
  }
};

// 8. PUT /api/user/addresses/:id
export const updateAddress = async (req, res) => {
  try {
    const user = await getOrCreateUser(req);
    if (req.body.isDefault) {
      await Address.updateMany({ userId: user._id }, { isDefault: false });
    }
    const updated = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};

// 9. DELETE /api/user/addresses/:id
export const deleteAddress = async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
  }
};

// 10. GET /api/user/notifications
export const getNotifications = async (req, res) => {
  try {
    const user = await getOrCreateUser(req);
    const notifications = await Notification.find({ userId: user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 11. GET /api/user/coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 12. GET /api/user/reward-points
export const getRewardPoints = async (req, res) => {
  try {
    const user = await getOrCreateUser(req);
    res.status(200).json({ success: true, rewardPoints: user.campusCoins });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
