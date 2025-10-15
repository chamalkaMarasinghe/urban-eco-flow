const request = require("supertest");
const app = require("./app");
const CollectionRequest = require("../models/collectionRequest");
const User = require("../models/user");
const Bin = require("../models/bin");
const {
    generateTestToken,
    createMockUser,
    createMockCollectionRequest,
    createMockBin,
} = require("./helpers");

// Mock data
const mockUser = createMockUser();
const mockCollectionTeamUser = createMockUser({
    id: "team123",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    roles: ["COLLECTION_TEAM"],
});
const mockCollectionRequest = createMockCollectionRequest();
const mockBin = createMockBin();

describe("Collection Request Controller", () => {
    describe("POST /api/v1/collection-requests", () => {
        it("should create a new collection request successfully", async () => {
            const user = await User.create(mockUser);

            const requestData = {
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
            };

            const response = await request(app)
                .post("/api/v1/collection-requests")
                .set("Authorization", `Bearer ${generateMockToken(user)}`)
                .send(requestData)
                .expect(201);
        });
    });

    describe("GET /api/v1/collection-requests/my-requests", () => {
        it("should get user collection requests successfully", async () => {
            const user = await User.create(mockUser);

            // Create collection requests for the user
            await CollectionRequest.create([
                {
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
                    requester: user._id,
                    requestNumber: "CR001",
                },
            ]);

            const response = await request(app)
                .get("/api/v1/collection-requests/my-requests")
                .set("Authorization", `Bearer ${generateMockToken(user)}`)
                .expect(200);
        });
    });
});

// Helper function to generate mock JWT token (using the helper)
function generateMockToken(user) {
    return generateTestToken(user);
}
