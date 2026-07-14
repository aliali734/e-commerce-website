const express = require("express");
const adminLoginMiddleware = require("./login-middleware-backend");
const loginAdminProcess = require("./login-process-backend");
const csrfTokenMiddleware = require("../../csrf-and-token-functions/csrf-token-frontend");

/**
 * Express router for the admin login endpoint.
 * POST / — validates, CSRF-checks, and processes admin login.
 */
function createAdminLoginRoute() {
  const router = express.Router();

  router.post(
    "/",
    csrfTokenMiddleware,
    adminLoginMiddleware,
    loginAdminProcess
  );

  return router;
}

module.exports = createAdminLoginRoute();
