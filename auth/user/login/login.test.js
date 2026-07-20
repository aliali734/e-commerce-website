process.env.JWT_SECRET = "test_secret";
process.env.NODE_ENV = "test";

const bcrypt = require("bcryptjs");
const express = require("express");
const cookieParser = require("cookie-parser");
const request = require("supertest");
const { withCsrf } = require("../../../testUtils/testRequest");

const User = require("../../../models/user-model");
jest.mock("../../../models/user-model", () => {
  const { createMockModel } = require("../../../testUtils/mockModel");
  return createMockModel();
});

const loginRoute = require("./login-route-backend");

function buildApp() {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use("/auth/user/login", loginRoute);
  return app;
}

describe("POST /auth/user/login", () => {
  let app;
  let hashedPassword;

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash("CorrectPass1!", 12);
  });

  beforeEach(() => {
    User.__reset([
      {
        _id: "1",
        username: "activeuser",
        email: "user@example.com",
        password: hashedPassword,
        isActive: true,
      },
      {
        _id: "2",
        username: "deactivated",
        email: "banned@example.com",
        password: hashedPassword,
        isActive: false,
      },
      {
        _id: "3",
        username: "oauthonly",
        email: "oauth@example.com",
        password: null,
        isActive: true,
      },
    ]);
    app = buildApp();
  });

  test("rejects requests missing a CSRF token", async () => {
    const res = await request(app)
      .post("/auth/user/login")
      .send({ email: "user@example.com", password: "CorrectPass1!" });
    expect(res.status).toBe(403);
  });

  test("logs in with correct credentials and sets an authToken cookie", async () => {
    const res = await withCsrf(request(app), "post", "/auth/user/login").send({
      email: "user@example.com",
      password: "CorrectPass1!",
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const cookies = res.headers["set-cookie"] || [];
    expect(cookies.some((c) => c.startsWith("authToken="))).toBe(true);
  });

  test("rejects an unknown email", async () => {
    const res = await withCsrf(request(app), "post", "/auth/user/login").send({
      email: "nobody@example.com",
      password: "CorrectPass1!",
    });
    expect(res.status).toBe(401);
  });

  test("rejects a wrong password", async () => {
    const res = await withCsrf(request(app), "post", "/auth/user/login").send({
      email: "user@example.com",
      password: "WrongPass1!",
    });
    expect(res.status).toBe(401);
  });

  test("rejects a deactivated account", async () => {
    const res = await withCsrf(request(app), "post", "/auth/user/login").send({
      email: "banned@example.com",
      password: "CorrectPass1!",
    });
    expect(res.status).toBe(403);
  });

  test("rejects password login for an OAuth-only account", async () => {
    const res = await withCsrf(request(app), "post", "/auth/user/login").send({
      email: "oauth@example.com",
      password: "AnythingAtAll1!",
    });
    expect(res.status).toBe(401);
  });
});
