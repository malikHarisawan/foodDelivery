import api from '../lib/api';
import { API_ENDPOINTS } from '../lib/config/api';

export const restaurantService = {
  // Get all restaurants
  getAllRestaurants: async () => {
    const response = await api.get(API_ENDPOINTS.RESTAURANTS.BASE);
    return response.data;
  },

  // Get restaurant by ID
  getRestaurantById: async (id) => {
    const response = await api.get(`${API_ENDPOINTS.RESTAURANTS.BASE}/${id}`);
    return response.data;
  },

  // Create new restaurant (restaurant owner only)
  createRestaurant: async (restaurantData) => {
    const response = await api.post(API_ENDPOINTS.RESTAURANTS.BASE, restaurantData);
    return response.data;
  },

  // Update restaurant (restaurant owner only)
  updateRestaurant: async (id, restaurantData) => {
    const response = await api.put(`${API_ENDPOINTS.RESTAURANTS.BASE}/${id}`, restaurantData);
    return response.data;
  },

  // Delete restaurant (restaurant owner only)
  deleteRestaurant: async (id) => {
    const response = await api.delete(`${API_ENDPOINTS.RESTAURANTS.BASE}/${id}`);
    return response.data;
  },

  // Add menu item to restaurant
  addMenuItem: async (restaurantId, menuItem) => {
    const response = await api.post(API_ENDPOINTS.RESTAURANTS.MENU(restaurantId), menuItem);
    return response.data;
  },
};