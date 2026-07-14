const express = require("express");
const registerMiddleware = require("./register-middleware-backend");
const registerUserProcess = require("./register-process-backend");
const csrfTokenMiddleware = require("../../csrf-and-token-functions/csrf-token-frontend");

/**
 * Express router for the user registration endpoint.
 * POST / — validates, CSRF-checks, and processes registration.
 */
function createRegisterRoute() {
  const router = express.Router();

  router.post(
    "/",
    csrfTokenMiddleware,
    registerMiddleware,
    registerUserProcess
  );

  return router;
}

module.exports = createRegisterRoute();
