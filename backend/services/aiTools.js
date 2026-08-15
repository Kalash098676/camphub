import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { WalletTransaction } from '../models/WalletTransaction.js';
import { Address } from '../models/Address.js';
import { Coupon } from '../models/Coupon.js';
import { Category } from '../models/Category.js';
import { campusHubKnowledge } from './campusHubKnowledge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load static products JSON for offline / zero-result fallback
let initialProductsCatalog = [];
try {
  const jsonPath = path.resolve(__dirname, '../seed/products.json');
  if (fs.existsSync(jsonPath)) {
    initialProductsCatalog = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  }
} catch (e) {
  console.warn('Could not load seed products.json:', e.message);
}

/**
 * Search Products dynamically from MongoDB (with fallback to catalog)
 */
export const searchProducts = async ({
  query = '',
  category = '',
  minPrice = null,
  maxPrice = null,
  stockOnly = false,
  sortBy = '', // 'price_asc', 'price_desc', 'rating'
  limit = 10
} = {}) => {
  let products = [];
  try {
    if (mongoose.connection.readyState === 1) {
      const filter = {};

      if (category && category !== 'all') {
        filter.category = new RegExp(category, 'i');
      }

      if (minPrice !== null || maxPrice !== null) {
        filter.price = {};
        if (minPrice !== null && !isNaN(minPrice)) filter.price.$gte = Number(minPrice);
        if (maxPrice !== null && !isNaN(maxPrice)) filter.price.$lte = Number(maxPrice);
      }

      if (stockOnly) {
        filter.stock = { $gt: 0 };
      }

      if (query && query.trim()) {
        const stopWords = new Set(['show', 'me', 'the', 'under', 'below', 'less', 'than', 'more', 'with', 'available', 'cheap', 'cheapest', 'best', 'for', 'item', 'items', 'product', 'products', 'some', 'something', 'have', 'you', 'give', 'which', 'want', 'to', 'see', 'need', 'buying', 'pro', 'max', 'plus', 'mini', 'ultra', '1tb', '256gb', '512gb', 'edition']);
        const words = query.trim().toLowerCase().split(/\s+/).filter(w => w.length >= 3 && !stopWords.has(w) && isNaN(w));
        const stemmedWords = words.map(w => (w.endsWith('s') && w.length > 3) ? w.slice(0, -1) : w);

        if (stemmedWords.length > 0) {
          const regexPattern = stemmedWords.map(w => `\\b${w}`).join('|');
          filter.$or = [
            { title: { $regex: regexPattern, $options: 'i' } },
            { categoryLabel: { $regex: regexPattern, $options: 'i' } },
            { category: { $regex: regexPattern, $options: 'i' } },
            { description: { $regex: regexPattern, $options: 'i' } }
          ];
        }
      }

      let mongoQuery = Product.find(filter);

      if (sortBy === 'price_asc') {
        mongoQuery = mongoQuery.sort({ price: 1 });
      } else if (sortBy === 'price_desc') {
        mongoQuery = mongoQuery.sort({ price: -1 });
      } else if (sortBy === 'rating') {
        mongoQuery = mongoQuery.sort({ rating: -1 });
      }

      products = await mongoQuery.limit(limit).lean();

      // If category filter was provided but strict keyword filter returned 0, try category search alone
      if (products.length === 0 && category && category !== 'all') {
        const catFilter = { category: new RegExp(category, 'i') };
        if (minPrice !== null || maxPrice !== null) {
          catFilter.price = {};
          if (minPrice !== null && !isNaN(minPrice)) catFilter.price.$gte = Number(minPrice);
          if (maxPrice !== null && !isNaN(maxPrice)) catFilter.price.$lte = Number(maxPrice);
        }
        products = await Product.find(catFilter).limit(limit).lean();
      }

      // Only return featured products if NO query and NO category were specified
      if (products.length === 0 && (!query || query.trim().length === 0) && (!category || category === 'all')) {
        products = await Product.find().limit(limit).lean();
      }
    }
  } catch (err) {
    console.warn('MongoDB search query failed, using static catalog:', err.message);
  }

  // Fallback to static catalog if Mongo returned 0 items
  if ((!products || products.length === 0) && initialProductsCatalog.length > 0) {
    let filtered = [...initialProductsCatalog];

    if (category && category !== 'all') {
      const catFiltered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
      if (catFiltered.length > 0) filtered = catFiltered;
    }

    if (minPrice !== null && !isNaN(minPrice)) {
      filtered = filtered.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice !== null && !isNaN(maxPrice)) {
      filtered = filtered.filter(p => p.price <= Number(maxPrice));
    }

    if (query && query.trim()) {
      const stopWords = new Set(['show', 'me', 'the', 'under', 'below', 'less', 'than', 'more', 'with', 'available', 'cheap', 'cheapest', 'best', 'for', 'item', 'items', 'product', 'products', 'some', 'something', 'have', 'you', 'give', 'which', 'want', 'to', 'see', 'need', 'buying', 'pro', 'max', 'plus', 'mini', 'ultra', '1tb', '256gb', '512gb', 'edition']);
      const words = query.trim().toLowerCase().split(/\s+/).filter(w => w.length >= 3 && !stopWords.has(w) && isNaN(w));
      const stemmedWords = words.map(w => (w.endsWith('s') && w.length > 3) ? w.slice(0, -1) : w);

      if (stemmedWords.length > 0) {
        const kwFiltered = filtered.filter(p => {
          const text = `${p.title} ${p.categoryLabel || ''} ${p.category} ${p.description || ''}`.toLowerCase();
          return stemmedWords.some(w => new RegExp(`\\b${w}`, 'i').test(text));
        });
        if (kwFiltered.length > 0) {
          filtered = kwFiltered;
        } else if (query.trim().length >= 3) {
          // Specific product search returned zero matches
          return [];
        }
      }
    }

    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    products = filtered.slice(0, limit).map((p, idx) => ({
      _id: `prod-seed-${idx + 1}`,
      ...p
    }));
  }

  return products.map(p => ({
    id: (p._id || p.id).toString(),
    _id: (p._id || p.id).toString(),
    title: p.title,
    category: p.category,
    categoryLabel: p.categoryLabel,
    price: p.price,
    originalPrice: p.originalPrice || p.price,
    rating: p.rating || 4.5,
    stock: p.stock ?? 20,
    delivery: p.delivery || 'Delivery today',
    image: p.image
  }));
};

