const Delivery = require('../models/Delivery');
const Order = require('../../order/models/Order');
const User = require('../../user/models/User');
const Notification = require('../../notification/models/Notification');

const createDelivery = async (req, res) => {
  try {
    const { orderId, driverId } = req.body;

    const order = await Order.findById(orderId).populate('restaurantId');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'ready') {
      return res.status(400).json({ error: 'Order is not ready for delivery' });
    }

    const driver = await User.findOne({ _id: driverId, role: 'delivery_driver', isActive: true });
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found or inactive' });
    }

    const existingDelivery = await Delivery.findOne({ orderId });
    if (existingDelivery) {
      return res.status(400).json({ error: 'Delivery already exists for this order' });
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

    res.status(201).json({
      message: 'Delivery created successfully',
      delivery
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getDeliveries = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (req.user.role === 'delivery_driver') {
      query.driverId = req.user.id;
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

    res.json({
      deliveries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalDeliveries: total
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const { status, coordinates } = req.body;
    
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    if (req.user.role === 'delivery_driver' && delivery.driverId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to update this delivery' });
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

    const order = await Order.findById(delivery.orderId);
    await Notification.create({
      userId: order.customerId,
      type: 'delivery_update',
      title: 'Delivery Status Updated',
      message: `Your delivery is now ${status}`,
      data: { orderId: delivery.orderId, deliveryId: delivery._id }
    });

    res.json({
      message: 'Delivery status updated successfully',
      delivery
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateDriverLocation = async (req, res) => {
  try {
    const { coordinates } = req.body;
    
    const delivery = await Delivery.findOne({
      _id: req.params.id,
      driverId: req.user.id,
      status: { $in: ['assigned', 'en_route_to_restaurant', 'picked_up', 'en_route_to_customer'] }
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Active delivery not found' });
    }

    delivery.driverLocation = {
      coordinates,
      lastUpdated: new Date()
    };

    await delivery.save();

    res.json({
      message: 'Location updated successfully',
      location: delivery.driverLocation
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createDelivery,
  getDeliveries,
  updateDeliveryStatus,
  updateDriverLocation
};