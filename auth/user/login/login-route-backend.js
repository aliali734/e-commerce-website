const express = require("express");
const loginMiddleware = require("./login-middleware-backend");
const loginUserProcess = require("./login-process-backend");
const csrfTokenMiddleware = require("../../csrf-and-token-functions/csrf-token-frontend");

/**
 * Express router for the user login endpoint.
 * POST / — validates, CSRF-checks, and processes login.
 */
function createLoginRoute() {
  const router = express.Router();

  router.post(
    "/",
    csrfTokenMiddleware,
    loginMiddleware,
    loginUserProcess
  );

  return router;
}

module.exports = createLoginRoute();
