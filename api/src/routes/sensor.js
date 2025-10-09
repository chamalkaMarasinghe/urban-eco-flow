const express = require("express");
const router = express.Router();
const { validate } = require("../utils/validations/validate");
const {
  getAllSensors,
  getSensorById,
  createSensor,
  updateSensor,
  installSensor,
  reportSensorFaulty,
  getMySensors,
  getFaultySensors,
  getSensorsDueForMaintenance,
  updateBatteryLevel,
  deleteSensor,
} = require("../controllers/sensor");
const {purchaseSensor, getPurchasedSensors} = require("../controllers/sensorPurchase");
const { authenticateUser } = require("../middlewares/authenticateUser");
const { authorizeRoles } = require("../middlewares/authorizeRoles");
const { roles } = require("../constants/commonConstants");

// Validation schemas for sensor operations
const createSensorValidator = [
  require("../validators/sensor").createSensorValidator,
];

const updateSensorValidator = [
  require("../validators/sensor").updateSensorValidator,
];

const installSensorValidator = [
  require("../validators/sensor").installSensorValidator,
];

const reportFaultyValidator = [
  require("../validators/sensor").reportFaultyValidator,
];

const updateBatteryValidator = [
  require("../validators/sensor").updateBatteryValidator,
];

// Public routes (with authentication)
router.use(authenticateUser());

// Routes for all authenticated users (docs moved to src/docs/sensorDocs.js)
router.get("/my-sensors", getMySensors);

//user get my sensors
router.get(
  "/purchased",
  authorizeRoles([roles.RESIDENT, roles.BUSINESS, roles.USER]),
  getPurchasedSensors
);

// Get sensor by ID (docs: src/docs/sensorDocs.js)
router.get("/:id", getSensorById);

// Create sensor (docs: src/docs/sensorDocs.js)
router.post("/", createSensorValidator, validate, createSensor);

// Update sensor (docs: src/docs/sensorDocs.js)
router.put("/:id", updateSensorValidator, validate, updateSensor);

// Install sensor to bin (docs: src/docs/sensorDocs.js)
router.post("/:id/install", installSensorValidator, validate, installSensor);

// Delete sensor (docs: src/docs/sensorDocs.js)
router.delete("/:id", deleteSensor);

// Admin and staff routes
// Get all sensors (docs: src/docs/sensorDocs.js)
router.get("/", authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER, roles.USER]), getAllSensors);

//user purchase sendsor
router.post(
  "/purchase",
  authorizeRoles([roles.RESIDENT, roles.BUSINESS, roles.USER]),
  purchaseSensor
);

module.exports = router;
