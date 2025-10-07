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

// Get sensor by ID (docs: src/docs/sensorDocs.js)
router.get("/:id", getSensorById);

// Create sensor (docs: src/docs/sensorDocs.js)
router.post("/", createSensorValidator, validate, createSensor);

// Update sensor (docs: src/docs/sensorDocs.js)
router.put("/:id", updateSensorValidator, validate, updateSensor);

// Install sensor to bin (docs: src/docs/sensorDocs.js)
router.post("/:id/install", installSensorValidator, validate, installSensor);

// Report sensor faulty (docs: src/docs/sensorDocs.js)
// router.post("/:id/report-faulty", reportFaultyValidator, validate, reportSensorFaulty);

// Update battery level (docs: src/docs/sensorDocs.js)
// router.put("/:id/battery", updateBatteryValidator, validate, updateBatteryLevel);

// Delete sensor (docs: src/docs/sensorDocs.js)
router.delete("/:id", deleteSensor);

// Admin and staff routes
// Get all sensors (docs: src/docs/sensorDocs.js)
router.get("/", authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER, roles.USER]), getAllSensors);

// Get faulty sensors (docs: src/docs/sensorDocs.js)
// router.get("/faulty", authorizeRoles([roles.ADMIN, roles.MAINTENANCE_CREW]), getFaultySensors);

// Get sensors due for maintenance (docs: src/docs/sensorDocs.js)
// router.get("/maintenance-due", authorizeRoles([roles.ADMIN, roles.MAINTENANCE_CREW]), getSensorsDueForMaintenance);

module.exports = router;
