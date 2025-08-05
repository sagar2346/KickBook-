const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB Database
connectDB();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins in dev mode; can restrict in prod
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve profile uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/venues', require('./routes/venues'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/stats', require('./routes/stats'));

// Default homepage route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to KickBook Futsal Platform API!' });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'An internal server error occurred!'
  });
});

// Start Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`KickBook Server running in dev mode on port ${PORT}`);
});
