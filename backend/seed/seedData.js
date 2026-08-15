import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Address } from '../models/Address.js';
import { WalletTransaction } from '../models/WalletTransaction.js';
import { Notification } from '../models/Notification.js';
import { Coupon } from '../models/Coupon.js';
import { Order } from '../models/Order.js';

dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsFilePath = path.resolve(__dirname, 'products.json');
const sampleProducts = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));



const seedDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB for seeding...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campushub', { serverSelectionTimeoutMS: 5000 });

    await Product.deleteMany();
    await User.deleteMany();
    await Address.deleteMany();
    await WalletTransaction.deleteMany();
    await Notification.deleteMany();
    await Coupon.deleteMany();
    await Order.deleteMany();

    const createdProducts = await Product.insertMany(sampleProducts);

    const mainUser = await User.create({
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
      walletBalance: 1450.00,
      campusCoins: 350,
      memberSince: 'August 2024'
    });

    await Address.insertMany([
      { userId: mainUser._id, hostel: 'H-3 (Boys Hostel)', roomNumber: '304-B', label: 'Hostel', isDefault: true },
      { userId: mainUser._id, hostel: 'Central Academic Block', roomNumber: 'Lab 201', label: 'Academic Block', isDefault: false },
      { userId: mainUser._id, hostel: 'Central Library', roomNumber: 'Reading Hall 3', label: 'Library', isDefault: false }
    ]);

    await WalletTransaction.insertMany([
      { userId: mainUser._id, title: '+₹500 Wallet Recharge', amount: 500, type: 'credit', category: 'Recharge', status: 'Completed', date: '04 Aug 2026' },
      { userId: mainUser._id, title: '-₹120 Printing Service (Lab Report)', amount: 120, type: 'debit', category: 'PrintHub', status: 'Completed', date: '03 Aug 2026' },
      { userId: mainUser._id, title: '-₹350 Store Purchase (Calculator)', amount: 350, type: 'debit', category: 'Store', status: 'Completed', date: '02 Aug 2026' },
      { userId: mainUser._id, title: '+₹50 Cashback on Stationery Order', amount: 50, type: 'credit', category: 'Cashback', status: 'Completed', date: '01 Aug 2026' }
    ]);

    await Notification.insertMany([
      { userId: mainUser._id, title: '📦 Order Delivered', message: 'Your order #CH-90214 (Notebooks Pack) was delivered to Room 304-B.', type: 'Order', isRead: false, time: '10 mins ago' },
      { userId: mainUser._id, title: '⚡ Flash Sale Live!', message: 'Flat 30% OFF on Engineering books & Hostel Essentials.', type: 'Sale', isRead: false, time: '2 hours ago' },
      { userId: mainUser._id, title: '🎉 Wallet Cashback Credited', message: '₹50 cashback added to your CampusHub Wallet.', type: 'Cashback', isRead: true, time: 'Yesterday' },
      { userId: mainUser._id, title: '🎟️ Coupon Expiring Soon', message: 'Use code CAMPUS100 before midnight for ₹100 OFF.', type: 'Coupon', isRead: true, time: '2 days ago' }
    ]);

    await Coupon.insertMany([
      { code: 'WELCOME100', title: 'Welcome Special', discountText: '₹100 OFF on First Order', minOrderAmount: 299, expiryDate: '31 Aug 2026' },
      { code: 'SAVE50', title: 'Campus Saver', discountText: 'Flat ₹50 Cashback in Wallet', minOrderAmount: 199, expiryDate: '15 Aug 2026' },
      { code: 'FREESHIP', title: 'Hostel Free Delivery', discountText: 'Zero Delivery Fee on Hostel Orders', minOrderAmount: 99, expiryDate: '30 Sep 2026' }
    ]);

    await Order.insertMany([
      {
        userId: mainUser._id,
        customerName: 'Aarav Sharma',
        customerPhone: '+91 98765 43210',
        hostelBlock: 'H-3 (Boys Hostel)',
        roomNo: '304-B',
        items: [
          { productId: createdProducts[0]._id, title: createdProducts[0].title, price: createdProducts[0].price, quantity: 1, image: createdProducts[0].image }
        ],
        totalAmount: 1299.00,
        paymentMethod: 'UPI',
        orderStatus: 'Out for Delivery'
      },
      {
        userId: mainUser._id,
        customerName: 'Aarav Sharma',
        customerPhone: '+91 98765 43210',
        hostelBlock: 'H-3 (Boys Hostel)',
        roomNo: '304-B',
        items: [
          { productId: createdProducts[1]._id, title: createdProducts[1].title, price: createdProducts[1].price, quantity: 2, image: createdProducts[1].image }
        ],
        totalAmount: 360.00,
        paymentMethod: 'COD',
        orderStatus: 'Delivered'
      }
    ]);

    console.log('✅ Seed completed successfully with User, Addresses, Wallet, Coupons & Orders!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
