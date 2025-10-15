const request = require("supertest");
const app = require("./app");
const Sensor = require("../models/sensor");
const User = require("../models/user");
const Bin = require("../models/bin");
const {
    generateTestToken,
    createMockUser,
    createMockSensor,
    createMockBin,
} = require("./helpers");

// Mock data
const mockUser = createMockUser();
const mockSensor = createMockSensor();
const mockBin = createMockBin();

describe("Sensor Controller", () => {
    describe("POST /api/v1/sensors", () => {
        it("should create a new sensor successfully", async () => {
            // Create a user first
            const user = await User.create(mockUser);

            const sensorData = {
                serialNumber: "SN123456",
                type: "FILL_LEVEL",
                manufacturer: "EcoTech",
                model: "ET-100",
                purchasePrice: 150.0,
                location: {
                    coordinates: [-74.0059, 40.7128],
                    address: "123 Main St, New York, NY",
                },
                owner: user._id.toString(),
            };

            const response = await request(app)
                .post("/api/v1/sensors")
                .set("Authorization", `Bearer ${generateMockToken(user)}`)
                .send(sensorData)
                .expect(201);
        });
    });

    describe("GET /api/v1/sensors/my-sensors", () => {
        it("should get user sensors successfully", async () => {
            const user = await User.create(mockUser);

            // Create sensors for the user
            await Sensor.create([
                { ...mockSensor, owner: user._id, serialNumber: "SN001" },
                { ...mockSensor, owner: user._id, serialNumber: "SN002" },
            ]);

            const response = await request(app)
                .get("/api/v1/sensors/my-sensors")
                .set("Authorization", `Bearer ${generateMockToken(user)}`)
                .expect(200);
        });
    });
});

// Helper function to generate mock JWT token (using the helper)
function generateMockToken(user) {
    return generateTestToken(user);
}
