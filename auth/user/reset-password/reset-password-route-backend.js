const express = require("express");
const resetPasswordMiddleware = require("./reset-password-middleware-backend");
const resetPasswordUserProcess = require("./reset-password-process-backend");
const csrfTokenMiddleware = require("../../csrf-and-token-functions/csrf-token-frontend");

/**
 * Express router for the user reset-password endpoint.
 * POST / — validates, CSRF-checks, and processes the password reset.
 */
function createResetPasswordRoute() {
  const router = express.Router();

  router.post(
    "/",
    csrfTokenMiddleware,
    resetPasswordMiddleware,
    resetPasswordUserProcess
  );

  return router;
}

module.exports = createResetPasswordRoute();
