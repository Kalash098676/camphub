import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'campushub_secret_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, hostelBlock, roomNo, department, semester, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const emailLower = email.toLowerCase().trim();

    // Check if user already exists
    const userExists = await User.findOne({ email: emailLower });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email: emailLower,
      password,
      role: role || 'student',
      hostelBlock: hostelBlock || 'H-3 (Boys Hostel)',
      roomNo: roomNo || '304-B',
      department: department || 'Computer Science & Engineering',
      semester: semester || 'Semester 5 (Junior)',
      phone: phone || '+91 98765 43210',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      walletBalance: 100.00, // Bonus sign up wallet money
      campusCoins: 50
    });

    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          studentId: user.studentId,
          department: user.department,
          semester: user.semester,
          hostelBlock: user.hostelBlock,
          roomNo: user.roomNo,
          walletBalance: user.walletBalance,
          campusCoins: user.campusCoins,
          memberSince: user.memberSince
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const emailLower = email.toLowerCase().trim();

    // Find user by email
    const user = await User.findOne({ email: emailLower });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          studentId: user.studentId,
          department: user.department,
          semester: user.semester,
          hostelBlock: user.hostelBlock,
          roomNo: user.roomNo,
          walletBalance: user.walletBalance,
          campusCoins: user.campusCoins,
          memberSince: user.memberSince
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching user profile', error: error.message });
  }
};
