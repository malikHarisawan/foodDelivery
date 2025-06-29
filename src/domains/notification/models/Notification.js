const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['order_status', 'delivery_update', 'promotion', 'system', 'payment'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' },
    actionUrl: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  channels: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true }
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed'],
    default: 'pending'
  },
  isRead: { type: Boolean, default: false },
  readAt: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

notificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.isModified('isRead') && this.isRead && !this.readAt) {
    this.readAt = Date.now();
  }
  next();
});

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);