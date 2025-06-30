const restaurantService = require('../services/restaurantService');

const createRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantService.createRestaurant(req.body, req.user.id);
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
    const result = await restaurantService.getRestaurants(req.query);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    res.json({ restaurant });
  } catch (error) {
    if (error.message === 'Restaurant not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantService.updateRestaurant(req.params.id, req.body, req.user.id);
    res.json({
      message: 'Restaurant updated successfully',
      restaurant
    });
  } catch (error) {
    if (error.message === 'Restaurant not found or unauthorized') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    await restaurantService.deleteRestaurant(req.params.id, req.user.id);
    res.json({ message: 'Restaurant deactivated successfully' });
  } catch (error) {
    if (error.message === 'Restaurant not found or unauthorized') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};

const addMenuItem = async (req, res) => {
  try {
    const menuItem = await restaurantService.addMenuItem(req.params.id, req.body, req.user.id);
    res.status(201).json({
      message: 'Menu item added successfully',
      menuItem
    });
  } catch (error) {
    if (error.message === 'Restaurant not found or unauthorized') {
      return res.status(404).json({ error: error.message });
    }
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