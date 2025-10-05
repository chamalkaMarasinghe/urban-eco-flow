const { body, param, query } = require("express-validator");
const { 
  collectionRequestTypes, 
  collectionRequestStatus, 
  priorityLevels, 
  wasteCategories 
} = require("../constants/commonConstants");

/**
 * Validation rules for collection request operations
 */

exports.createCollectionRequestValidator = [
  body("type")
    .optional()
    .isIn(Object.values(collectionRequestTypes))
    .withMessage("Invalid collection request type"),
  
  body("priority")
    .optional()
    .isIn(Object.values(priorityLevels))
    .withMessage("Invalid priority level"),
  
  body("binId")
    .optional()
    .isMongoId()
    .withMessage("Invalid bin ID"),
  
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
  
  body("wasteDetails")
    .notEmpty()
    .withMessage("Waste details are required")
    .isObject()
    .withMessage("Waste details must be an object"),
  
  body("wasteDetails.category")
    .notEmpty()
    .withMessage("Waste category is required")
    .isIn(Object.values(wasteCategories))
    .withMessage("Invalid waste category"),
  
  body("wasteDetails.description")
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage("Description must be between 5 and 500 characters"),
  
  body("wasteDetails.estimatedWeight")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Estimated weight must be a positive number"),
  
  body("wasteDetails.estimatedVolume")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Estimated volume must be a positive number"),
  
  body("wasteDetails.specialInstructions")
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage("Special instructions must be between 5 and 500 characters"),
  
  body("scheduledDate")
    .optional()
    .isISO8601()
    .withMessage("Scheduled date must be a valid date"),
  
  body("scheduledTimeSlot")
    .optional()
    .isObject()
    .withMessage("Scheduled time slot must be an object"),
  
  body("scheduledTimeSlot.start")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Start time must be in HH:MM format"),
  
  body("scheduledTimeSlot.end")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("End time must be in HH:MM format"),
  
  body("specialInstructions")
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage("Special instructions must be between 5 and 500 characters"),
  
  body("attachments")
    .optional()
    .isArray()
    .withMessage("Attachments must be an array"),
  
  body("attachments.*.filename")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Attachment filename must be between 1 and 100 characters"),
  
  body("attachments.*.url")
    .optional()
    .isURL()
    .withMessage("Attachment URL must be a valid URL"),
];

exports.updateCollectionRequestValidator = [
  param("id")
    .notEmpty()
    .withMessage("Collection request ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid collection request ID"),
  
  body("type")
    .optional()
    .isIn(Object.values(collectionRequestTypes))
    .withMessage("Invalid collection request type"),
  
  body("priority")
    .optional()
    .isIn(Object.values(priorityLevels))
    .withMessage("Invalid priority level"),
  
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
  
  body("wasteDetails")
    .optional()
    .isObject()
    .withMessage("Waste details must be an object"),
  
  body("wasteDetails.category")
    .optional()
    .isIn(Object.values(wasteCategories))
    .withMessage("Invalid waste category"),
  
  body("wasteDetails.description")
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage("Description must be between 5 and 500 characters"),
  
  body("wasteDetails.estimatedWeight")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Estimated weight must be a positive number"),
  
  body("wasteDetails.estimatedVolume")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Estimated volume must be a positive number"),
  
  body("wasteDetails.specialInstructions")
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage("Special instructions must be between 5 and 500 characters"),
  
  body("scheduledDate")
    .optional()
    .isISO8601()
    .withMessage("Scheduled date must be a valid date"),
  
  body("scheduledTimeSlot")
    .optional()
    .isObject()
    .withMessage("Scheduled time slot must be an object"),
  
  body("scheduledTimeSlot.start")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Start time must be in HH:MM format"),
  
  body("scheduledTimeSlot.end")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("End time must be in HH:MM format"),
];

exports.scheduleCollectionRequestValidator = [
  param("id")
    .notEmpty()
    .withMessage("Collection request ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid collection request ID"),
  
  body("scheduledDate")
    .notEmpty()
    .withMessage("Scheduled date is required")
    .isISO8601()
    .withMessage("Scheduled date must be a valid date"),
  
  body("timeSlot")
    .optional()
    .isObject()
    .withMessage("Time slot must be an object"),
  
  body("timeSlot.start")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Start time must be in HH:MM format"),
  
  body("timeSlot.end")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("End time must be in HH:MM format"),
  
  body("collectionTeamId")
    .optional()
    .isMongoId()
    .withMessage("Invalid collection team member ID"),
];

exports.completeCollectionRequestValidator = [
  param("id")
    .notEmpty()
    .withMessage("Collection request ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid collection request ID"),
  
  body("actualWeight")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Actual weight must be a positive number"),
  
  body("actualVolume")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Actual volume must be a positive number"),
  
  body("notes")
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage("Notes must be between 5 and 500 characters"),
  
  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array"),
  
  body("images.*")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
];

exports.cancelCollectionRequestValidator = [
  param("id")
    .notEmpty()
    .withMessage("Collection request ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid collection request ID"),
  
  body("reason")
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage("Reason must be between 5 and 200 characters"),
];

exports.addAttachmentValidator = [
  param("id")
    .notEmpty()
    .withMessage("Collection request ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid collection request ID"),
  
  body("filename")
    .notEmpty()
    .withMessage("Filename is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Filename must be between 1 and 100 characters"),
  
  body("url")
    .notEmpty()
    .withMessage("URL is required")
    .isURL()
    .withMessage("URL must be a valid URL"),
];

exports.getCollectionRequestByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("Collection request ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid collection request ID"),
];

exports.getAllCollectionRequestsValidator = [
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
    .isIn(Object.values(collectionRequestStatus))
    .withMessage("Invalid collection request status"),
  
  query("type")
    .optional()
    .isIn(Object.values(collectionRequestTypes))
    .withMessage("Invalid collection request type"),
  
  query("priority")
    .optional()
    .isIn(Object.values(priorityLevels))
    .withMessage("Invalid priority level"),
  
  query("requester")
    .optional()
    .isMongoId()
    .withMessage("Invalid requester ID"),
  
  query("scheduledDate")
    .optional()
    .isISO8601()
    .withMessage("Scheduled date must be a valid date"),
  
  query("location")
    .optional()
    .matches(/^-?\d+\.?\d*,-?\d+\.?\d*$/)
    .withMessage("Location must be in format 'longitude,latitude'"),
  
  query("radius")
    .optional()
    .isInt({ min: 1, max: 50000 })
    .withMessage("Radius must be between 1 and 50000 meters"),
];
