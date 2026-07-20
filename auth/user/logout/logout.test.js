process.env.JWT_SECRET = "test_secret";
process.env.NODE_ENV = "test";

const jwt = require("jsonwebtoken");
const express = require("express");
const cookieParser = require("cookie-parser");
const request = require("supertest");
const { withCsrf } = require("../../../testUtils/testRequest");

const logoutRoute = require("./logout-route-backend");

function buildApp() {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use("/auth/user/logout", logoutRoute);
  return app;
}

describe("POST /auth/user/logout", () => {
  let app;

  beforeEach(() => {
    app = buildApp();
  });

  test("rejects logout without a valid authToken", async () => {
    const res = await withCsrf(request(app), "post", "/auth/user/logout");
    expect(res.status).toBe(401);
  });

  test("clears the authToken cookie for an authenticated user", async () => {
    const token = jwt.sign({ id: "1", email: "user@example.com", role: "user" }, process.env.JWT_SECRET);
    const res = await request(app)
      .post("/auth/user/logout")
      .set("Cookie", [`csrfToken=test-csrf-token`, `authToken=${token}`])
      .set("X-CSRF-Token", "test-csrf-token");
    expect(res.status).toBe(200);
    const cookies = res.headers["set-cookie"] || [];
    expect(cookies.some((c) => c.startsWith("authToken=") && c.includes("Expires="))).toBe(true);
  });
});
