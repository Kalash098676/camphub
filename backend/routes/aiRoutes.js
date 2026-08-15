import express from 'express';
import { chatWithAI } from '../controllers/aiController.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

// Middleware to optionally load user if token is provided
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'campushub_jwt_secret_key_2026_production_saas');
      req.user = await User.findById(decoded.id).select('-password');
    }
    next();
  } catch (error) {
    // Continue without req.user on token failure
    next();
  }
};

router.post('/chat', optionalAuth, chatWithAI);

export default router;
