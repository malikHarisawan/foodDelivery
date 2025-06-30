import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { USER_ROLES } from '../../lib/config/api';

const Sidebar = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  const getMenuItems = () => {
    switch (user?.role) {
      case USER_ROLES.CUSTOMER:
        return [
          { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
          { path: '/restaurants', label: 'Restaurants', icon: '🍕' },
          { path: '/orders', label: 'My Orders', icon: '📦' },
          { path: '/profile', label: 'Profile', icon: '👤' },
        ];
      
      case USER_ROLES.RESTAURANT_OWNER:
        return [
          { path: '/restaurant-dashboard', label: 'Dashboard', icon: '📊' },
          { path: '/restaurant-profile', label: 'Restaurant', icon: '🏪' },
          { path: '/menu-management', label: 'Menu', icon: '📋' },
          { path: '/restaurant-orders', label: 'Orders', icon: '📦' },
          { path: '/profile', label: 'Profile', icon: '👤' },
        ];
      
      case USER_ROLES.DELIVERY_DRIVER:
        return [
          { path: '/driver-dashboard', label: 'Dashboard', icon: '🚗' },
          { path: '/available-deliveries', label: 'Available', icon: '📍' },
          { path: '/my-deliveries', label: 'My Deliveries', icon: '🚚' },
          { path: '/profile', label: 'Profile', icon: '👤' },
        ];
      
      case USER_ROLES.ADMIN:
        return [
          { path: '/admin-dashboard', label: 'Dashboard', icon: '⚙️' },
          { path: '/admin-users', label: 'Users', icon: '👥' },
          { path: '/admin-restaurants', label: 'Restaurants', icon: '🏪' },
          { path: '/admin-orders', label: 'Orders', icon: '📦' },
          { path: '/admin-notifications', label: 'Notifications', icon: '🔔' },
          { path: '/profile', label: 'Profile', icon: '👤' },
        ];
      
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;