import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const DriverDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
        <p className="text-gray-600">Manage your deliveries and earnings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <Card.Content>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">8</h3>
                <p className="text-sm text-gray-500">Completed Today</p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">$124</h3>
                <p className="text-sm text-gray-500">Earnings Today</p>
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
                <h3 className="text-2xl font-bold text-gray-900">4.9</h3>
                <p className="text-sm text-gray-500">Rating</p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">🚗</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">Available</h3>
                <p className="text-sm text-gray-500">Status</p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Available Deliveries</h3>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                3 available
              </span>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">Pizza Palace → Downtown</p>
                    <p className="text-sm text-gray-500">2.3 miles • Est. $8.50</p>
                  </div>
                  <Button size="sm">Accept</Button>
                </div>
                <div className="text-xs text-gray-400">
                  Order #12345 • 2 items
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">Burger Joint → Uptown</p>
                    <p className="text-sm text-gray-500">1.8 miles • Est. $6.75</p>
                  </div>
                  <Button size="sm">Accept</Button>
                </div>
                <div className="text-xs text-gray-400">
                  Order #12346 • 1 item
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Current Delivery</h3>
          </Card.Header>
          <Card.Content>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <p className="text-gray-500 mb-2">No active delivery</p>
              <p className="text-sm text-gray-400">Accept a delivery to start earning</p>
            </div>
          </Card.Content>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <span className="text-2xl mb-2 block">🟢</span>
                <p className="text-sm font-medium">Go Online</p>
              </div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <span className="text-2xl mb-2 block">📍</span>
                <p className="text-sm font-medium">Update Location</p>
              </div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <span className="text-2xl mb-2 block">📊</span>
                <p className="text-sm font-medium">View Earnings</p>
              </div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <span className="text-2xl mb-2 block">🏠</span>
                <p className="text-sm font-medium">Go Home</p>
              </div>
            </button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default DriverDashboard;