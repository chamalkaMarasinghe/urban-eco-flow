/**
 * Sensor Purchase API documentation
 */
module.exports = {
  "/sensors/purchase": {
    post: {
      summary: "Purchase a sensor",
      description: "Allows users to purchase a sensor.",
      tags: ["Sensors"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
            //   required: ["serialNumber", "type", "manufacturer", "model", "purchasePrice"],
              required: ["id"],
              properties: {
                id: { type: "string" },
                // type: { type: "string", enum: ["FILL_LEVEL", "WEIGHT", "TEMPERATURE", "MULTI_SENSOR"], example: "FILL_LEVEL" },
                // manufacturer: { type: "string", example: "EcoTech Solutions" },
                // model: { type: "string", example: "ET-100" },
                // purchasePrice: { type: "number", minimum: 0, example: 150.00 },
                // batteryLevel: { type: "number", minimum: 0, maximum: 100, example: 100 },
                // location: {
                //   type: "object",
                //   properties: {
                //     coordinates: { type: "array", items: { type: "number" }, minItems: 2, maxItems: 2, example: [-74.0059, 40.7128] },
                //     address: { type: "string", example: "123 Main St, New York, NY" }
                //   }
                // },
                // specifications: {
                //   type: "object",
                //   properties: {
                //     batteryLife: { type: "number", example: 24 },
                //     operatingTemperature: {
                //       type: "object",
                //       properties: {
                //         min: { type: "number", example: -20 },
                //         max: { type: "number", example: 60 }
                //       }
                //     },
                //     accuracy: { type: "number", example: 95 }
                //   }
                // }
              }
            }
          }
        }
      },
      responses: {
        "201": { description: "Sensor purchased successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
        "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden - Insufficient permissions" },
        "409": { description: "Conflict - Sensor with this serial number already exists" },
        "500": { description: "Internal server error" }
      }
    }
  },

  "/sensors/purchased": {
    get: {
      summary: "Get user's purchased sensors",
      description: "Retrieves all sensors purchased by the authenticated user",
      tags: ["Sensors"],
      security: [{ bearerAuth: [] }],
      responses: {
        "200": { description: "Purchased sensors retrieved successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden - Insufficient permissions" },
        "500": { description: "Internal server error" }
      }
    }
  }
};
