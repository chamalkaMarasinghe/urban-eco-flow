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
router.use(authenticateUser());

// Routes for all authenticated users (docs in src/docs/collectionRequestDocs.js)
router.get("/my-requests", getMyCollectionRequests);

// Get collection request by ID (docs: src/docs/collectionRequestDocs.js)
router.get("/:id", getCollectionRequestById);

// Create a new collection request (docs: src/docs/collectionRequestDocs.js)
router.post("/", createCollectionRequestValidator, validate, createCollectionRequest);

// Update collection request (docs: src/docs/collectionRequestDocs.js)
router.put("/:id", updateCollectionRequestValidator, validate, updateCollectionRequest);

// Cancel collection request (docs: src/docs/collectionRequestDocs.js)
router.post("/:id/cancel", cancelCollectionRequestValidator, validate, cancelCollectionRequest);

// Add attachment (docs: src/docs/collectionRequestDocs.js)
router.post("/:id/attachments", addAttachmentValidator, validate, addAttachment);

// Admin and staff routes
// Get all collection requests (docs: src/docs/collectionRequestDocs.js)
router.get("/", authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER]), getAllCollectionRequests);

// Get pending collection requests (docs: src/docs/collectionRequestDocs.js)
router.get("/pending", authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER]), getPendingCollectionRequests);

// Get scheduled collection requests for a date (docs: src/docs/collectionRequestDocs.js)
router.get("/scheduled/:date", authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER]), getScheduledCollectionRequests);

// Get urgent collection requests (docs: src/docs/collectionRequestDocs.js)
router.get("/urgent", authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER]), getUrgentCollectionRequests);

// Schedule collection request (docs: src/docs/collectionRequestDocs.js)
router.post("/:id/schedule", scheduleCollectionRequestValidator, validate, authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER]), scheduleCollectionRequest);

// Complete collection request (docs: src/docs/collectionRequestDocs.js)
router.post("/:id/complete", completeCollectionRequestValidator, validate, authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM]), completeCollectionRequest);

module.exports = router;
