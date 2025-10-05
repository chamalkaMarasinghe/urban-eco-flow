const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const useragent = require('express-useragent');

// Import routes
const AuthRoutes = require('../routes/auth');
const SensorRoutes = require('../routes/sensor');
const CollectionRequestRoutes = require('../routes/collectionRequest');
const BinRoutes = require('../routes/bin');

// Import error handlers
const { globalErrorHandler } = require("../controllers/error.js");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(useragent.express());

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Test API is running' });
});

// API routes
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/sensors', SensorRoutes);
app.use('/api/v1/collection-requests', CollectionRequestRoutes);
app.use('/api/v1/bins', BinRoutes);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
