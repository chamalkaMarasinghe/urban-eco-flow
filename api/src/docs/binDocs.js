/**
 * Bins API documentation extracted from route files
 * Paths are relative to the mounted API root (e.g. /api/v1)
 */
module.exports = {
  "/bins": {
    post: {
      summary: "Register a new bin",
      tags: ["Bins"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["binNumber", "capacity", "material", "color", "location"],
              properties: {
                binNumber: { type: "string" },
                capacity: { type: "number", minimum: 0 },
                category: { type: "string", example: "GENERAL" },
                material: { type: "string", example: "plastic" },
                color: { type: "string", example: "blue" },
                location: { $ref: "#/components/schemas/Bin" },
                sensorId: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        "201": { description: "Bin registered successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
        "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        "401": { description: "Unauthorized" },
        "409": { description: "Bin with this number already exists" }
      }
    },
    get: {
      summary: "Get all bins (Admin/Staff)",
      tags: ["Bins"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        { name: "category", in: "query", schema: { type: "string" } },
        { name: "owner", in: "query", schema: { type: "string" } }
      ],
      responses: { "200": { description: "Bins retrieved", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } } }
    }
  },

  "/bins/my-bins": {
    get: {
      summary: "Get current user's bins",
      tags: ["Bins"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        { name: "category", in: "query", schema: { type: "string" } }
      ],
      responses: { "200": { description: "Your bins retrieved", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } } }
    }
  },

  "/bins/{id}": {
    get: {
      summary: "Get bin by ID",
      tags: ["Bins"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: { "200": { description: "Bin retrieved", content: { "application/json": { schema: { $ref: "#/components/schemas/Bin" } } } }, "404": { description: "Bin not found" } }
    },
    put: {
      summary: "Update bin",
      tags: ["Bins"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
      responses: { "200": { description: "Bin updated" }, "403": { description: "Permission denied" }, "404": { description: "Bin not found" } }
    },
    delete: {
      summary: "Delete bin (soft)",
      tags: ["Bins"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: { "200": { description: "Bin deleted" }, "403": { description: "Permission denied" }, "404": { description: "Bin not found" } }
    }
  },

  "/bins/{id}/attach-sensor": {
    post: {
      summary: "Attach sensor to bin",
      tags: ["Bins"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { sensorId: { type: "string" } } } } } },
      responses: { "200": { description: "Sensor attached" }, "400": { description: "Validation or already attached" }, "404": { description: "Bin or sensor not found" } }
    }
  },

  "/bins/{id}/detach-sensor": {
    post: {
      summary: "Detach sensor from bin",
      tags: ["Bins"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: { "200": { description: "Sensor detached" }, "400": { description: "No sensor attached" }, "404": { description: "Bin not found" } }
    }
  },

//   "/bins/{id}/fill-level": {
//     put: {
//       summary: "Update bin fill level",
//       tags: ["Bins"],
//       security: [{ bearerAuth: [] }],
//       parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
//       requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { fillLevel: { type: "number" }, weight: { type: "number" } } } } } },
//       responses: { "200": { description: "Fill level updated" }, "400": { description: "Validation error" }, "404": { description: "Bin not found" } }
//     }
//   },

  "/bins/{id}/collection-record": {
    post: {
      summary: "Add collection record to bin",
      tags: ["Bins"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { weight: { type: "number", minimum: 0 }, fillLevel: { type: "number", minimum: 0, maximum: 100 } } } } } },
      responses: { "200": { description: "Collection record added", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } }, "400": { description: "Validation error" }, "404": { description: "Bin not found" } }
    }
  },

//   "/bins/full": {
//     get: {
//       summary: "Get full bins",
//       tags: ["Bins"],
//       security: [{ bearerAuth: [] }],
//       parameters: [ { name: "page", in: "query", schema: { type: "integer", default: 1 } }, { name: "limit", in: "query", schema: { type: "integer", default: 10 } }, { name: "threshold", in: "query", schema: { type: "integer", default: 80 } } ],
//       responses: { "200": { description: "Full bins retrieved" } }
//     }
//   },

//   "/bins/category/{category}": {
//     get: {
//       summary: "Get bins by category",
//       tags: ["Bins"],
//       security: [{ bearerAuth: [] }],
//       parameters: [ { name: "category", in: "path", required: true, schema: { type: "string" } }, { name: "page", in: "query", schema: { type: "integer", default: 1 } }, { name: "limit", in: "query", schema: { type: "integer", default: 10 } } ],
//       responses: { "200": { description: "Bins in category retrieved" } }
//     }
//   },

//   "/bins/near": {
//     get: {
//       summary: "Get bins near location",
//       tags: ["Bins"],
//       security: [{ bearerAuth: [] }],
//       parameters: [ { name: "longitude", in: "query", required: true, schema: { type: "number" } }, { name: "latitude", in: "query", required: true, schema: { type: "number" } }, { name: "radius", in: "query", schema: { type: "integer", default: 1000 } } ],
//       responses: { "200": { description: "Nearby bins retrieved" } }
//     }
//   }
};
