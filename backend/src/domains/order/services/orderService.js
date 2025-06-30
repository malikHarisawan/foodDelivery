const Order = require('../models/Order');
const Restaurant = require('../../restaurant/models/Restaurant');
const Notification = require('../../notification/models/Notification');

class OrderService {
  async createOrder(orderData, customerId) {
    const { restaurantId, items, deliveryAddress, paymentMethod, specialInstructions, tip } = orderData;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || !restaurant.isActive || !restaurant.isAcceptingOrders) {
      throw new Error('Restaurant is not available for orders');
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
    const total = subtotal + deliveryFee + tax + (tip || 0);

    const order = new Order({
      customerId,
      restaurantId,
      items: orderItems,
      pricing: {
        subtotal,
        deliveryFee,
        tax,
        tip: tip || 0,
        total
      },
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      estimatedDeliveryTime: new Date(Date.now() + restaurant.estimatedDeliveryTime * 60000)
    });

    await order.save();

    // Send notification to restaurant owner
    await Notification.create({
      userId: restaurant.ownerId,
      type: 'order_status',
      title: 'New Order Received',
      message: `New order #${order._id} received`,
      data: { orderId: order._id, restaurantId }
    });

    return order;
  }

  async getOrders(filters, userRole, userId) {
    const { status, page = 1, limit = 10 } = filters;
    const query = {};

    if (userRole === 'customer') {
      query.customerId = userId;
    } else if (userRole === 'restaurant_owner') {
      const restaurants = await Restaurant.find({ ownerId: userId }).select('_id');
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

    return {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    };
  }

  async getOrderById(orderId, userRole, userId) {
    const query = { _id: orderId };

    if (userRole === 'customer') {
      query.customerId = userId;
    } else if (userRole === 'restaurant_owner') {
      const restaurants = await Restaurant.find({ ownerId: userId }).select('_id');
      query.restaurantId = { $in: restaurants.map(r => r._id) };
    }

    const order = await Order.findOne(query)
      .populate('customerId', 'profile.firstName profile.lastName email phone')
      .populate('restaurantId', 'name address contact');

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async updateOrderStatus(orderId, status, userRole, userId) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (userRole === 'restaurant_owner') {
      const restaurant = await Restaurant.findOne({
        _id: order.restaurantId,
        ownerId: userId
      });
      if (!restaurant) {
        throw new Error('Unauthorized to update this order');
      }
    }

    order.status = status;
    await order.save();

    // Send notification to customer
    await Notification.create({
      userId: order.customerId,
      type: 'order_status',
      title: 'Order Status Updated',
      message: `Your order #${order._id} is now ${status}`,
      data: { orderId: order._id }
    });

    return order;
  }
}

module.exports = new OrderService();