const express = require("express");
const router = express.Router();
const { validate } = require("../utils/validations/validate");
const {
  getAllCollectionRequests,
  getCollectionRequestById,
  createCollectionRequest,
  updateCollectionRequest,
  scheduleCollectionRequest,
  completeCollectionRequest,
  getMyCollectionRequests,
  getPendingCollectionRequests,
  getScheduledCollectionRequests,
  getUrgentCollectionRequests,
  cancelCollectionRequest,
  addAttachment,
} = require("../controllers/collectionRequest");
const { authenticateUser } = require("../middlewares/authenticateUser");
const { authorizeRoles } = require("../middlewares/authorizeRoles");
const { roles } = require("../constants/commonConstants");

// Validation schemas for collection request operations
const createCollectionRequestValidator = [
  require("../validators/collectionRequest").createCollectionRequestValidator,
];

const updateCollectionRequestValidator = [
  require("../validators/collectionRequest").updateCollectionRequestValidator,
];

const scheduleCollectionRequestValidator = [
  require("../validators/collectionRequest").scheduleCollectionRequestValidator,
];

const completeCollectionRequestValidator = [
  require("../validators/collectionRequest").completeCollectionRequestValidator,
];

const cancelCollectionRequestValidator = [
  require("../validators/collectionRequest").cancelCollectionRequestValidator,
];

const addAttachmentValidator = [
  require("../validators/collectionRequest").addAttachmentValidator,
];

// Public routes (with authentication)
router.use(authenticateUser);

// Routes for all authenticated users
/**
 * @swagger
 * /api/v1/collection-requests/my-requests:
 *   get:
 *     summary: Get current user's collection requests
 *     tags: [Collection Requests]
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
 *           enum: [PENDING, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, FAILED]
 *         description: Filter by request status
 *     responses:
 *       200:
 *         description: Collection requests retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/my-requests", getMyCollectionRequests);

/**
 * @swagger
 * /api/v1/collection-requests/{id}:
 *   get:
 *     summary: Get collection request by ID
 *     tags: [Collection Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection request ID
 *     responses:
 *       200:
 *         description: Collection request retrieved successfully
 *       404:
 *         description: Collection request not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", getCollectionRequestById);

/**
 * @swagger
 * /api/v1/collection-requests:
 *   post:
 *     summary: Create a new collection request
 *     tags: [Collection Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *               - wasteDetails
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [NORMAL, SPECIAL, BULKY_ITEMS, E_WASTE, HAZARDOUS, URGENT]
 *                 default: NORMAL
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *                 default: MEDIUM
 *               binId:
 *                 type: string
 *                 description: ID of the bin (optional)
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
 *               wasteDetails:
 *                 type: object
 *                 required:
 *                   - category
 *                 properties:
 *                   category:
 *                     type: string
 *                     enum: [ORGANIC, RECYCLABLE, GENERAL, HAZARDOUS, E_WASTE, BULKY]
 *                   description:
 *                     type: string
 *                   estimatedWeight:
 *                     type: number
 *                     minimum: 0
 *                   estimatedVolume:
 *                     type: number
 *                     minimum: 0
 *                   specialInstructions:
 *                     type: string
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *               scheduledTimeSlot:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                   end:
 *                     type: string
 *               specialInstructions:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     url:
 *                       type: string
 *     responses:
 *       201:
 *         description: Collection request created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bin not found
 */
router.post("/", createCollectionRequestValidator, validate, createCollectionRequest);

/**
 * @swagger
 * /api/v1/collection-requests/{id}:
 *   put:
 *     summary: Update collection request
 *     tags: [Collection Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [NORMAL, SPECIAL, BULKY_ITEMS, E_WASTE, HAZARDOUS, URGENT]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
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
 *               wasteDetails:
 *                 type: object
 *                 properties:
 *                   category:
 *                     type: string
 *                     enum: [ORGANIC, RECYCLABLE, GENERAL, HAZARDOUS, E_WASTE, BULKY]
 *                   description:
 *                     type: string
 *                   estimatedWeight:
 *                     type: number
 *                     minimum: 0
 *                   estimatedVolume:
 *                     type: number
 *                     minimum: 0
 *                   specialInstructions:
 *                     type: string
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *               scheduledTimeSlot:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                   end:
 *                     type: string
 *     responses:
 *       200:
 *         description: Collection request updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Collection request not found
 */
router.put("/:id", updateCollectionRequestValidator, validate, updateCollectionRequest);

