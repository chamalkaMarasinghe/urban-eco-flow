const express = require("express");
const router = express.Router();
const { validate } = require("../utils/validations/validate");
const {
  getAllBins,
  getBinById,
  createBin,
  updateBin,
  attachSensor,
  detachSensor,
  updateFillLevel,
  addCollectionRecord,
  getMyBins,
  getFullBins,
  getBinsByCategory,
  getBinsNearLocation,
  deleteBin,
} = require("../controllers/bin");
const { authenticateUser } = require("../middlewares/authenticateUser");
const { authorizeRoles } = require("../middlewares/authorizeRoles");
const { roles } = require("../constants/commonConstants");

// Validation schemas for bin operations
const createBinValidator = [
  require("../validators/bin").createBinValidator,
];

const updateBinValidator = [
  require("../validators/bin").updateBinValidator,
];

const attachSensorValidator = [
  require("../validators/bin").attachSensorValidator,
];

const updateFillLevelValidator = [
  require("../validators/bin").updateFillLevelValidator,
];

const addCollectionRecordValidator = [
  require("../validators/bin").addCollectionRecordValidator,
];

// Public routes (with authentication)
router.use(authenticateUser);

// Routes for all authenticated users
/**
 * @swagger
 * /api/v1/bins/my-bins:
 *   get:
 *     summary: Get current user's bins
 *     tags: [Bins]
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
 *         name: category
 *         schema:
 *           type: string
 *           enum: [ORGANIC, RECYCLABLE, GENERAL, HAZARDOUS, E_WASTE, BULKY]
 *         description: Filter by waste category
 *     responses:
 *       200:
 *         description: Bins retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/my-bins", getMyBins);

/**
 * @swagger
 * /api/v1/bins/{id}:
 *   get:
 *     summary: Get bin by ID
 *     tags: [Bins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bin ID
 *     responses:
 *       200:
 *         description: Bin retrieved successfully
 *       404:
 *         description: Bin not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", getBinById);

/**
 * @swagger
 * /api/v1/bins:
 *   post:
 *     summary: Register a new bin
 *     tags: [Bins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - binNumber
 *               - capacity
 *               - material
 *               - color
 *               - location
 *             properties:
 *               binNumber:
 *                 type: string
 *                 description: Unique bin number
 *               capacity:
 *                 type: number
 *                 minimum: 0
 *                 description: Bin capacity in liters
 *               category:
 *                 type: string
 *                 enum: [ORGANIC, RECYCLABLE, GENERAL, HAZARDOUS, E_WASTE, BULKY]
 *                 default: GENERAL
 *               material:
 *                 type: string
 *                 enum: [plastic, metal, concrete, wood]
 *               color:
 *                 type: string
 *                 description: Bin color
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
 *                   landmark:
 *                     type: string
 *               sensorId:
 *                 type: string
 *                 description: ID of the sensor to attach (optional)
 *     responses:
 *       201:
 *         description: Bin registered successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Bin with this number already exists
 */
router.post("/", createBinValidator, validate, createBin);

/**
 * @swagger
 * /api/v1/bins/{id}:
 *   put:
 *     summary: Update bin information
 *     tags: [Bins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               capacity:
 *                 type: number
 *                 minimum: 0
 *               category:
 *                 type: string
 *                 enum: [ORGANIC, RECYCLABLE, GENERAL, HAZARDOUS, E_WASTE, BULKY]
 *               material:
 *                 type: string
 *                 enum: [plastic, metal, concrete, wood]
 *               color:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   longitude:
 *                     type: number
 *                   latitude:
 *                     type: number
 *                   address:
 *                     type: string
 *                   landmark:
 *                     type: string
 *     responses:
 *       200:
 *         description: Bin updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Bin not found
 */
router.put("/:id", updateBinValidator, validate, updateBin);

/**
 * @swagger
 * /api/v1/bins/{id}/attach-sensor:
 *   post:
 *     summary: Attach sensor to bin
 *     tags: [Bins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sensorId
 *             properties:
 *               sensorId:
 *                 type: string
 *                 description: ID of the sensor to attach
 *     responses:
 *       200:
 *         description: Sensor attached successfully
 *       400:
 *         description: Validation error or sensor already attached to another bin
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Bin or sensor not found
 */
