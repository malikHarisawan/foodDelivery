const Restaurant = require('../models/Restaurant');

const createRestaurant = async (req, res) => {
  try {
    const restaurantData = {
      ...req.body,
      ownerId: req.user.id
    };

    const restaurant = new Restaurant(restaurantData);
    await restaurant.save();

    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRestaurants = async (req, res) => {
  try {
    const { 
      cuisineType, 
      city, 
      isActive = true, 
      page = 1, 
      limit = 10,
      sortBy = 'rating.average',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive };
    
    if (cuisineType) query.cuisineType = new RegExp(cuisineType, 'i');
    if (city) query['address.city'] = new RegExp(city, 'i');

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const restaurants = await Restaurant.find(query)
      .populate('ownerId', 'profile.firstName profile.lastName email')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort(sortOptions);

    const total = await Restaurant.countDocuments(query);

    res.json({
      restaurants,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalRestaurants: total
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('ownerId', 'profile.firstName profile.lastName email');

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ restaurant });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      ownerId: req.user.id
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found or unauthorized' });
    }

    Object.assign(restaurant, req.body);
    await restaurant.save();

    res.json({
      message: 'Restaurant updated successfully',
      restaurant
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      { isActive: false }
    );

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found or unauthorized' });
    }

    res.json({ message: 'Restaurant deactivated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      ownerId: req.user.id
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found or unauthorized' });
    }

    restaurant.menu.push(req.body);
    await restaurant.save();

    res.status(201).json({
      message: 'Menu item added successfully',
      menuItem: restaurant.menu[restaurant.menu.length - 1]
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  addMenuItem
};