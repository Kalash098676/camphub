import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { WalletTransaction } from '../models/WalletTransaction.js';

// @desc   Create new real order from Checkout flow
// @route  POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, hostelBlock, roomNo, shippingAddress, items, totalAmount, paymentMethod } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    // Determine user (from req.user if authenticated, or find first user)
    let userId = req.user ? req.user._id : null;
    if (!userId) {
      const firstUser = await User.findOne();
      if (firstUser) userId = firstUser._id;
    }

    // Retrieve user profile to check wallet balance
    let user = null;
    if (userId) {
      user = await User.findById(userId);
    }

    // Check balance and deduct if paymentMethod is Wallet
    if (paymentMethod === 'Wallet') {
      if (!user) {
        return res.status(404).json({ success: false, message: 'User profile not found for wallet checkout.' });
      }
      if (user.walletBalance < totalAmount) {
        return res.status(400).json({ success: false, message: `Insufficient wallet balance. Total is ₹${totalAmount}, but your wallet balance is only ₹${user.walletBalance.toFixed(0)}.` });
      }
      // Deduct balance
      user.walletBalance -= totalAmount;
      await user.save();
    }

    // 1. Create order in MongoDB
    const order = await Order.create({
      userId,
      customerName: customerName || (user ? user.name : 'Valued Customer'),
      customerPhone: customerPhone || (user ? user.phone : '+91 98765 43210'),
      hostelBlock: hostelBlock || (user ? user.hostelBlock : 'H-3'),
      roomNo: roomNo || (user ? user.roomNo : '101'),
      shippingAddress: shippingAddress || {
        hostel: hostelBlock || 'H-3',
        roomNumber: roomNo || '101',
        city: 'Campus',
        pincode: '110001'
      },
      items,
      totalAmount,
      paymentMethod: paymentMethod || 'UPI',
      orderStatus: 'Ordered'
    });

    // 1b. Create WalletTransaction log
    if (paymentMethod === 'Wallet' && user) {
      await WalletTransaction.create({
        userId: user._id,
        title: `Order #${order._id} Payment`,
        amount: totalAmount,
        type: 'debit',
        category: 'Purchase',
        status: 'Completed'
      });
    }

    // 2. Reduce stock for each product in MongoDB
    for (const item of items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: - (item.quantity || 1) }
        });
      }
    }

    // 3. Create Notification in MongoDB for User
    if (userId) {
      await Notification.create({
        userId,
        title: '📦 Order Placed Successfully!',
        message: `Order #${order._id} for ₹${totalAmount} has been placed.`,
        type: 'Order',
        time: 'Just now'
      });
    }

    res.status(201).json({ success: true, message: 'Order created successfully!', data: order });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ success: false, message: 'Order creation failed', error: error.message });
  }
};

// @desc   Get all orders (Admin / Seller view)
// @route  GET /api/orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc   Get logged in user orders
// @route  GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    let query = {};
    if (userId) {
      query = { userId };
    }
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching user orders', error: error.message });
  }
};

