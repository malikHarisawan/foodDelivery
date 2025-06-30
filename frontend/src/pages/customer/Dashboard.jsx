import React from 'react';
import Card from '../../components/ui/Card';

const CustomerDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
        <p className="text-gray-600">Welcome back! What would you like to order today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <Card.Content>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600 text-lg">🍕</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Browse Restaurants</h3>
                <p className="text-sm text-gray-500">Discover local restaurants</p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">📦</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">My Orders</h3>
                <p className="text-sm text-gray-500">Track your orders</p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">⭐</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Favorites</h3>
                <p className="text-sm text-gray-500">Your favorite restaurants</p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          </Card.Header>
          <Card.Content>
            <div className="text-center py-6">
              <p className="text-gray-500">No recent orders</p>
              <p className="text-sm text-gray-400">Your order history will appear here</p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Nearby Restaurants</h3>
          </Card.Header>
          <Card.Content>
            <div className="text-center py-6">
              <p className="text-gray-500">Loading restaurants...</p>
              <p className="text-sm text-gray-400">We're finding the best restaurants near you</p>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;