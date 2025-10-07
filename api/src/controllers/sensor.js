const { catchAsync } = require("../utils/errors/catchAsync");
const handleResponse = require("../utils/response/response");
const sensorService = require("../services/sensorService");
const { logUserAction } = require("../utils/logging/logger");

/**
 * @desc    Get all sensors with pagination and filtering
 * @route   GET /api/v1/sensors
 * @access  Private (Admin, Collection Team, Operations Planner)
 */
exports.getAllSensors = catchAsync(async (req, res, next) => {
  const filters = req.query;
  const pagination = {
    page: req.query.page || 1,
    limit: req.query.limit || 10,
  };

  const sensors = await sensorService.getAllSensors(filters, pagination);
  
  logUserAction(req.user.id, 'get_all_sensors', { filters, pagination });

  return handleResponse(res, 200, "Sensors retrieved successfully", sensors);
});

/**
 * @desc    Get sensor by ID
 * @route   GET /api/v1/sensors/:id
 * @access  Private
 */
exports.getSensorById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const sensor = await sensorService.getSensorById(id);
  
  logUserAction(req.user.id, 'get_sensor_by_id', { sensorId: id });

  return handleResponse(res, 200, "Sensor retrieved successfully", sensor);
});

/**
 * @desc    Purchase/Register a new sensor
 * @route   POST /api/v1/sensors
 * @access  Private (Resident, Business)
 */
exports.createSensor = catchAsync(async (req, res, next) => {
  const sensorData = req.body;

  const sensor = await sensorService.createSensor(sensorData, req.user.id);
  
  logUserAction(req.user.id, 'create_sensor', { sensorId: sensor.id, serialNumber: sensor.serialNumber });

  return handleResponse(res, 201, "Sensor registered successfully", sensor);
});

/**
 * @desc    Update sensor information
 * @route   PUT /api/v1/sensors/:id
 * @access  Private (Owner, Admin)
 */
exports.updateSensor = catchAsync(async (req, res, next) => {  
  const { id } = req.params;
  const updateData = req.body;

  const sensor = await sensorService.updateSensor(id, updateData, req.user.id);
  
  logUserAction(req.user.id, 'update_sensor', { sensorId: id, updateData });

  return handleResponse(res, 200, "Sensor updated successfully", sensor);
});

/**
 * @desc    Install sensor to a bin
 * @route   POST /api/v1/sensors/:id/install
 * @access  Private (Owner, Admin, Collection Team)
 */
exports.installSensor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const installData = req.body;

  const sensor = await sensorService.installSensor(id, installData, req.user.id);
  
  logUserAction(req.user.id, 'install_sensor', { sensorId: id, binId: installData.binId });

  return handleResponse(res, 200, "Sensor installed successfully", sensor);
});

/**
 * @desc    Get sensors by owner
 * @route   GET /api/v1/sensors/my-sensors
 * @access  Private (Resident, Business)
 */
exports.getMySensors = catchAsync(async (req, res, next) => {
  const filters = req.query;
  const pagination = {
    page: req.query.page || 1,
    limit: req.query.limit || 10,
  };

  const sensors = await sensorService.getUserSensors(req.user.id, filters, pagination);
  
  logUserAction(req.user.id, 'get_my_sensors', { filters, pagination });

  return handleResponse(res, 200, "Your sensors retrieved successfully", sensors);
});

/**
 * @desc    Delete sensor (soft delete)
 * @route   DELETE /api/v1/sensors/:id
 * @access  Private (Owner, Admin)
 */
exports.deleteSensor = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await sensorService.deleteSensor(id, req.user.id);
  
  logUserAction(req.user.id, 'delete_sensor', { sensorId: id });

  return handleResponse(res, 200, "Sensor deleted successfully");
});
