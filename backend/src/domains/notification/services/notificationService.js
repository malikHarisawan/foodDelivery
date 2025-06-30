const Notification = require('../models/Notification');

class NotificationService {
  async getNotifications(userId, filters) {
    const { isRead, type, page = 1, limit = 20 } = filters;
    const query = { userId };

    if (isRead !== undefined) query.isRead = isRead === 'true';
    if (type) query.type = type;

    const notifications = await Notification.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false
    });

    return {
      notifications,
      unreadCount,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalNotifications: total
      }
    };
  }

  async markAsRead(userId, notificationIds) {
    const result = await Notification.updateMany(
      {
        _id: { $in: notificationIds },
        userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    return result;
  }

  async markAllAsRead(userId) {
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return result;
  }

  async deleteNotification(userId, notificationId) {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  }

  async createNotification(notificationData) {
    const { userId, type, title, message, data, channels, priority } = notificationData;

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
    return notification;
  }

  async getUnreadCount(userId) {
    const count = await Notification.countDocuments({
      userId,
      isRead: false
    });
    return count;
  }

  async createBulkNotifications(notifications) {
    const result = await Notification.insertMany(notifications);
    return result;
  }
}

module.exports = new NotificationService();