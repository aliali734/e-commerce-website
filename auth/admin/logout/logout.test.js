process.env.JWT_SECRET = "test_secret";
process.env.NODE_ENV = "test";

const jwt = require("jsonwebtoken");
const express = require("express");
const cookieParser = require("cookie-parser");
const request = require("supertest");

const logoutRoute = require("./logout-route-backend");

function buildApp() {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use("/auth/admin/logout", logoutRoute);
  return app;
}

describe("POST /auth/admin/logout", () => {
  let app;

  beforeEach(() => {
    app = buildApp();
  });

  test("rejects logout without a valid adminAuthToken", async () => {
    const res = await request(app)
      .post("/auth/admin/logout")
      .set("Cookie", ["csrfToken=test-csrf-token"])
      .set("X-CSRF-Token", "test-csrf-token");
    expect(res.status).toBe(401);
  });

  test("rejects a non-admin token (role check)", async () => {
    const token = jwt.sign({ id: "1", email: "user@example.com", role: "user" }, process.env.JWT_SECRET);
    const res = await request(app)
      .post("/auth/admin/logout")
      .set("Cookie", [`csrfToken=test-csrf-token`, `adminAuthToken=${token}`])
      .set("X-CSRF-Token", "test-csrf-token");
    expect(res.status).toBe(403);
  });

  test("clears the adminAuthToken cookie for a valid admin", async () => {
    const token = jwt.sign({ id: "1", email: "admin@example.com", role: "admin" }, process.env.JWT_SECRET);
    const res = await request(app)
      .post("/auth/admin/logout")
      .set("Cookie", [`csrfToken=test-csrf-token`, `adminAuthToken=${token}`])
      .set("X-CSRF-Token", "test-csrf-token");
    expect(res.status).toBe(200);
    const cookies = res.headers["set-cookie"] || [];
    expect(cookies.some((c) => c.startsWith("adminAuthToken=") && c.includes("Expires="))).toBe(true);
  });
});
