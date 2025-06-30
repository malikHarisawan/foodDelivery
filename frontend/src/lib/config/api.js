export const API_BASE_URL = 'http://localhost:3000/api/v1';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
  },
  
  // User endpoints
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    ACCOUNT: '/users/account',
  },
  
  // Restaurant endpoints
  RESTAURANTS: {
    BASE: '/restaurants',
    MENU: (id) => `/restaurants/${id}/menu`,
  },
  
  // Order endpoints
  ORDERS: {
    BASE: '/orders',
    STATUS: (id) => `/orders/${id}/status`,
  },
  
  // Delivery endpoints
  DELIVERY: {
    BASE: '/delivery',
    STATUS: (id) => `/delivery/${id}/status`,
    LOCATION: (id) => `/delivery/${id}/location`,
  },
  
  // Notification endpoints
  NOTIFICATIONS: {
    BASE: '/notifications',
    READ: '/notifications/read',
    READ_ALL: '/notifications/read-all',
  },
  
  // Health check
  HEALTH: '/health',
};

export const USER_ROLES = {
  CUSTOMER: 'customer',
  RESTAURANT_OWNER: 'restaurant_owner',
  DELIVERY_DRIVER: 'delivery_driver',
  ADMIN: 'admin',
};

export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  PICKED_UP: 'picked_up',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const DELIVERY_STATUSES = {
  ASSIGNED: 'assigned',
  EN_ROUTE_TO_RESTAURANT: 'en_route_to_restaurant',
  AT_RESTAURANT: 'at_restaurant',
  PICKED_UP: 'picked_up',
  EN_ROUTE_TO_CUSTOMER: 'en_route_to_customer',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};