const winston = require('winston');
const path = require('path');
const environmentConfig = require('../../config/environmentConfig');

/**
 * Standardized logging utility for UrbanEcoFlow
 * Implements structured logging with different levels and transports
 */

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: format,
  }),
  
  // File transport for errors
  new winston.transports.File({
    filename: path.join(__dirname, '../../../logs/error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(__dirname, '../../../logs/combined.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
];

// Create logger instance
const logger = winston.createLogger({
  level: environmentConfig.ENVIRONMENT === 'DEV' ? 'debug' : 'warn',
  levels,
  format,
  transports,
});

// Add request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id || 'anonymous',
    };
    
    if (res.statusCode >= 400) {
      logger.error('HTTP Request Error', logData);
    } else {
      logger.http('HTTP Request', logData);
    }
  });
  
  next();
};

// Add error logging function
const logError = (error, context = {}) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  };
  
  logger.error('Application Error', errorData);
};

// Add business logic logging
const logBusinessEvent = (event, data = {}) => {
  const logData = {
    event,
    data,
    timestamp: new Date().toISOString(),
  };
  
  logger.info('Business Event', logData);
};

// Add security event logging
const logSecurityEvent = (event, data = {}) => {
  const logData = {
    event,
    data,
    timestamp: new Date().toISOString(),
  };
  
  logger.warn('Security Event', logData);
};

// Add performance logging
const logPerformance = (operation, duration, data = {}) => {
  const logData = {
    operation,
    duration: `${duration}ms`,
    data,
    timestamp: new Date().toISOString(),
  };
  
  if (duration > 1000) {
    logger.warn('Slow Operation', logData);
  } else {
    logger.info('Performance Metric', logData);
  }
};

// Add database operation logging
const logDatabaseOperation = (operation, collection, duration, data = {}) => {
  const logData = {
    operation,
    collection,
    duration: `${duration}ms`,
    data,
    timestamp: new Date().toISOString(),
  };
  
  logger.info('Database Operation', logData);
};

// Add sensor data logging
const logSensorData = (sensorId, data) => {
  const logData = {
    sensorId,
    data,
    timestamp: new Date().toISOString(),
  };
  
  logger.info('Sensor Data', logData);
};

// Add collection request logging
const logCollectionRequest = (requestId, action, data = {}) => {
  const logData = {
    requestId,
    action,
    data,
    timestamp: new Date().toISOString(),
  };
  
  logger.info('Collection Request', logData);
};

// Add user action logging
const logUserAction = (userId, action, data = {}) => {
  const logData = {
    userId,
    action,
    data,
    timestamp: new Date().toISOString(),
  };
  
  logger.info('User Action', logData);
};

// Export logger and utility functions
module.exports = {
  logger,
  requestLogger,
  logError,
  logBusinessEvent,
  logSecurityEvent,
  logPerformance,
  logDatabaseOperation,
  logSensorData,
  logCollectionRequest,
  logUserAction,
};
