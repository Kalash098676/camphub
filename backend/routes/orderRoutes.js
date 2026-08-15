import express from 'express';
import { createOrder, getOrders, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/my-orders', protect, getMyOrders);

export default router;

