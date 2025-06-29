# Food Delivery App - Monolith to Microservices

A comprehensive food delivery application built with Node.js, Express.js, and MongoDB. Designed as a monolith with clear domain boundaries for easy conversion to microservices.

## Architecture Overview

This application follows Domain-Driven Design (DDD) principles, organizing code into bounded contexts that will become individual microservices:

- **Auth Domain** → Auth Microservice
- **User Domain** → User Microservice  
- **Restaurant Domain** → Restaurant Microservice
- **Order Domain** → Order Microservice
- **Delivery Domain** → Delivery Microservice
- **Notification Domain** → Notification Microservice

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT + bcrypt
- **Validation**: Joi
- **Security**: Helmet, CORS
- **Logging**: Morgan

## Project Structure

```
src/
├── domains/                    # Future microservices
│   ├── auth/                  # Authentication & authorization
│   ├── user/                  # User management
│   ├── restaurant/            # Restaurant & menu management
│   ├── order/                 # Order processing
│   ├── delivery/              # Delivery tracking
│   └── notification/          # Notifications
├── shared/                    # Shared utilities
│   ├── database/              # DB connection
│   ├── middleware/            # Auth, error handling
│   ├── utils/                 # Helper functions
│   └── validators/            # Input validation
├── config/                    # Configuration files
└── app.js                     # Main application
```

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Start MongoDB
5. Run the application: `npm run dev`

## Environment Variables

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/food-delivery-app
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile

### Users
- `PUT /api/v1/users/profile` - Update profile
- `DELETE /api/v1/users/account` - Deactivate account
- `GET /api/v1/users` - Get users (admin only)

### Restaurants
- `POST /api/v1/restaurants` - Create restaurant
- `GET /api/v1/restaurants` - Get restaurants
- `GET /api/v1/restaurants/:id` - Get restaurant by ID
- `PUT /api/v1/restaurants/:id` - Update restaurant
- `POST /api/v1/restaurants/:id/menu` - Add menu item

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get orders
- `GET /api/v1/orders/:id` - Get order by ID
- `PATCH /api/v1/orders/:id/status` - Update order status

### Delivery
- `POST /api/v1/delivery` - Create delivery
- `GET /api/v1/delivery` - Get deliveries
- `PATCH /api/v1/delivery/:id/status` - Update delivery status
- `PATCH /api/v1/delivery/:id/location` - Update driver location

### Notifications
- `GET /api/v1/notifications` - Get notifications
- `PATCH /api/v1/notifications/read` - Mark as read
- `PATCH /api/v1/notifications/read-all` - Mark all as read

## User Roles

- **Customer**: Place orders, track deliveries
- **Restaurant Owner**: Manage restaurants, menus, and orders
- **Delivery Driver**: Handle deliveries, update location
- **Admin**: Full system access

## Database Schema

### Collections by Domain:
- **Users**: User accounts and profiles
- **Restaurants**: Restaurant info and menus
- **Orders**: Order details and status
- **Deliveries**: Delivery tracking
- **Notifications**: User notifications

## Microservices Migration Path

1. **Data Separation**: Each domain has clear data boundaries
2. **API Boundaries**: Routes are organized by future service boundaries
3. **Shared Dependencies**: Easily extractable to shared libraries
4. **Event-Driven**: Notification system ready for async messaging

## Development Commands

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## Features

- ✅ User authentication & authorization
- ✅ Restaurant management
- ✅ Order processing
- ✅ Delivery tracking
- ✅ Real-time notifications
- ✅ Role-based access control
- ✅ Input validation & error handling
- ✅ Domain-driven architecture
- ✅ Microservice-ready structure