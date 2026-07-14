const express = require("express");
const logoutMiddleware = require("./logout-middleware-backend");
const logoutUserProcess = require("./logout-process-backend");
const csrfTokenMiddleware = require("../../csrf-and-token-functions/csrf-token-frontend");

/**
 * Express router for the user logout endpoint.
 * POST / — CSRF-checks, auth-checks, then clears the session.
 */
function createLogoutRoute() {
  const router = express.Router();

  router.post(
    "/",
    csrfTokenMiddleware,
    logoutMiddleware,
    logoutUserProcess
  );

  return router;
}

module.exports = createLogoutRoute();
