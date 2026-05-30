import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';
import auth from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/', createOrder);
router.get('/:id', getOrderById);

// Admin-protected routes
router.get('/', auth, getAllOrders);
router.put('/:id/status', auth, updateOrderStatus);

export default router;
