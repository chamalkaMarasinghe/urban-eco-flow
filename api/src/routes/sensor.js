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
router.use(authenticateUser);

// Routes for all authenticated users
/**
 * @swagger
 * /api/v1/sensors/my-sensors:
 *   get:
 *     summary: Get current user's sensors
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, FAULTY, MAINTENANCE, RETIRED]
 *         description: Filter by sensor status
 *     responses:
 *       200:
 *         description: Sensors retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/my-sensors", getMySensors);

/**
 * @swagger
 * /api/v1/sensors/{id}:
 *   get:
 *     summary: Get sensor by ID
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sensor ID
 *     responses:
 *       200:
 *         description: Sensor retrieved successfully
 *       404:
 *         description: Sensor not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", getSensorById);

/**
 * @swagger
 * /api/v1/sensors:
 *   post:
 *     summary: Register a new sensor
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serialNumber
 *               - manufacturer
 *               - model
 *               - purchasePrice
 *               - location
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 description: Unique serial number of the sensor
 *               type:
 *                 type: string
 *                 enum: [FILL_LEVEL, WEIGHT, TEMPERATURE, MULTI_SENSOR]
 *                 default: FILL_LEVEL
 *               manufacturer:
 *                 type: string
 *                 description: Sensor manufacturer
 *               model:
 *                 type: string
 *                 description: Sensor model
 *               purchasePrice:
 *                 type: number
 *                 minimum: 0
 *                 description: Purchase price of the sensor
 *               location:
 *                 type: object
 *                 required:
 *                   - longitude
 *                   - latitude
 *                   - address
 *                 properties:
 *                   longitude:
 *                     type: number
 *                   latitude:
 *                     type: number
 *                   address:
 *                     type: string
 *               binId:
 *                 type: string
 *                 description: ID of the bin to attach the sensor to
 *     responses:
 *       201:
 *         description: Sensor registered successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Sensor with serial number already exists
 */
router.post("/", createSensorValidator, validate, createSensor);

/**
 * @swagger
 * /api/v1/sensors/{id}:
 *   put:
 *     summary: Update sensor information
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sensor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               manufacturer:
 *                 type: string
 *               model:
 *                 type: string
 *               purchasePrice:
 *                 type: number
 *                 minimum: 0
 *               location:
 *                 type: object
 *                 properties:
 *                   longitude:
 *                     type: number
 *                   latitude:
 *                     type: number
 *                   address:
 *                     type: string
 *     responses:
 *       200:
 *         description: Sensor updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Sensor not found
 */
router.put("/:id", updateSensorValidator, validate, updateSensor);

/**
 * @swagger
 * /api/v1/sensors/{id}/install:
 *   post:
 *     summary: Install sensor to a bin
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sensor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - binId
 *             properties:
 *               binId:
 *                 type: string
 *                 description: ID of the bin to install the sensor to
 *               installationDate:
 *                 type: string
 *                 format: date-time
 *                 description: Installation date (defaults to current date)
 *     responses:
 *       200:
 *         description: Sensor installed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Sensor or bin not found
 */
router.post("/:id/install", installSensorValidator, validate, installSensor);

/**
 * @swagger
 * /api/v1/sensors/{id}/report-faulty:
 *   post:
 *     summary: Report sensor as faulty
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sensor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for reporting as faulty
 *               description:
 *                 type: string
 *                 description: Detailed description of the issue
 *     responses:
 *       200:
 *         description: Sensor reported as faulty
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Sensor not found
 */
router.post("/:id/report-faulty", reportFaultyValidator, validate, reportSensorFaulty);

/**
 * @swagger
 * /api/v1/sensors/{id}/battery:
 *   put:
 *     summary: Update sensor battery level
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sensor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - batteryLevel
 *             properties:
 *               batteryLevel:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Battery level percentage
 *     responses:
 *       200:
 *         description: Battery level updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sensor not found
 */
router.put("/:id/battery", updateBatteryValidator, validate, updateBatteryLevel);

/**
 * @swagger
 * /api/v1/sensors/{id}:
 *   delete:
 *     summary: Delete sensor (soft delete)
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sensor ID
 *     responses:
 *       200:
 *         description: Sensor deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Sensor not found
 */
router.delete("/:id", deleteSensor);

// Admin and staff routes
/**
 * @swagger
 * /api/v1/sensors:
 *   get:
 *     summary: Get all sensors (Admin/Staff only)
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, FAULTY, MAINTENANCE, RETIRED]
 *         description: Filter by sensor status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [FILL_LEVEL, WEIGHT, TEMPERATURE, MULTI_SENSOR]
 *         description: Filter by sensor type
 *       - in: query
 *         name: owner
 *         schema:
 *           type: string
 *         description: Filter by owner ID
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location coordinates (longitude,latitude)
 *       - in: query
 *         name: radius
 *         schema:
 *           type: integer
 *           default: 1000
 *         description: Search radius in meters
 *     responses:
 *       200:
 *         description: Sensors retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
router.get("/", authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER]), getAllSensors);

/**
 * @swagger
 * /api/v1/sensors/faulty:
 *   get:
 *     summary: Get faulty sensors (Admin/Maintenance only)
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Faulty sensors retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
router.get("/faulty", authorizeRoles([roles.ADMIN, roles.MAINTENANCE_CREW]), getFaultySensors);

/**
 * @swagger
 * /api/v1/sensors/maintenance-due:
 *   get:
 *     summary: Get sensors due for maintenance (Admin/Maintenance only)
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Sensors due for maintenance retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
router.get("/maintenance-due", authorizeRoles([roles.ADMIN, roles.MAINTENANCE_CREW]), getSensorsDueForMaintenance);

module.exports = router;
