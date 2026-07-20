process.env.JWT_SECRET = "test_secret";
process.env.NODE_ENV = "test";
process.env.ADMIN_REGISTRATION_SECRET = "super-secret-key";

const express = require("express");
const cookieParser = require("cookie-parser");
const request = require("supertest");
const { withCsrf } = require("../../../testUtils/testRequest");

const Admin = require("../../../models/admin-model");
jest.mock("../../../models/admin-model", () => {
  const { createMockModel } = require("../../../testUtils/mockModel");
  return createMockModel();
});

const registerRoute = require("./register-route-backend");

function buildApp() {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use("/auth/admin/register", registerRoute);
  return app;
}

describe("POST /auth/admin/register", () => {
  let app;

  beforeEach(() => {
    Admin.__reset();
    app = buildApp();
  });

  const validBody = {
    username: "newadmin",
    email: "admin@example.com",
    password: "Passw0rd!",
    adminSecret: "super-secret-key",
  };

  test("rejects an incorrect admin secret", async () => {
    const res = await withCsrf(request(app), "post", "/auth/admin/register").send({
      ...validBody,
      adminSecret: "wrong-secret",
    });
    expect(res.status).toBe(403);
    expect(Admin.__store).toHaveLength(0);
  });

  test("creates an admin with the correct secret and valid data", async () => {
    const res = await withCsrf(request(app), "post", "/auth/admin/register").send(validBody);
    expect(res.status).toBe(201);
    expect(Admin.__store).toHaveLength(1);
    expect(Admin.__store[0].password).not.toBe("Passw0rd!");
  });

  test("rejects a password without a special character", async () => {
    const res = await withCsrf(request(app), "post", "/auth/admin/register").send({
      ...validBody,
      password: "Passw0rd1",
    });
    expect(res.status).toBe(422);
  });

  test("rejects a duplicate email", async () => {
    Admin.__reset([{ _id: "1", username: "existing", email: "admin@example.com", password: "hashed" }]);
    const res = await withCsrf(request(app), "post", "/auth/admin/register").send(validBody);
    expect(res.status).toBe(409);
  });
});
