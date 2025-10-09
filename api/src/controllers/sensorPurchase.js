const { catchAsync } = require("../utils/errors/catchAsync");
const handleResponse = require("../utils/response/response");
const sensorPurchaseService = require("../services/sensorPurchaseService");
const { logUserAction } = require("../utils/logging/logger");

/**
 * @desc    Purchase a sensor (auto-purchase without payment)
 * @route   POST /api/v1/sensors/purchase
 * @access  Private (Resident, Business)
 */
exports.purchaseSensor = catchAsync(async (req, res, next) => {
  const sensorData = req.body;
  const userId = req.user.id;

  const sensor = await sensorPurchaseService.purchaseSensor(sensorData, userId);

  logUserAction(userId, 'purchase_sensor', { 
    sensorId: sensor.id, 
    serialNumber: sensor.serialNumber 
  });

  return handleResponse(res, 201, "Sensor purchased successfully", sensor);
});

/**
 * @desc    Get user's purchased sensors
 * @route   GET /api/v1/sensors/purchased
 * @access  Private (Resident, Business)
 */
exports.getPurchasedSensors = catchAsync(async (req, res, next) => {
  const userId = req.user.id;  

  const sensors = await sensorPurchaseService.getPurchasedSensors(userId);

  logUserAction(userId, 'get_purchased_sensors', { 
    count: sensors.length 
  });

  return handleResponse(res, 200, "Purchased sensors retrieved successfully", sensors);
});
