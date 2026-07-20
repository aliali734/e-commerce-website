process.env.JWT_SECRET = "test_secret";
process.env.NODE_ENV = "test";
process.env.FRONTEND_URL = "http://localhost:3000";
process.env.EMAIL_HOST = "smtp.example.com";
process.env.EMAIL_PORT = "587";
process.env.EMAIL_USER = "noreply@example.com";
process.env.EMAIL_PASS = "unused";
process.env.EMAIL_FROM = "noreply@example.com";

const express = require("express");
const cookieParser = require("cookie-parser");
const request = require("supertest");
const { withCsrf } = require("../../../testUtils/testRequest");

jest.mock("nodemailer", () => {
  const sharedSendMail = jest.fn().mockResolvedValue(true);
  return {
    createTransport: jest.fn(() => ({ sendMail: sharedSendMail })),
    __sendMailMock: sharedSendMail,
  };
});

const Admin = require("../../../models/admin-model");
jest.mock("../../../models/admin-model", () => {
  const { createMockModel } = require("../../../testUtils/mockModel");
  return createMockModel();
});

const nodemailer = require("nodemailer");
const forgotPasswordRoute = require("./forgot-password-route-backend");

// The route calls createTransport() fresh on every request; the mock above
// always returns the same sendMail spy so tests can assert on it here.
const sendMailMock = nodemailer.__sendMailMock;

function buildApp() {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use("/auth/admin/forgot-password", forgotPasswordRoute);
  return app;
}

describe("POST /auth/admin/forgot-password", () => {
  let app;

  beforeEach(() => {
    sendMailMock.mockClear();
    Admin.__reset([{ _id: "1", username: "admin", email: "admin@example.com", password: "hashed" }]);
    app = buildApp();
  });

  test("sends a reset email for a registered admin", async () => {
    const res = await withCsrf(request(app), "post", "/auth/admin/forgot-password").send({
      email: "admin@example.com",
    });
    expect(res.status).toBe(200);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(Admin.__store[0].resetPasswordToken).toBeTruthy();
  });

  test("does not reveal whether an admin email exists", async () => {
    const res = await withCsrf(request(app), "post", "/auth/admin/forgot-password").send({
      email: "nobody@example.com",
    });
    expect(res.status).toBe(200);
    expect(sendMailMock).not.toHaveBeenCalled();
  });
});
