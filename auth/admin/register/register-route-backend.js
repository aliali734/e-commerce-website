const express = require("express");
const adminRegisterMiddleware = require("./register-middleware-backend");
const registerAdminProcess = require("./register-process-backend");
const csrfTokenMiddleware = require("../../csrf-and-token-functions/csrf-token-frontend");

/**
 * Express router for the admin registration endpoint.
 * POST / — validates, CSRF-checks, and processes admin registration.
 */
function createAdminRegisterRoute() {
  const router = express.Router();

  router.post(
    "/",
    csrfTokenMiddleware,
    adminRegisterMiddleware,
    registerAdminProcess
  );

  return router;
}

module.exports = createAdminRegisterRoute();
