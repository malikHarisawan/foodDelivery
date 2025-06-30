import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { restaurantService } from '../../services/restaurant';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Restaurants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');

  const { data: restaurants = [], isLoading, error } = useQuery({
    queryKey: ['restaurants'],
    queryFn: restaurantService.getAllRestaurants,
  });

  // Mock data for demonstration since backend might not be running
  const mockRestaurants = [
    {
      _id: '1',
      name: 'Pizza Palace',
      description: 'Authentic Italian pizzas made with fresh ingredients',
      cuisineType: 'Italian',
      rating: { average: 4.8, totalReviews: 156 },
      deliveryFee: 2.99,
      minimumOrder: 15.00,
      estimatedDeliveryTime: 25,
      imageUrl: 'https://via.placeholder.com/300x200?text=Pizza+Palace',
      isActive: true,
      isAcceptingOrders: true,
    },
    {
      _id: '2',
      name: 'Burger Joint',
      description: 'Gourmet burgers and crispy fries',
      cuisineType: 'American',
      rating: { average: 4.6, totalReviews: 89 },
      deliveryFee: 1.99,
      minimumOrder: 12.00,
      estimatedDeliveryTime: 20,
      imageUrl: 'https://via.placeholder.com/300x200?text=Burger+Joint',
      isActive: true,
      isAcceptingOrders: true,
    },
    {
      _id: '3',
      name: 'Sushi Express',
      description: 'Fresh sushi and Japanese cuisine',
      cuisineType: 'Japanese',
      rating: { average: 4.9, totalReviews: 234 },
      deliveryFee: 3.99,
      minimumOrder: 20.00,
      estimatedDeliveryTime: 30,
      imageUrl: 'https://via.placeholder.com/300x200?text=Sushi+Express',
      isActive: true,
      isAcceptingOrders: true,
    },
    {
      _id: '4',
      name: 'Taco Fiesta',
      description: 'Authentic Mexican tacos and burritos',
      cuisineType: 'Mexican',
      rating: { average: 4.7, totalReviews: 198 },
      deliveryFee: 2.49,
      minimumOrder: 10.00,
      estimatedDeliveryTime: 22,
      imageUrl: 'https://via.placeholder.com/300x200?text=Taco+Fiesta',
      isActive: true,
      isAcceptingOrders: true,
    },
  ];

  const displayRestaurants = restaurants.length > 0 ? restaurants : mockRestaurants;

  const filteredRestaurants = displayRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = !selectedCuisine || restaurant.cuisineType === selectedCuisine;
    return matchesSearch && matchesCuisine && restaurant.isActive && restaurant.isAcceptingOrders;
  });

  const cuisineTypes = [...new Set(displayRestaurants.map(r => r.cuisineType))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
        <p className="text-gray-600">Discover delicious food from local restaurants</p>
      </div>

      {/* Search and Filter */}
      <Card>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search restaurants or dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Cuisines</option>
                {cuisineTypes.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Restaurant Grid */}
      {filteredRestaurants.length === 0 ? (
        <Card>
          <Card.Content className="text-center py-12">
            <p className="text-gray-500 text-lg">No restaurants found</p>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant._id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-w-16 aspect-h-10">
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </div>
              <Card.Content>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600">{restaurant.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {restaurant.cuisineType}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
                      <span className="ml-1 text-gray-600">
                        {restaurant.rating.average} ({restaurant.rating.totalReviews})
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>🚚 ${restaurant.deliveryFee} delivery</span>
                    <span>⏱️ {restaurant.estimatedDeliveryTime} min</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Min order: ${restaurant.minimumOrder}
                  </div>
                </div>
              </Card.Content>
              <Card.Footer>
                <Button className="w-full">
                  View Menu
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;