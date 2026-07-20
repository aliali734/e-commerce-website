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

const resetPasswordRoute = require("./reset-password-route-backend");

function buildApp() {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use("/auth/user/reset-password", resetPasswordRoute);
  return app;
}

describe("POST /auth/user/reset-password", () => {
  let app;

  beforeEach(() => {
    User.__reset([
      {
        _id: "1",
        username: "user",
        email: "user@example.com",
        password: "oldhash",
        resetPasswordToken: "valid-token",
        resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000), // 1hr from now
      },
      {
        _id: "2",
        username: "expired",
        email: "expired@example.com",
        password: "oldhash",
        resetPasswordToken: "expired-token",
        resetPasswordExpires: new Date(Date.now() - 60 * 60 * 1000), // 1hr ago
      },
    ]);
    app = buildApp();
  });

  test("resets the password with a valid, unexpired token", async () => {
    const res = await withCsrf(request(app), "post", "/auth/user/reset-password").send({
      token: "valid-token",
      password: "NewPassw0rd!",
    });
    expect(res.status).toBe(200);
    const updated = User.__store.find((u) => u._id === "1");
    expect(updated.password).not.toBe("oldhash");
    expect(await bcrypt.compare("NewPassw0rd!", updated.password)).toBe(true);
    expect(updated.resetPasswordToken).toBeNull();
    expect(updated.resetPasswordExpires).toBeNull();
  });

  test("rejects an expired token", async () => {
    const res = await withCsrf(request(app), "post", "/auth/user/reset-password").send({
      token: "expired-token",
      password: "NewPassw0rd!",
    });
    expect(res.status).toBe(400);
  });

  test("rejects an unknown token", async () => {
    const res = await withCsrf(request(app), "post", "/auth/user/reset-password").send({
      token: "does-not-exist",
      password: "NewPassw0rd!",
    });
    expect(res.status).toBe(400);
  });

  test("rejects a weak new password", async () => {
    const res = await withCsrf(request(app), "post", "/auth/user/reset-password").send({
      token: "valid-token",
      password: "weak",
    });
    expect(res.status).toBe(422);
  });
});
