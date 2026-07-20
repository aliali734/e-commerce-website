process.env.JWT_SECRET = "test_secret";
process.env.NODE_ENV = "test";

const express = require("express");
const cookieParser = require("cookie-parser");
const request = require("supertest");
const { createMockModel } = require("../../../testUtils/mockModel");
const { withCsrf } = require("../../../testUtils/testRequest");

const User = require("../../../models/user-model");
jest.mock("../../../models/user-model", () => {
  const { createMockModel } = require("../../../testUtils/mockModel");
  return createMockModel();
});

const registerRoute = require("./register-route-backend");

function buildApp() {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use("/auth/user/register", registerRoute);
  return app;
}

describe("POST /auth/user/register", () => {
  let app;

  beforeEach(() => {
    User.__reset();
    app = buildApp();
  });

  test("rejects requests missing a CSRF token", async () => {
    const res = await request(app).post("/auth/user/register").send({
      username: "newuser",
      email: "new@example.com",
      password: "Passw0rd!",
    });
    expect(res.status).toBe(403);
  });

  test("rejects an invalid email", async () => {
    const res = await withCsrf(request(app), "post", "/auth/user/register").send({
      username: "newuser",
      email: "not-an-email",
      password: "Passw0rd!",
    });
    expect(res.status).toBe(422);
  });

  test("rejects a weak password", async () => {
    const res = await withCsrf(request(app), "post", "/auth/user/register").send({
      username: "newuser",
      email: "new@example.com",
      password: "weak",
    });
    expect(res.status).toBe(422);
  });

  test("creates a new user with valid data", async () => {
    const res = await withCsrf(request(app), "post", "/auth/user/register").send({
      username: "newuser",
      email: "new@example.com",
      password: "Passw0rd1!",
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(User.__store).toHaveLength(1);
    expect(User.__store[0].email).toBe("new@example.com");
    // Password must be hashed, never stored in plain text
    expect(User.__store[0].password).not.toBe("Passw0rd1!");
  });

  test("rejects a duplicate email", async () => {
    User.__reset([{ _id: "1", username: "existing", email: "dupe@example.com", password: "hashed" }]);
    const res = await withCsrf(request(app), "post", "/auth/user/register").send({
      username: "another",
      email: "dupe@example.com",
      password: "Passw0rd1!",
    });
    expect(res.status).toBe(409);
  });
});