/**
 * @swagger
 * /api/v1/collection-requests/{id}/cancel:
 *   post:
 *     summary: Cancel collection request
 *     tags: [Collection Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection request ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for cancellation
 *     responses:
 *       200:
 *         description: Collection request cancelled successfully
 *       400:
 *         description: Validation error or cannot cancel completed request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Collection request not found
 */
router.post("/:id/cancel", cancelCollectionRequestValidator, validate, cancelCollectionRequest);

/**
 * @swagger
 * /api/v1/collection-requests/{id}/attachments:
 *   post:
 *     summary: Add attachment to collection request
 *     tags: [Collection Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filename
 *               - url
 *             properties:
 *               filename:
 *                 type: string
 *                 description: Name of the attachment file
 *               url:
 *                 type: string
 *                 description: URL of the attachment file
 *     responses:
 *       200:
 *         description: Attachment added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Collection request not found
 */
router.post("/:id/attachments", addAttachmentValidator, validate, addAttachment);

// Admin and staff routes
/**
 * @swagger
 * /api/v1/collection-requests:
 *   get:
 *     summary: Get all collection requests (Admin/Staff only)
 *     tags: [Collection Requests]
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
 *           enum: [PENDING, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, FAILED]
 *         description: Filter by request status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [NORMAL, SPECIAL, BULKY_ITEMS, E_WASTE, HAZARDOUS, URGENT]
 *         description: Filter by request type
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *         description: Filter by priority level
 *       - in: query
 *         name: requester
 *         schema:
 *           type: string
 *         description: Filter by requester ID
 *       - in: query
 *         name: scheduledDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by scheduled date
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location coordinates (longitude,latitude)
 *       - in: query
 *         name: radius
 *         schema:
 *           type: integer
 *           default: 5000
 *         description: Search radius in meters
 *     responses:
 *       200:
 *         description: Collection requests retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
router.get("/", authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER]), getAllCollectionRequests);

/**
 * @swagger
 * /api/v1/collection-requests/pending:
 *   get:
 *     summary: Get pending collection requests (Admin/Staff only)
 *     tags: [Collection Requests]
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
 *         description: Pending collection requests retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
router.get("/pending", authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER]), getPendingCollectionRequests);

/**
 * @swagger
 * /api/v1/collection-requests/scheduled/{date}:
 *   get:
 *     summary: Get scheduled collection requests for a specific date (Admin/Staff only)
 *     tags: [Collection Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date to get scheduled requests for
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
 *         description: Scheduled collection requests retrieved successfully
 *       400:
 *         description: Invalid date parameter
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
router.get("/scheduled/:date", authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER]), getScheduledCollectionRequests);

/**
 * @swagger
 * /api/v1/collection-requests/urgent:
 *   get:
 *     summary: Get urgent collection requests (Admin/Staff only)
 *     tags: [Collection Requests]
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
 *         description: Urgent collection requests retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
router.get("/urgent", authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER]), getUrgentCollectionRequests);

/**
 * @swagger
 * /api/v1/collection-requests/{id}/schedule:
 *   post:
 *     summary: Schedule collection request (Admin/Staff only)
 *     tags: [Collection Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduledDate
 *             properties:
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *                 description: Date to schedule the collection
 *               timeSlot:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     description: Start time of the collection slot
 *                   end:
 *                     type: string
 *                     description: End time of the collection slot
 *               collectionTeamId:
 *                 type: string
 *                 description: ID of the collection team member to assign
 *     responses:
 *       200:
 *         description: Collection request scheduled successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Collection request or team member not found
 */
router.post("/:id/schedule", scheduleCollectionRequestValidator, validate, authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER]), scheduleCollectionRequest);

/**
 * @swagger
 * /api/v1/collection-requests/{id}/complete:
 *   post:
 *     summary: Complete collection request (Collection Team/Admin only)
 *     tags: [Collection Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actualWeight:
 *                 type: number
 *                 minimum: 0
 *                 description: Actual weight of collected waste
 *               actualVolume:
 *                 type: number
 *                 minimum: 0
 *                 description: Actual volume of collected waste
 *               notes:
 *                 type: string
 *                 description: Notes about the collection
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: URLs of collection images
 *     responses:
 *       200:
 *         description: Collection request completed successfully
 *       400:
 *         description: Validation error or request not in progress
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Collection request not found
 */
router.post("/:id/complete", completeCollectionRequestValidator, validate, authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM]), completeCollectionRequest);

module.exports = router;