router.post("/:id/attach-sensor", attachSensorValidator, validate, attachSensor);

/**
 * @swagger
 * /api/v1/bins/{id}/detach-sensor:
 *   post:
 *     summary: Detach sensor from bin
 *     tags: [Bins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bin ID
 *     responses:
 *       200:
 *         description: Sensor detached successfully
 *       400:
 *         description: No sensor attached to this bin
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Bin not found
 */
router.post("/:id/detach-sensor", detachSensor);

/**
 * @swagger
 * /api/v1/bins/{id}:
 *   delete:
 *     summary: Delete bin (soft delete)
 *     tags: [Bins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bin ID
 *     responses:
 *       200:
 *         description: Bin deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Bin not found
 */
router.delete("/:id", deleteBin);

// Admin and staff routes
/**
 * @swagger
 * /api/v1/bins:
 *   get:
 *     summary: Get all bins (Admin/Staff only)
 *     tags: [Bins]
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
 *         name: category
 *         schema:
 *           type: string
 *           enum: [ORGANIC, RECYCLABLE, GENERAL, HAZARDOUS, E_WASTE, BULKY]
 *         description: Filter by waste category
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
 *       - in: query
 *         name: hasSensor
 *         schema:
 *           type: boolean
 *         description: Filter by whether bin has sensor attached
 *     responses:
 *       200:
 *         description: Bins retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
router.get("/", authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER]), getAllBins);

/**
 * @swagger
 * /api/v1/bins/full:
 *   get:
 *     summary: Get full bins (above threshold) (Admin/Staff only)
 *     tags: [Bins]
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
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 80
 *         description: Fill level threshold percentage
 *     responses:
 *       200:
 *         description: Full bins retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
router.get("/full", authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER]), getFullBins);

/**
 * @swagger
 * /api/v1/bins/category/{category}:
 *   get:
 *     summary: Get bins by category (Admin/Staff only)
 *     tags: [Bins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ORGANIC, RECYCLABLE, GENERAL, HAZARDOUS, E_WASTE, BULKY]
 *         description: Waste category
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
 *         description: Bins in category retrieved successfully
 *       400:
 *         description: Invalid waste category
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
router.get("/category/:category", authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER]), getBinsByCategory);

/**
 * @swagger
 * /api/v1/bins/near:
 *   get:
 *     summary: Get bins near location (Admin/Staff only)
 *     tags: [Bins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude coordinate
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude coordinate
 *       - in: query
 *         name: radius
 *         schema:
 *           type: integer
 *           default: 1000
 *         description: Search radius in meters
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
 *         description: Nearby bins retrieved successfully
 *       400:
 *         description: Longitude and latitude are required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
router.get("/near", authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER]), getBinsNearLocation);

/**
 * @swagger
 * /api/v1/bins/{id}/fill-level:
 *   put:
 *     summary: Update bin fill level (Collection Team/Admin only)
 *     tags: [Bins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fillLevel:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Fill level percentage
 *               weight:
 *                 type: number
 *                 minimum: 0
 *                 description: Current weight of waste in bin
 *     responses:
 *       200:
 *         description: Bin fill level updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Bin not found
 */
router.put("/:id/fill-level", updateFillLevelValidator, validate, authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM]), updateFillLevel);

/**
 * @swagger
 * /api/v1/bins/{id}/collection-record:
 *   post:
 *     summary: Add collection record to bin (Collection Team/Admin only)
 *     tags: [Bins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weight:
 *                 type: number
 *                 minimum: 0
 *                 description: Weight of collected waste
 *               fillLevel:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Fill level before collection
 *     responses:
 *       200:
 *         description: Collection record added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Bin not found
 */
router.post("/:id/collection-record", addCollectionRecordValidator, validate, authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM]), addCollectionRecord);

module.exports = router;
