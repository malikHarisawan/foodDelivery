const Delivery = require('../models/Delivery');
const Order = require('../../order/models/Order');
const User = require('../../user/models/User');
const Notification = require('../../notification/models/Notification');

class DeliveryService {
  async createDelivery(deliveryData) {
    const { orderId, driverId } = deliveryData;

    const order = await Order.findById(orderId).populate('restaurantId');
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'ready') {
      throw new Error('Order is not ready for delivery');
    }

    const driver = await User.findOne({ _id: driverId, role: 'delivery_driver', isActive: true });
    if (!driver) {
      throw new Error('Driver not found or inactive');
    }

    const existingDelivery = await Delivery.findOne({ orderId });
    if (existingDelivery) {
      throw new Error('Delivery already exists for this order');
    }

    const delivery = new Delivery({
      orderId,
      driverId,
      pickupLocation: {
        restaurantId: order.restaurantId._id,
        address: order.restaurantId.address
      },
      dropoffLocation: {
        address: order.deliveryAddress,
        instructions: order.deliveryAddress.instructions
      },
      deliveryFee: order.pricing.deliveryFee,
      estimatedDeliveryTime: order.estimatedDeliveryTime
    });

    await delivery.save();
    await Order.findByIdAndUpdate(orderId, { status: 'picked_up' });

    // Send notifications
    await Promise.all([
      Notification.create({
        userId: order.customerId,
        type: 'delivery_update',
        title: 'Driver Assigned',
        message: `Your order is being picked up by ${driver.profile.firstName}`,
        data: { orderId, deliveryId: delivery._id }
      }),
      Notification.create({
        userId: driverId,
        type: 'delivery_update',
        title: 'New Delivery Assignment',
        message: `You have been assigned delivery #${delivery._id}`,
        data: { orderId, deliveryId: delivery._id }
      })
    ]);

    return delivery;
  }

  async getDeliveries(filters, userRole, userId) {
    const { status, page = 1, limit = 10 } = filters;
    const query = {};

    if (userRole === 'delivery_driver') {
      query.driverId = userId;
    }

    if (status) query.status = status;

    const deliveries = await Delivery.find(query)
      .populate('orderId', 'customerId pricing status')
      .populate('driverId', 'profile.firstName profile.lastName email phone')
      .populate('pickupLocation.restaurantId', 'name address contact')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Delivery.countDocuments(query);

    return {
      deliveries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalDeliveries: total
      }
    };
  }

  async updateDeliveryStatus(deliveryId, updateData, userRole, userId) {
    const { status, coordinates } = updateData;
    
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      throw new Error('Delivery not found');
    }

    if (userRole === 'delivery_driver' && delivery.driverId.toString() !== userId) {
      throw new Error('Unauthorized to update this delivery');
    }

    delivery.status = status;
    
    if (coordinates) {
      delivery.driverLocation = {
        coordinates,
        lastUpdated: new Date()
      };
    }

    if (status === 'picked_up') {
      delivery.timeline.pickedUpAt = new Date();
      await Order.findByIdAndUpdate(delivery.orderId, { status: 'picked_up' });
    } else if (status === 'delivered') {
      delivery.timeline.deliveredAt = new Date();
      delivery.actualDeliveryTime = new Date();
      await Order.findByIdAndUpdate(delivery.orderId, { 
        status: 'delivered',
        actualDeliveryTime: new Date()
      });
    }

    await delivery.save();

    // Send notification to customer
    const order = await Order.findById(delivery.orderId);
    await Notification.create({
      userId: order.customerId,
      type: 'delivery_update',
      title: 'Delivery Status Updated',
      message: `Your delivery is now ${status}`,
      data: { orderId: delivery.orderId, deliveryId: delivery._id }
    });

    return delivery;
  }

  async updateDriverLocation(deliveryId, coordinates, userId) {
    const delivery = await Delivery.findOne({
      _id: deliveryId,
      driverId: userId,
      status: { $in: ['assigned', 'en_route_to_restaurant', 'picked_up', 'en_route_to_customer'] }
    });

    if (!delivery) {
      throw new Error('Active delivery not found');
    }

    delivery.driverLocation = {
      coordinates,
      lastUpdated: new Date()
    };

    await delivery.save();
    return delivery.driverLocation;
  }
}

module.exports = new DeliveryService();