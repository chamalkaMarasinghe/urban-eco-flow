const swaggerJSDoc = require("swagger-jsdoc");
const authDocs = require("../docs/authDocs");
// const threadDocs = require("../docs/threadDocs");
const currentEnvironment = require('./environmentConfig');
const BASE_URL = currentEnvironment.BASE_URL;
const API_VERSION = currentEnvironment.API_VERSION;

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "UrbanEcoFlow API",
            version: "1.0.0",
            description: "API documentation for UrbanEcoFlow - Smart Waste Management Platform",
        },
        paths: {
            ...authDocs,
            // ...threadDocs,
        },
        servers: [{ url: `${BASE_URL}/api/v${API_VERSION}` }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Sensor: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        serialNumber: { type: 'string' },
                        type: { type: 'string', enum: ['FILL_LEVEL', 'WEIGHT', 'TEMPERATURE', 'MULTI_SENSOR'] },
                        status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'FAULTY', 'MAINTENANCE', 'RETIRED'] },
                        manufacturer: { type: 'string' },
                        model: { type: 'string' },
                        purchasePrice: { type: 'number' },
                        batteryLevel: { type: 'number', minimum: 0, maximum: 100 },
                        location: {
                            type: 'object',
                            properties: {
                                type: { type: 'string', enum: ['Point'] },
                                coordinates: { type: 'array', items: { type: 'number' } },
                                address: { type: 'string' }
                            }
                        },
                        owner: { type: 'string' },
                        bin: { type: 'string' }
                    }
                },
                Bin: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        binNumber: { type: 'string' },
                        capacity: { type: 'number' },
                        category: { type: 'string', enum: ['ORGANIC', 'RECYCLABLE', 'GENERAL', 'HAZARDOUS', 'E_WASTE', 'BULKY'] },
                        material: { type: 'string', enum: ['plastic', 'metal', 'concrete', 'wood'] },
                        color: { type: 'string' },
                        location: {
                            type: 'object',
                            properties: {
                                type: { type: 'string', enum: ['Point'] },
                                coordinates: { type: 'array', items: { type: 'number' } },
                                address: { type: 'string' }
                            }
                        },
                        owner: { type: 'string' },
                        sensor: { type: 'string' },
                        currentFillLevel: { type: 'number', minimum: 0, maximum: 100 },
                        currentWeight: { type: 'number', minimum: 0 }
                    }
                },
                CollectionRequest: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        requestNumber: { type: 'string' },
                        type: { type: 'string', enum: ['NORMAL', 'SPECIAL', 'BULKY_ITEMS', 'E_WASTE', 'HAZARDOUS', 'URGENT'] },
                        status: { type: 'string', enum: ['PENDING', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'FAILED'] },
                        priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
                        requester: { type: 'string' },
                        bin: { type: 'string' },
                        location: {
                            type: 'object',
                            properties: {
                                type: { type: 'string', enum: ['Point'] },
                                coordinates: { type: 'array', items: { type: 'number' } },
                                address: { type: 'string' }
                            }
                        },
                        wasteDetails: {
                            type: 'object',
                            properties: {
                                category: { type: 'string', enum: ['ORGANIC', 'RECYCLABLE', 'GENERAL', 'HAZARDOUS', 'E_WASTE', 'BULKY'] },
                                description: { type: 'string' },
                                estimatedWeight: { type: 'number', minimum: 0 },
                                estimatedVolume: { type: 'number', minimum: 0 }
                            }
                        },
                        scheduledDate: { type: 'string', format: 'date-time' },
                        collectionTeam: { type: 'string' }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        phoneNumber: { type: 'string' },
                        roles: { type: 'array', items: { type: 'string' } },
                        userType: { type: 'string', enum: ['individual', 'business'] },
                        address: {
                            type: 'object',
                            properties: {
                                street: { type: 'string' },
                                city: { type: 'string' },
                                state: { type: 'string' },
                                postalCode: { type: 'string' },
                                country: { type: 'string' },
                                coordinates: { type: 'array', items: { type: 'number' } }
                            }
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        statusCode: { type: 'number' },
                        error: { type: 'string' }
                    }
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: { type: 'object' }
                    }
                }
            }
        },
        // security: [{ BearerAuth: [] }], // Applies to all endpoints
    },
  apis: ["./routes/*.js"], // Path to route files with Swagger annotations
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;