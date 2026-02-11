import app from "#src/app.js";
import request from "supertest";

describe("API Tests", () => {
    describe("GET /health", () => {
        it("should return 200", async () => {
            const response = await request(app).get("/health").expect(200);
            expect(response.body).toHaveProperty("status", "ok");
            expect(response.body).toHaveProperty("timestamp");
            expect(response.body).toHaveProperty("uptime");
        });
    });

    describe("GET /", () => {
        it("should return 200", async () => {
            const response = await request(app).get("/").expect(200);
            expect(response.body).toHaveProperty("message", "Acquisitions API is running");
        });
    });

    describe("GET /not-found", () => {
        it("should return 404 for non-existent routes", async () => {
            const response = await request(app).get("/not-found").expect(404);
            expect(response.body).toHaveProperty("error", "Not Found");
        });
    });

   
});