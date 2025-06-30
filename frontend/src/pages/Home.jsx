import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    // Redirect authenticated users to their dashboard
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Delicious Food</span>
                  <span className="block text-primary-600">Delivered Fast</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Order from your favorite restaurants and get your food delivered right to your doorstep. 
                  Fast, reliable, and delicious.
                </p>
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <div className="rounded-md shadow">
                    <Link to="/register">
                      <Button size="lg" className="w-full sm:w-auto">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link to="/login">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for food delivery
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <Card.Content className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto mb-4">
                    <span className="text-2xl">🍕</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Wide Selection</h3>
                  <p className="text-base text-gray-500">
                    Choose from hundreds of restaurants and cuisines in your area.
                  </p>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Fast Delivery</h3>
                  <p className="text-base text-gray-500">
                    Get your food delivered in 30 minutes or less with real-time tracking.
                  </p>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto mb-4">
                    <span className="text-2xl">💳</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Easy Payment</h3>
                  <p className="text-base text-gray-500">
                    Secure payment options including credit cards, debit cards, and digital wallets.
                  </p>
                </Card.Content>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* For Different Users Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Join Us</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              For Everyone
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <Card.Content className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Customers</h3>
                <p className="text-gray-600 mb-4">
                  Order from your favorite restaurants with just a few clicks.
                </p>
                <Link to="/register">
                  <Button variant="outline" size="sm">
                    Order Now
                  </Button>
                </Link>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏪</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Restaurants</h3>
                <p className="text-gray-600 mb-4">
                  Grow your business by reaching more customers online.
                </p>
                <Link to="/register">
                  <Button variant="outline" size="sm">
                    Join as Restaurant
                  </Button>
                </Link>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚗</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Drivers</h3>
                <p className="text-gray-600 mb-4">
                  Earn money on your own schedule by delivering food.
                </p>
                <Link to="/register">
                  <Button variant="outline" size="sm">
                    Drive with Us
                  </Button>
                </Link>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;