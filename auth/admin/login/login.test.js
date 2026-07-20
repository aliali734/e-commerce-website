process.env.JWT_SECRET = "test_secret";
process.env.NODE_ENV = "test";

const bcrypt = require("bcryptjs");
const express = require("express");
const cookieParser = require("cookie-parser");
const request = require("supertest");
const { withCsrf } = require("../../../testUtils/testRequest");

const Admin = require("../../../models/admin-model");
jest.mock("../../../models/admin-model", () => {
  const { createMockModel } = require("../../../testUtils/mockModel");
  return createMockModel();
});

const loginRoute = require("./login-route-backend");

function buildApp() {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use("/auth/admin/login", loginRoute);
  return app;
}

describe("POST /auth/admin/login", () => {
  let app;
  let hashedPassword;

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash("CorrectPass1!", 12);
  });

  beforeEach(() => {
    Admin.__reset([
      { _id: "1", username: "admin", email: "admin@example.com", password: hashedPassword, isActive: true, role: "admin" },
      { _id: "2", username: "banned", email: "banned@example.com", password: hashedPassword, isActive: false },
    ]);
    app = buildApp();
  });

  test("logs in with correct credentials and sets an adminAuthToken cookie", async () => {
    const res = await withCsrf(request(app), "post", "/auth/admin/login").send({
      email: "admin@example.com",
      password: "CorrectPass1!",
    });
    expect(res.status).toBe(200);
    const cookies = res.headers["set-cookie"] || [];
    expect(cookies.some((c) => c.startsWith("adminAuthToken="))).toBe(true);
  });

  test("rejects a wrong password", async () => {
    const res = await withCsrf(request(app), "post", "/auth/admin/login").send({
      email: "admin@example.com",
      password: "WrongPass1!",
    });
    expect(res.status).toBe(401);
  });

  test("rejects a deactivated admin account", async () => {
    const res = await withCsrf(request(app), "post", "/auth/admin/login").send({
      email: "banned@example.com",
      password: "CorrectPass1!",
    });
    expect(res.status).toBe(403);
  });
});
