const request = require("supertest");
const app = require("./app");
const User = require("../models/user");
const { generateTestToken, createMockUser } = require("./helpers");

describe("Basic API Tests", () => {
    it("should return test API message", async () => {
        const response = await request(app).get("/").expect(200);

        expect(response.body.message).toBe("Test API is running");
    });

    it("should create a user successfully", async () => {
        const mockUser = createMockUser();
        const user = await User.create(mockUser);

        expect(user._id).toBeDefined();
        expect(user.email).toBe(mockUser.email);
    });

    it("should generate a valid JWT token", () => {
        const mockUser = createMockUser();
        const token = generateTestToken(mockUser);

        expect(token).toBeDefined();
        expect(typeof token).toBe("string");
    });
});
