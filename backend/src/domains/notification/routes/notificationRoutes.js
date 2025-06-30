const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification
} = require('../controllers/notificationController');
const { authenticate, authorize } = require('../../../shared/middleware/auth');

const router = express.Router();

router.get('/', authenticate, getNotifications);
router.patch('/read', authenticate, markAsRead);
router.patch('/read-all', authenticate, markAllAsRead);
router.delete('/:id', authenticate, deleteNotification);
router.post('/', authenticate, authorize('admin'), createNotification);

module.exports = router;