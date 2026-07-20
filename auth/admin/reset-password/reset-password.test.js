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

const resetPasswordRoute = require("./reset-password-route-backend");

function buildApp() {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use("/auth/admin/reset-password", resetPasswordRoute);
  return app;
}

describe("POST /auth/admin/reset-password", () => {
  let app;

  beforeEach(() => {
    Admin.__reset([
      {
        _id: "1",
        username: "admin",
        email: "admin@example.com",
        password: "oldhash",
        resetPasswordToken: "valid-token",
        resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000),
      },
      {
        _id: "2",
        username: "expiredadmin",
        email: "expired@example.com",
        password: "oldhash",
        resetPasswordToken: "expired-token",
        resetPasswordExpires: new Date(Date.now() - 60 * 60 * 1000),
      },
    ]);
    app = buildApp();
  });

  test("resets the admin password with a valid token", async () => {
    const res = await withCsrf(request(app), "post", "/auth/admin/reset-password").send({
      token: "valid-token",
      password: "NewPassw0rd!",
    });
    expect(res.status).toBe(200);
    const updated = Admin.__store.find((a) => a._id === "1");
    expect(await bcrypt.compare("NewPassw0rd!", updated.password)).toBe(true);
    expect(updated.resetPasswordToken).toBeNull();
  });

  test("rejects an expired token", async () => {
    const res = await withCsrf(request(app), "post", "/auth/admin/reset-password").send({
      token: "expired-token",
      password: "NewPassw0rd!",
    });
    expect(res.status).toBe(400);
  });

  test("rejects a new password missing a special character", async () => {
    const res = await withCsrf(request(app), "post", "/auth/admin/reset-password").send({
      token: "valid-token",
      password: "NewPassw0rd1",
    });
    expect(res.status).toBe(422);
  });
});
