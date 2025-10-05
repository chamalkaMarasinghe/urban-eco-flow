const { body, param, query } = require("express-validator");
const { wasteCategories } = require("../constants/commonConstants");

/**
 * Validation rules for bin operations
 */

exports.createBinValidator = [
  body("binNumber")
    .notEmpty()
    .withMessage("Bin number is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Bin number must be between 3 and 50 characters"),
  
  body("capacity")
    .notEmpty()
    .withMessage("Capacity is required")
    .isFloat({ min: 0 })
    .withMessage("Capacity must be a positive number"),
  
  body("category")
    .optional()
    .isIn(Object.values(wasteCategories))
    .withMessage("Invalid waste category"),
  
  body("material")
    .notEmpty()
    .withMessage("Material is required")
    .isIn(["plastic", "metal", "concrete", "wood"])
    .withMessage("Material must be one of: plastic, metal, concrete, wood"),
  
  body("color")
    .notEmpty()
    .withMessage("Color is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Color must be between 2 and 50 characters"),
  
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
  
  body("location.landmark")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Landmark must be between 2 and 100 characters"),
  
  body("sensorId")
    .optional()
    .isMongoId()
    .withMessage("Invalid sensor ID"),
];

exports.updateBinValidator = [
  param("id")
    .notEmpty()
    .withMessage("Bin ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid bin ID"),
  
  body("capacity")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Capacity must be a positive number"),
  
  body("category")
    .optional()
    .isIn(Object.values(wasteCategories))
    .withMessage("Invalid waste category"),
  
  body("material")
    .optional()
    .isIn(["plastic", "metal", "concrete", "wood"])
    .withMessage("Material must be one of: plastic, metal, concrete, wood"),
  
  body("color")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Color must be between 2 and 50 characters"),
  
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
  
  body("location.landmark")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Landmark must be between 2 and 100 characters"),
];

exports.attachSensorValidator = [
  param("id")
    .notEmpty()
    .withMessage("Bin ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid bin ID"),
  
  body("sensorId")
    .notEmpty()
    .withMessage("Sensor ID is required")
    .isMongoId()
    .withMessage("Invalid sensor ID"),
];

exports.updateFillLevelValidator = [
  param("id")
    .notEmpty()
    .withMessage("Bin ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid bin ID"),
  
  body("fillLevel")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Fill level must be between 0 and 100"),
  
  body("weight")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Weight must be a positive number"),
];

exports.addCollectionRecordValidator = [
  param("id")
    .notEmpty()
    .withMessage("Bin ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid bin ID"),
  
  body("weight")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Weight must be a positive number"),
  
  body("fillLevel")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Fill level must be between 0 and 100"),
];

exports.getBinByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("Bin ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid bin ID"),
];

exports.getAllBinsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  
  query("category")
    .optional()
    .isIn(Object.values(wasteCategories))
    .withMessage("Invalid waste category"),
  
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
  
  query("hasSensor")
    .optional()
    .isBoolean()
    .withMessage("hasSensor must be a boolean"),
];

exports.getFullBinsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  
  query("threshold")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Threshold must be between 0 and 100"),
];

exports.getBinsByCategoryValidator = [
  param("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(Object.values(wasteCategories))
    .withMessage("Invalid waste category"),
  
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

exports.getBinsNearLocationValidator = [
  query("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
  
  query("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),
  
  query("radius")
    .optional()
    .isInt({ min: 1, max: 50000 })
    .withMessage("Radius must be between 1 and 50000 meters"),
  
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];
