const express = require("express");
const logoutMiddleware = require("./logout-middleware-backend");
const logoutUserProcess = require("./logout-process-backend");
const csrfTokenMiddleware = require("../../csrf-and-token-functions/csrf-token-frontend");
function createLogoutRoute() {
  const router = express.Router();
  router.post("/", csrfTokenMiddleware, logoutMiddleware, logoutUserProcess);
  return router;
}
module.exports = createLogoutRoute();
