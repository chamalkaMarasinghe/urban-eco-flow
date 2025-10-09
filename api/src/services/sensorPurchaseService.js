const Sensor = require('../models/sensor');
const User = require('../models/user');
const { RecordNotFoundError, BadRequestError, ActionNotAllowedError, CustomError } = require('../utils/errors/CustomErrors');

/**
 * Sensor Purchase Service - Business logic for sensor purchase operations
 */
class SensorPurchaseService {
  /**
   * Purchase a sensor for a user (auto-purchase without payment)
   * @param {Object} sensorData - Sensor data to purchase
   * @param {string} userId - User ID who is purchasing
   * @returns {Promise<Object>} Purchased sensor
   */
  async purchaseSensor(sensorData, userId) {
    try {
      // Validate user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new RecordNotFoundError('User');
      }

      // // Create the sensor
      // const sensor = await Sensor.create({
      //   ...sensorData,
      //   owner: userId,
      //   status: 'INACTIVE', // Newly purchased sensors start as inactive
      // });
      const sensor = await Sensor.findById(sensorData?.id);

      if(!sensor){
        throw new RecordNotFoundError('Sensor');
      }

      if(user?.purchasedSensors?.includes(sensor?._id)){
        throw new CustomError("Already Purchased");
      }

      // Add sensor to user's purchased sensors array
      if(user?.purchasedSensors){
        user.purchasedSensors.push(sensor._id);
      }else{
        user.purchasedSensors = [sensor._id];
      }

      await user.save();

      return sensor;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all purchased sensors for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of purchased sensors
   */
  async getPurchasedSensors(userId) {
    try {
      // Validate user exists
      const user = await User.findById(userId).populate('purchasedSensors');

      if (!user) {
        throw new RecordNotFoundError('User');
      }

      // Return the populated sensors array
      return user?.purchasedSensors;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if user owns a specific sensor
   * @param {string} sensorId - Sensor ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} True if user owns the sensor
   */
  async isSensorOwnedByUser(sensorId, userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return false;
      }

      return user.purchasedSensors.includes(sensorId);
    } catch (error) {
      return false;
    }
  }
}

module.exports = new SensorPurchaseService();
