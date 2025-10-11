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
  .isIn(Object.values(wasteCategories))
  .withMessage("Invalid collection request type")
  .optional({ nullable: true, checkFalsy: true }),
  
  body("priority")
  .isIn(Object.values(priorityLevels))
  .withMessage("Invalid priority level")
  .optional({ nullable: true, checkFalsy: true }),
  
  body("bin")
  .isMongoId()
  .withMessage("Invalid bin ID")
  .optional({ nullable: true, checkFalsy: true }),
  
  body("location")
    .notEmpty()
    .withMessage("Location is required")
    .isObject()
    .withMessage("Location must be an object")
    .optional({ nullable: true, checkFalsy: true }),

  
  body("location.longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180")
    .optional({ nullable: true, checkFalsy: true }),

  
  body("location.latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90")
    .optional({ nullable: true, checkFalsy: true }),

  
  body("location.address")
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Address must be between 5 and 200 characters")
    .optional({ nullable: true, checkFalsy: true }),

  
  body("location.landmark")
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ min: 2, max: 100 })
    .withMessage("Landmark must be between 2 and 100 characters")
    .optional({ nullable: true, checkFalsy: true }),

  
  body("wasteDetails")
    .notEmpty()
    .withMessage("Waste details are required")
    .isObject()
    .withMessage("Waste details must be an object")
    .optional({ nullable: true, checkFalsy: true }),

  
  body("wasteDetails.category")
    .notEmpty()
    .withMessage("Waste category is required")
    .isIn(Object.values(wasteCategories))
    .withMessage("Invalid waste category")
    .optional({ nullable: true, checkFalsy: true }),

  
  body("wasteDetails.description")
  .isLength({ min: 5, max: 500 })
  .withMessage("Description must be between 5 and 500 characters")
  .optional({ nullable: true, checkFalsy: true }),
  
  body("wasteDetails.estimatedWeight")
  .isFloat({ min: 0 })
  .withMessage("Estimated weight must be a positive number")
  .optional({ nullable: true, checkFalsy: true }),
  
  body("wasteDetails.estimatedVolume")
  .isFloat({ min: 0 })
  .withMessage("Estimated volume must be a positive number")
  .optional({ nullable: true, checkFalsy: true }),
  
  body("wasteDetails.specialInstructions")
  .isLength({ min: 5, max: 500 })
  .withMessage("Special instructions must be between 5 and 500 characters")
  .optional({ nullable: true, checkFalsy: true }),
  
  body("scheduledDate")
  .isISO8601()
  .withMessage("Scheduled date must be a valid date")
  .optional({ nullable: true, checkFalsy: true }),
  
  body("scheduledTimeSlot")
  .isObject()
  .withMessage("Scheduled time slot must be an object")
  .optional({ nullable: true, checkFalsy: true }),
  
  body("scheduledTimeSlot.start")
  .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  .withMessage("Start time must be in HH:MM format")
  .optional({ nullable: true, checkFalsy: true }),
  
  body("scheduledTimeSlot.end")
  .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  .withMessage("End time must be in HH:MM format")
  .optional({ nullable: true, checkFalsy: true }),
  
  body("specialInstructions")
  .isLength({ min: 5, max: 500 })
  .withMessage("Special instructions must be between 5 and 500 characters")
  .optional({ nullable: true, checkFalsy: true }),
  
  body("attachments")
  .isArray()
  .withMessage("Attachments must be an array")
  .optional({ nullable: true, checkFalsy: true }),
  
  body("attachments.*.filename")
  .isLength({ min: 1, max: 100 })
  .withMessage("Attachment filename must be between 1 and 100 characters")
  .optional({ nullable: true, checkFalsy: true }),
  
  body("attachments.*.url")
  .isURL()
  .withMessage("Attachment URL must be a valid URL")
  .optional({ nullable: true, checkFalsy: true }),
];

exports.updateCollectionRequestValidator = [
  param("id")
    .notEmpty()
    .withMessage("Collection request ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid collection request ID"),
  
  body("type")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(Object.values(collectionRequestTypes))
    .withMessage("Invalid collection request type"),
  
  body("priority")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(Object.values(priorityLevels))
    .withMessage("Invalid priority level"),
  
  body("location")
    .optional({ nullable: true, checkFalsy: true })
    .isObject()
    .withMessage("Location must be an object"),
  
  body("location.longitude")
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
  
  body("location.latitude")
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),
  
  body("location.address")
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ min: 5, max: 200 })
    .withMessage("Address must be between 5 and 200 characters"),
  
  body("location.landmark")
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ min: 2, max: 100 })
    .withMessage("Landmark must be between 2 and 100 characters"),
  
  body("wasteDetails")
    .optional({ nullable: true, checkFalsy: true })
    .isObject()
    .withMessage("Waste details must be an object"),
  
  body("wasteDetails.category")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(Object.values(wasteCategories))
    .withMessage("Invalid waste category"),
  
  body("wasteDetails.description")
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ min: 5, max: 500 })
    .withMessage("Description must be between 5 and 500 characters"),
  
  body("wasteDetails.estimatedWeight")
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Estimated weight must be a positive number"),
  
  body("wasteDetails.estimatedVolume")
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Estimated volume must be a positive number"),
  
  body("wasteDetails.specialInstructions")
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ min: 5, max: 500 })
    .withMessage("Special instructions must be between 5 and 500 characters"),
  
  body("scheduledDate")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage("Scheduled date must be a valid date"),
  
  body("scheduledTimeSlot")
    .optional({ nullable: true, checkFalsy: true })
    .isObject()
    .withMessage("Scheduled time slot must be an object"),
  
  body("scheduledTimeSlot.start")
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Start time must be in HH:MM format"),
  
  body("scheduledTimeSlot.end")
    .optional({ nullable: true, checkFalsy: true })
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
    .optional({ nullable: true, checkFalsy: true })
    .isObject()
    .withMessage("Time slot must be an object"),
  
  body("timeSlot.start")
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Start time must be in HH:MM format"),
  
  body("timeSlot.end")
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("End time must be in HH:MM format"),
  
  body("collectionTeamId")
    .optional({ nullable: true, checkFalsy: true })
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
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Actual weight must be a positive number"),
  
  body("actualVolume")
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Actual volume must be a positive number"),
  
  body("notes")
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ min: 5, max: 500 })
    .withMessage("Notes must be between 5 and 500 characters"),
  
  body("images")
    .optional({ nullable: true, checkFalsy: true })
    .isArray()
    .withMessage("Images must be an array"),
  
  body("images.*")
    .optional({ nullable: true, checkFalsy: true })
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
    .optional({ nullable: true, checkFalsy: true })
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
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  
  query("limit")
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  
  query("status")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(Object.values(collectionRequestStatus))
    .withMessage("Invalid collection request status"),
  
  query("type")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(Object.values(collectionRequestTypes))
    .withMessage("Invalid collection request type"),
  
  query("priority")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(Object.values(priorityLevels))
    .withMessage("Invalid priority level"),
  
  query("requester")
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage("Invalid requester ID"),
  
  query("scheduledDate")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage("Scheduled date must be a valid date"),
  
  query("location")
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^-?\d+\.?\d*,-?\d+\.?\d*$/)
    .withMessage("Location must be in format 'longitude,latitude'"),
  
  query("radius")
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1, max: 50000 })
    .withMessage("Radius must be between 1 and 50000 meters"),
];
