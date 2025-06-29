const express = require('express');
const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  addMenuItem
} = require('../controllers/restaurantController');
const { authenticate, authorize } = require('../../../shared/middleware/auth');

const router = express.Router();

router.post('/', authenticate, authorize('restaurant_owner', 'admin'), createRestaurant);
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.put('/:id', authenticate, authorize('restaurant_owner', 'admin'), updateRestaurant);
router.delete('/:id', authenticate, authorize('restaurant_owner', 'admin'), deleteRestaurant);
router.post('/:id/menu', authenticate, authorize('restaurant_owner', 'admin'), addMenuItem);

module.exports = router;