const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['assigned', 'en_route_to_restaurant', 'at_restaurant', 'picked_up', 'en_route_to_customer', 'delivered', 'cancelled'],
    default: 'assigned'
  },
  pickupLocation: {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    }
  },
  dropoffLocation: {
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    },
    instructions: String
  },
  timeline: {
    assignedAt: { type: Date, default: Date.now },
    pickedUpAt: Date,
    deliveredAt: Date
  },
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  driverLocation: {
    coordinates: {
      lat: Number,
      lng: Number
    },
    lastUpdated: Date
  },
  deliveryFee: { type: Number, required: true, min: 0 },
  distance: Number,
  notes: String,
  rating: {
    score: { type: Number, min: 1, max: 5 },
    comment: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

deliverySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Delivery', deliverySchema);