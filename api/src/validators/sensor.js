const { body, param, query } = require("express-validator");
const { sensorTypes, sensorStatus } = require("../constants/commonConstants");

/**
 * Validation rules for sensor operations
 */

exports.createSensorValidator = [
  body("serialNumber")
    .notEmpty()
    .withMessage("Serial number is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Serial number must be between 3 and 50 characters"),
  
  body("type")
    .optional()
    .isIn(Object.values(sensorTypes))
    .withMessage("Invalid sensor type"),
  
  body("manufacturer")
    .notEmpty()
    .withMessage("Manufacturer is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Manufacturer must be between 2 and 100 characters"),
  
  body("model")
    .notEmpty()
    .withMessage("Model is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Model must be between 2 and 100 characters"),
  
  body("purchasePrice")
    .notEmpty()
    .withMessage("Purchase price is required")
    .isFloat({ min: 0 })
    .withMessage("Purchase price must be a positive number"),
  
  body("location")
    .notEmpty()
    .withMessage("Location is required")
    .isObject()
    .withMessage("Location must be an object"),
  
  body("location.longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
  
  body("location.latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),
  
  body("location.address")
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Address must be between 5 and 200 characters"),
  
  body("binId")
    .optional()
    .isMongoId()
    .withMessage("Invalid bin ID"),
];

exports.updateSensorValidator = [
  param("id")
    .notEmpty()
    .withMessage("Sensor ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid sensor ID"),
  
  body("manufacturer")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Manufacturer must be between 2 and 100 characters"),
  
  body("model")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Model must be between 2 and 100 characters"),
  
  body("purchasePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Purchase price must be a positive number"),
  
  body("location")
    .optional()
    .isObject()
    .withMessage("Location must be an object"),
  
  body("location.longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
  
  body("location.latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),
  
  body("location.address")
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage("Address must be between 5 and 200 characters"),
];

exports.installSensorValidator = [
  param("id")
    .notEmpty()
    .withMessage("Sensor ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid sensor ID"),
  
  body("binId")
    .notEmpty()
    .withMessage("Bin ID is required")
    .isMongoId()
    .withMessage("Invalid bin ID"),
  
  body("installationDate")
    .optional()
    .isISO8601()
    .withMessage("Installation date must be a valid date"),
];

exports.reportFaultyValidator = [
  param("id")
    .notEmpty()
    .withMessage("Sensor ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid sensor ID"),
  
  body("reason")
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage("Reason must be between 5 and 200 characters"),
  
  body("description")
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),
];

exports.updateBatteryValidator = [
  param("id")
    .notEmpty()
    .withMessage("Sensor ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid sensor ID"),
  
  body("batteryLevel")
    .notEmpty()
    .withMessage("Battery level is required")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Battery level must be between 0 and 100"),
];

exports.getSensorByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("Sensor ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid sensor ID"),
];

exports.getAllSensorsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  
  query("status")
    .optional()
    .isIn(Object.values(sensorStatus))
    .withMessage("Invalid sensor status"),
  
  query("type")
    .optional()
    .isIn(Object.values(sensorTypes))
    .withMessage("Invalid sensor type"),
  
  query("owner")
    .optional()
    .isMongoId()
    .withMessage("Invalid owner ID"),
  
  query("location")
    .optional()
    .matches(/^-?\d+\.?\d*,-?\d+\.?\d*$/)
    .withMessage("Location must be in format 'longitude,latitude'"),
  
  query("radius")
    .optional()
    .isInt({ min: 1, max: 50000 })
    .withMessage("Radius must be between 1 and 50000 meters"),
];
