const express = require("express");
const adminLoginMiddleware = require("./login-middleware-backend");
const loginAdminProcess = require("./login-process-backend");
const csrfTokenMiddleware = require("../../csrf-and-token-functions/csrf-token-frontend");
function createAdminLoginRoute() {
  const router = express.Router();
  router.post("/", csrfTokenMiddleware, adminLoginMiddleware, loginAdminProcess);
  return router;
}
module.exports = createAdminLoginRoute();
