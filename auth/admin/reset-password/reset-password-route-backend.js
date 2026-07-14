const express = require("express");
const adminResetPasswordMiddleware = require("./reset-password-middleware-backend");
const resetPasswordAdminProcess = require("./reset-password-process-backend");
const csrfTokenMiddleware = require("../../csrf-and-token-functions/csrf-token-frontend");

/**
 * Express router for the admin reset-password endpoint.
 * POST / — validates, CSRF-checks, and processes the admin password reset.
 */
function createAdminResetPasswordRoute() {
  const router = express.Router();

  router.post(
    "/",
    csrfTokenMiddleware,
    adminResetPasswordMiddleware,
    resetPasswordAdminProcess
  );

  return router;
}

module.exports = createAdminResetPasswordRoute();
