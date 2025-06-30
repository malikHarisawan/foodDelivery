const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { authenticate, authorize } = require('../../../shared/middleware/auth');

const router = express.Router();

router.post('/', authenticate, authorize('customer'), createOrder);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/status', authenticate, authorize('restaurant_owner', 'admin', 'delivery_driver'), updateOrderStatus);

module.exports = router;