/**
 * Get detailed specs for a single product by ID or title match
 */
export const getProductDetails = async (productIdOrTitle) => {
  if (!productIdOrTitle) return null;
  
  let product = null;
  // Try ObjectId search first
  if (productIdOrTitle.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(productIdOrTitle).lean();
  }
  
  if (!product) {
    product = await Product.findOne({
      title: { $regex: productIdOrTitle, $options: 'i' }
    }).lean();
  }

  if (!product) return null;

  return {
    id: product._id.toString(),
    _id: product._id.toString(),
    title: product.title,
    description: product.description,
    category: product.category,
    categoryLabel: product.categoryLabel,
    price: product.price,
    originalPrice: product.originalPrice,
    rating: product.rating,
    stock: product.stock,
    delivery: product.delivery,
    image: product.image
  };
};

/**
 * Fetch authenticated user's orders
 */
export const getUserOrders = async (userId, limit = 5) => {
  if (!userId) return null;
  let orders = [];
  try {
    if (mongoose.connection.readyState === 1) {
      orders = await Order.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    }
  } catch (e) {
    console.warn('MongoDB order query notice:', e.message);
  }

  return orders.map(o => ({
    id: o._id.toString(),
    orderId: o._id.toString().slice(-6).toUpperCase(),
    customerName: o.customerName,
    hostelBlock: o.hostelBlock,
    roomNo: o.roomNo,
    itemsCount: o.items ? o.items.length : 0,
    itemsSummary: o.items ? o.items.map(i => `${i.title} (x${i.quantity})`).join(', ') : 'Items',
    totalAmount: o.totalAmount,
    paymentMethod: o.paymentMethod,
    orderStatus: o.orderStatus,
    createdAt: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : 'Recently'
  }));
};

/**
 * Fetch specific order for user with authorization check
 */
export const getOrderDetails = async (userId, orderIdQuery) => {
  if (!userId) return { error: 'UNAUTHORIZED' };
  let orders = [];
  try {
    if (mongoose.connection.readyState === 1) {
      orders = await Order.find({ userId }).lean();
    }
  } catch (e) {
    console.warn('MongoDB getOrderDetails notice:', e.message);
  }
  if (!orders || orders.length === 0) return null;

  if (!orderIdQuery) {
    return orders[0];
  }

  const cleanQuery = orderIdQuery.trim().toLowerCase();
  const matched = orders.find(o => 
    o._id.toString().toLowerCase().includes(cleanQuery) ||
    (o._id.toString().slice(-6).toLowerCase() === cleanQuery)
  );

  return matched || null;
};

