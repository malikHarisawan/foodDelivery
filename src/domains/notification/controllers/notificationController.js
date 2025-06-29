const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {
    const { isRead, type, page = 1, limit = 20 } = req.query;
    const query = { userId: req.user.id };

    if (isRead !== undefined) query.isRead = isRead === 'true';
    if (type) query.type = type;

    const notifications = await Notification.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false
    });

    res.json({
      notifications,
      unreadCount,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalNotifications: total
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;
    
    const result = await Notification.updateMany(
      {
        _id: { $in: notificationIds },
        userId: req.user.id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const { userId, type, title, message, data, channels, priority } = req.body;

    const notification = new Notification({
      userId,
      type,
      title,
      message,
      data,
      channels: channels || { inApp: true, push: true },
      priority: priority || 'medium'
    });

    await notification.save();

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification
};