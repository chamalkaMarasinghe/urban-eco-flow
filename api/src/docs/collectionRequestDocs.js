/**
 * Collection request API documentation
 */
module.exports = {
  "/collection-requests": {
    post: {
      summary: "Create a new collection request",
      tags: ["Collection Requests"],
      security: [{ bearerAuth: [] }],
      requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CollectionRequest" } } } },
      responses: { "201": { description: "Created" }, "400": { description: "Validation error" } }
    },
    get: { summary: "Get all collection requests", tags: ["Collection Requests"], security: [{ bearerAuth: [] }], responses: { "200": { description: "Collection requests retrieved" } } }
  },

  "/collection-requests/my-requests": { get: { summary: "Get my collection requests", tags: ["Collection Requests"], security: [{ bearerAuth: [] }], responses: { "200": { description: "My requests" } } } },

  "/collection-requests/{id}": {
    get: { summary: "Get collection request by ID", tags: ["Collection Requests"], security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Request retrieved" }, "404": { description: "Not found" } } },
    put: { summary: "Update collection request", tags: ["Collection Requests"], security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "200": { description: "Updated" } } }
  },

  "/collection-requests/{id}/schedule": { post: { summary: "Schedule collection request", tags: ["Collection Requests"], security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "200": { description: "Scheduled" } } } },

  "/collection-requests/{id}/complete": { post: { summary: "Complete collection request", tags: ["Collection Requests"], security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "200": { description: "Completed" } } } },

  "/collection-requests/{id}/cancel": { post: { summary: "Cancel collection request", tags: ["Collection Requests"], security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object", properties: { reason: { type: "string" } } } } } }, responses: { "200": { description: "Cancelled" } } } },

  "/collection-requests/{id}/attachments": { post: { summary: "Add attachment to collection request", tags: ["Collection Requests"], security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object", properties: { filename: { type: "string" }, url: { type: "string" } } } } } }, responses: { "200": { description: "Attachment added" } } } },

  "/collection-requests/pending": { get: { summary: "Get pending requests", tags: ["Collection Requests"], security: [{ bearerAuth: [] }], responses: { "200": { description: "Pending requests" } } } },

  "/collection-requests/scheduled/{date}": { get: { summary: "Get scheduled requests by date", tags: ["Collection Requests"], security: [{ bearerAuth: [] }], parameters: [{ name: "date", in: "path", required: true, schema: { type: "string", format: "date" } }], responses: { "200": { description: "Scheduled requests" } } } },

  "/collection-requests/urgent": { get: { summary: "Get urgent requests", tags: ["Collection Requests"], security: [{ bearerAuth: [] }], responses: { "200": { description: "Urgent requests" } } } }
};
