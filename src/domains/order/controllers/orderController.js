const Order = require('../models/Order');
const Restaurant = require('../../restaurant/models/Restaurant');
const Notification = require('../../notification/models/Notification');

const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod, specialInstructions } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || !restaurant.isActive || !restaurant.isAcceptingOrders) {
      return res.status(400).json({ error: 'Restaurant is not available for orders' });
    }

    let subtotal = 0;
    const orderItems = items.map(item => {
      const menuItem = restaurant.menu.id(item.menuItemId);
      if (!menuItem || !menuItem.isAvailable) {
        throw new Error(`Menu item ${item.name} is not available`);
      }
      
      const itemSubtotal = menuItem.price * item.quantity;
      subtotal += itemSubtotal;
      
      return {
        ...item,
        name: menuItem.name,
        price: menuItem.price,
        subtotal: itemSubtotal
      };
    });

    const deliveryFee = restaurant.deliveryFee;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax + (req.body.tip || 0);

    const order = new Order({
      customerId: req.user.id,
      restaurantId,
      items: orderItems,
      pricing: {
        subtotal,
        deliveryFee,
        tax,
        tip: req.body.tip || 0,
        total
      },
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      estimatedDeliveryTime: new Date(Date.now() + restaurant.estimatedDeliveryTime * 60000)
    });

    await order.save();

    await Notification.create({
      userId: restaurant.ownerId,
      type: 'order_status',
      title: 'New Order Received',
      message: `New order #${order._id} received`,
      data: { orderId: order._id, restaurantId }
    });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (req.user.role === 'customer') {
      query.customerId = req.user.id;
    } else if (req.user.role === 'restaurant_owner') {
      const restaurants = await Restaurant.find({ ownerId: req.user.id }).select('_id');
      query.restaurantId = { $in: restaurants.map(r => r._id) };
    }

    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('customerId', 'profile.firstName profile.lastName email')
      .populate('restaurantId', 'name address')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const query = { _id: req.params.id };

    if (req.user.role === 'customer') {
      query.customerId = req.user.id;
    } else if (req.user.role === 'restaurant_owner') {
      const restaurants = await Restaurant.find({ ownerId: req.user.id }).select('_id');
      query.restaurantId = { $in: restaurants.map(r => r._id) };
    }

    const order = await Order.findOne(query)
      .populate('customerId', 'profile.firstName profile.lastName email phone')
      .populate('restaurantId', 'name address contact');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (req.user.role === 'restaurant_owner') {
      const restaurant = await Restaurant.findOne({
        _id: order.restaurantId,
        ownerId: req.user.id
      });
      if (!restaurant) {
        return res.status(403).json({ error: 'Unauthorized to update this order' });
      }
    }

    order.status = status;
    await order.save();

    await Notification.create({
      userId: order.customerId,
      type: 'order_status',
      title: 'Order Status Updated',
      message: `Your order #${order._id} is now ${status}`,
      data: { orderId: order._id }
    });

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};