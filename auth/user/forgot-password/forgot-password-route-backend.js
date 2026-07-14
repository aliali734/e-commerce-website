const express = require("express");
const forgotPasswordMiddleware = require("./forgot-password-middleware-backend");
const forgotPasswordUserProcess = require("./forgot-password-process-backend");
const csrfTokenMiddleware = require("../../csrf-and-token-functions/csrf-token-frontend");

/**
 * Express router for the user forgot-password endpoint.
 * POST / — validates, CSRF-checks, and triggers a password reset email.
 */
function createForgotPasswordRoute() {
  const router = express.Router();

  router.post(
    "/",
    csrfTokenMiddleware,
    forgotPasswordMiddleware,
    forgotPasswordUserProcess
  );

  return router;
}

module.exports = createForgotPasswordRoute();
