const Restaurant = require('../models/Restaurant');

class RestaurantService {
  async createRestaurant(restaurantData, ownerId) {
    const restaurant = new Restaurant({
      ...restaurantData,
      ownerId
    });
    await restaurant.save();
    return restaurant;
  }

  async getRestaurants(filters = {}) {
    const { 
      cuisineType, 
      city, 
      isActive = true, 
      page = 1, 
      limit = 10,
      sortBy = 'rating.average',
      sortOrder = 'desc'
    } = filters;

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

    return {
      restaurants,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalRestaurants: total
      }
    };
  }

  async getRestaurantById(id) {
    const restaurant = await Restaurant.findById(id)
      .populate('ownerId', 'profile.firstName profile.lastName email');
    
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    
    return restaurant;
  }

  async updateRestaurant(id, updateData, ownerId) {
    const restaurant = await Restaurant.findOne({
      _id: id,
      ownerId
    });

    if (!restaurant) {
      throw new Error('Restaurant not found or unauthorized');
    }

    Object.assign(restaurant, updateData);
    await restaurant.save();
    return restaurant;
  }

  async deleteRestaurant(id, ownerId) {
    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: id, ownerId },
      { isActive: false }
    );

    if (!restaurant) {
      throw new Error('Restaurant not found or unauthorized');
    }

    return restaurant;
  }

  async addMenuItem(restaurantId, menuItem, ownerId) {
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      ownerId
    });

    if (!restaurant) {
      throw new Error('Restaurant not found or unauthorized');
    }

    restaurant.menu.push(menuItem);
    await restaurant.save();
    
    return restaurant.menu[restaurant.menu.length - 1];
  }
}

module.exports = new RestaurantService();