/**
 * Fetch Wallet Balance & Recent Ledger Transactions for user
 */
export const getWalletInfo = async (user) => {
  if (!user) return null;
  let transactions = [];
  try {
    if (mongoose.connection.readyState === 1) {
      transactions = await WalletTransaction.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
    }
  } catch (e) {
    console.warn('MongoDB wallet transactions notice:', e.message);
  }

  return {
    walletBalance: user.walletBalance ?? 0,
    campusCoins: user.campusCoins ?? 0,
    recentTransactions: transactions.map(t => ({
      title: t.title,
      amount: t.amount,
      type: t.type,
      status: t.status,
      date: t.date
    }))
  };
};

/**
 * Fetch User Profile info
 */
export const getUserProfile = (user) => {
  if (!user) return null;
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    studentId: user.studentId,
    department: user.department,
    semester: user.semester,
    hostelBlock: user.hostelBlock,
    roomNo: user.roomNo,
    walletBalance: user.walletBalance ?? 0,
    campusCoins: user.campusCoins ?? 0,
    memberSince: user.memberSince || 'August 2024'
  };
};

/**
 * Fetch User Saved Addresses
 */
export const getUserAddresses = async (userId) => {
  if (!userId) return null;
  const addresses = await Address.find({ userId }).lean();
  return addresses.map(a => ({
    hostel: a.hostel,
    roomNumber: a.roomNumber,
    label: a.label,
    isDefault: a.isDefault
  }));
};

/**
 * Fetch Categories from Mongo DB or fallback
 */
export const getCategories = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      const distinctCats = await Product.aggregate([
        { $group: { _id: '$category', label: { $first: '$categoryLabel' }, count: { $sum: 1 } } }
      ]);
      if (distinctCats && distinctCats.length > 0) {
        return distinctCats.map(c => ({
          key: c._id,
          label: c.label || c._id,
          itemsCount: c.count
        }));
      }
    }
  } catch (err) {
    console.warn('MongoDB category query failed:', err.message);
  }

  // Extract distinct categories from seed products.json catalog
  if (initialProductsCatalog && initialProductsCatalog.length > 0) {
    const map = new Map();
    initialProductsCatalog.forEach(p => {
      if (p.category && !map.has(p.category)) {
        map.set(p.category, {
          key: p.category,
          label: p.categoryLabel || p.category,
          itemsCount: initialProductsCatalog.filter(x => x.category === p.category).length
        });
      }
    });
    return Array.from(map.values());
  }

  return [
    { key: 'study', label: 'Study Essentials', itemsCount: 15 },
    { key: 'electronics', label: 'Electronics & Accessories', itemsCount: 12 },
    { key: 'hostel', label: 'Hostel Essentials', itemsCount: 10 },
    { key: 'personal', label: 'Personal Care', itemsCount: 8 },
    { key: 'merchandise', label: 'College Merchandise', itemsCount: 6 }
  ];
};

/**
 * Fetch CampusHub Services
 */
export const getServices = async () => {
  const baseServices = campusHubKnowledge.services.map(s => ({
    id: s.id,
    name: s.name,
    price: s.price,
    duration: s.duration,
    description: s.description
  }));

  return [
    ...baseServices,
    {
      id: 'printhub',
      name: 'PrintHub Cloud Document Printing',
      price: 'From ₹2/page',
      duration: 'Dorm delivery',
      description: 'Upload PDF/DOC documents for B&W (₹2/pg) or Color (₹10/pg) printing with optional Spiral Binding (₹49).'
    },
    {
      id: 'marketplace',
      name: 'Student Marketplace',
      price: 'Peer Rates',
      duration: 'Instant peer chat',
      description: 'Trade pre-owned textbooks, lab coats, cycles, and hostel gear directly with dorm peers.'
    }
  ];
};

/**
 * Fetch Active Coupons
 */
export const getCoupons = async () => {
  const coupons = await Coupon.find().lean();
  if (coupons && coupons.length > 0) {
    return coupons.map(c => ({
      code: c.code,
      title: c.title,
      discountText: c.discountText,
      minOrderAmount: c.minOrderAmount,
      expiryDate: c.expiryDate
    }));
  }
  return [
    { code: 'CAMPUS100', title: 'Flat ₹100 Off', discountText: 'Flat ₹100 Off on orders above ₹499', minOrderAmount: 499, expiryDate: '31 Aug 2026' },
    { code: 'EXAMPREP', title: '15% Off Study Supplies', discountText: '15% Off on books & stationery', minOrderAmount: 299, expiryDate: '31 Aug 2026' }
  ];
};
