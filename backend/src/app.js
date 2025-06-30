require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');

const authRoutes = require('./domains/auth/routes/authRoutes');
const userRoutes = require('./domains/user/routes/userRoutes');
const restaurantRoutes = require('./domains/restaurant/routes/restaurantRoutes');
const orderRoutes = require('./domains/order/routes/orderRoutes');
const deliveryRoutes = require('./domains/delivery/routes/deliveryRoutes');
const notificationRoutes = require('./domains/notification/routes/notificationRoutes');

const errorHandler = require('./shared/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/delivery', deliveryRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Food Delivery App running on port ${PORT}`);
});