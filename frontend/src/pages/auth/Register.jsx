import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { USER_ROLES } from '../../lib/config/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.CUSTOMER,
    profile: {
      firstName: '',
      lastName: '',
      phone: '',
    }
  });
  
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      const registerData = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        profile: formData.profile
      };
      
      await register(registerData);
      navigate('/login', { 
        state: { message: 'Registration successful! Please log in.' }
      });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to existing account
            </Link>
          </p>
        </div>

        <Card>
          <Card.Content>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="profile.firstName"
                  value={formData.profile.firstName}
                  onChange={handleChange}
                  required
                  placeholder="John"
                />
                <Input
                  label="Last Name"
                  name="profile.lastName"
                  value={formData.profile.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                />
              </div>

              <Input
                label="Email address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
              />

              <Input
                label="Phone Number"
                name="profile.phone"
                type="tel"
                value={formData.profile.phone}
                onChange={handleChange}
                required
                placeholder="+1 (555) 123-4567"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value={USER_ROLES.CUSTOMER}>Customer</option>
                  <option value={USER_ROLES.RESTAURANT_OWNER}>Restaurant Owner</option>
                  <option value={USER_ROLES.DELIVERY_DRIVER}>Delivery Driver</option>
                </select>
              </div>

              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                helperText="Password must be at least 6 characters"
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                error={formData.confirmPassword && !passwordsMatch ? 'Passwords do not match' : ''}
              />

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={!formData.email || !formData.password || !passwordsMatch}
              >
                Create Account
              </Button>
            </form>
          </Card.Content>
        </Card>

        <div className="text-center">
          <Link
            to="/"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;