/**
 * Sensors API documentation
 */
module.exports = {
  "/sensors": {
    post: {
      summary: "Register a new sensor",
      tags: ["Sensors"],
      security: [{ bearerAuth: [] }],
      requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Sensor" } } } },
      responses: { "201": { description: "Sensor registered" }, "400": { description: "Validation error" } }
    },
    get: {
      summary: "Get all sensorss",
      tags: ["Sensors"],
      security: [{ bearerAuth: [] }],
      parameters: [ { name: "page", in: "query", schema: { type: "integer", default: 1 } }, { name: "limit", in: "query", schema: { type: "integer", default: 10 } } ],
      responses: { "200": { description: "Sensors retrieved" } }
    }
  },

  "/sensors/my-sensors": { get: { summary: "Get current user's sensors", tags: ["Sensors"], security: [{ bearerAuth: [] }], responses: { "200": { description: "User sensors" } } } },

  "/sensors/{id}": {
    get: { summary: "Get sensor by ID", tags: ["Sensors"], security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Sensor retrieved" }, "404": { description: "Sensor not found" } } },
    put: { summary: "Update sensor", tags: ["Sensors"], security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "200": { description: "Sensor updated" } } },
    delete: { summary: "Delete sensor", tags: ["Sensors"], security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Sensor deleted" } } }
  },

  "/sensors/{id}/install": { post: { summary: "Install sensor to a bin", tags: ["Sensors"], security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object", properties: { binId: { type: "string" }, installationDate: { type: "string", format: "date-time" } } } } } }, responses: { "200": { description: "Sensor installed" } } } },

//   "/sensors/{id}/report-faulty": { post: { summary: "Report sensor as faulty", tags: ["Sensors"], security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Sensor reported faulty" } } } },

//   "/sensors/{id}/battery": { put: { summary: "Update sensor battery level", tags: ["Sensors"], security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object", properties: { batteryLevel: { type: "number", minimum: 0, maximum: 100 } } } } } }, responses: { "200": { description: "Battery updated" } } } },

//   "/sensors/faulty": { get: { summary: "Get faulty sensors", tags: ["Sensors"], security: [{ bearerAuth: [] }], responses: { "200": { description: "Faulty sensors" } } } },

//   "/sensors/maintenance-due": { get: { summary: "Get sensors due for maintenance", tags: ["Sensors"], security: [{ bearerAuth: [] }], responses: { "200": { description: "Maintenance due sensors" } } } }
};
