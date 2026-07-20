const express = require("express");
const adminAuthMiddleware = require("./logout-middleware-backend");
const logoutAdminProcess = require("./logout-process-backend");
const csrfTokenMiddleware = require("../../csrf-and-token-functions/csrf-token-frontend");
function createAdminLogoutRoute() {
  const router = express.Router();
  router.post("/", csrfTokenMiddleware, adminAuthMiddleware, logoutAdminProcess);
  return router;
}
module.exports = createAdminLogoutRoute();
