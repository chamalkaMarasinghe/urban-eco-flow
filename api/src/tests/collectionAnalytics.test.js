const request = require("supertest");
const app = require("./app");
const CollectionRequest = require("../models/collectionRequest");
const Bin = require("../models/bin");
const User = require("../models/user");
const {
    generateTestToken,
    createMockUser,
    createMockBin,
} = require("./helpers");

// Mock data
const mockUser = createMockUser();
const mockBin = createMockBin();

describe("Collection Analytics API", () => {
    describe("GET /api/v1/collection-requests/analytics", () => {
        it("should get user collection analytics successfully", async () => {
            const user = await User.create(mockUser);
            const bin = await Bin.create({
                ...mockBin,
                owner: user._id,
                capacity: 120,
            });

            // Create collection requests for different dates
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            await CollectionRequest.create([
                {
                    requestNumber: "CR001",
                    requester: user._id,
                    bin: bin._id,
                    type: "GENERAL",
                    priority: "REGULAR",
                    location: {
                        coordinates: [-74.0059, 40.7128],
                        address: "123 Main St, New York, NY",
                    },
                    wasteDetails: {
                        category: "GENERAL",
                        description: "Regular household waste",
                        estimatedWeight: 10,
                    },
                    createdAt: today,
                },
                {
                    requestNumber: "CR002",
                    requester: user._id,
                    bin: bin._id,
                    type: "GENERAL",
                    priority: "REGULAR",
                    location: {
                        coordinates: [-74.0059, 40.7128],
                        address: "123 Main St, New York, NY",
                    },
                    wasteDetails: {
                        category: "GENERAL",
                        description: "Regular household waste",
                        estimatedWeight: 10,
                    },
                    createdAt: yesterday,
                },
            ]);

            const response = await request(app)
                .get("/api/v1/collection-requests/analytics")
                .set("Authorization", `Bearer ${generateTestToken(user)}`)
                .expect(200);
        });

        it("should require authentication", async () => {
            const response = await request(app)
                .get("/api/v1/collection-requests/analytics")
                .expect(401);
        });
    });
});
