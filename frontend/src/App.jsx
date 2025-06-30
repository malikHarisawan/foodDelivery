import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { USER_ROLES } from './lib/config/api';

// Layout components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard pages
import CustomerDashboard from './pages/customer/Dashboard';
import Restaurants from './pages/customer/Restaurants';
import RestaurantDashboard from './pages/restaurant/Dashboard';
import DriverDashboard from './pages/driver/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const { initialize, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const getDashboardRoute = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case USER_ROLES.CUSTOMER:
        return '/dashboard';
      case USER_ROLES.RESTAURANT_OWNER:
        return '/restaurant-dashboard';
      case USER_ROLES.DELIVERY_DRIVER:
        return '/driver-dashboard';
      case USER_ROLES.ADMIN:
        return '/admin-dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/home" element={!isAuthenticated ? <Home /> : <Navigate to={getDashboardRoute()} />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={getDashboardRoute()} />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={getDashboardRoute()} />} />
          
          {/* Protected routes with layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={isAuthenticated ? <Navigate to={getDashboardRoute()} /> : <Home />} />
            
            {/* Customer routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/restaurants" 
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
                  <Restaurants />
                </ProtectedRoute>
              } 
            />
            
            {/* Restaurant owner routes */}
            <Route 
              path="/restaurant-dashboard" 
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.RESTAURANT_OWNER]}>
                  <RestaurantDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Driver routes */}
            <Route 
              path="/driver-dashboard" 
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.DELIVERY_DRIVER]}>
                  <DriverDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin routes */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to={getDashboardRoute()} />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
