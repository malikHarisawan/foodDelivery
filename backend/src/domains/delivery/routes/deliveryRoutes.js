const express = require('express');
const {
  createDelivery,
  getDeliveries,
  updateDeliveryStatus,
  updateDriverLocation
} = require('../controllers/deliveryController');
const { authenticate, authorize } = require('../../../shared/middleware/auth');

const router = express.Router();

router.post('/', authenticate, authorize('admin'), createDelivery);
router.get('/', authenticate, authorize('delivery_driver', 'admin'), getDeliveries);
router.patch('/:id/status', authenticate, authorize('delivery_driver', 'admin'), updateDeliveryStatus);
router.patch('/:id/location', authenticate, authorize('delivery_driver'), updateDriverLocation);

module.exports = router;