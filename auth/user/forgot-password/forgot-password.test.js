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

const User = require("../../../models/user-model");
jest.mock("../../../models/user-model", () => {
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
  app.use("/auth/user/forgot-password", forgotPasswordRoute);
  return app;
}

describe("POST /auth/user/forgot-password", () => {
  let app;

  beforeEach(() => {
    sendMailMock.mockClear();
    User.__reset([{ _id: "1", username: "real", email: "real@example.com", password: "hashed" }]);
    app = buildApp();
  });

  test("sends a reset email for a registered address and sets a token", async () => {
    const res = await withCsrf(request(app), "post", "/auth/user/forgot-password").send({
      email: "real@example.com",
    });
    expect(res.status).toBe(200);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(User.__store[0].resetPasswordToken).toBeTruthy();
    expect(User.__store[0].resetPasswordExpires).toBeInstanceOf(Date);
  });

  test("returns the same neutral response for an unregistered address (no enumeration)", async () => {
    const res = await withCsrf(request(app), "post", "/auth/user/forgot-password").send({
      email: "nobody@example.com",
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/if that email is registered/i);
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  test("rejects an invalid email format", async () => {
    const res = await withCsrf(request(app), "post", "/auth/user/forgot-password").send({
      email: "not-an-email",
    });
    expect(res.status).toBe(422);
  });
});
