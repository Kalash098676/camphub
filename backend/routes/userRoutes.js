import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUserOrders,
  getWalletData,
  addWalletMoney,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getNotifications,
  getCoupons,
  getRewardPoints
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

router.get('/orders', protect, getUserOrders);

router.get('/wallet', protect, getWalletData);
router.post('/wallet/add', protect, addWalletMoney);

router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:id', protect, updateAddress);
router.delete('/addresses/:id', protect, deleteAddress);

router.get('/notifications', protect, getNotifications);
router.get('/coupons', getCoupons);
router.get('/reward-points', protect, getRewardPoints);

export default router;

