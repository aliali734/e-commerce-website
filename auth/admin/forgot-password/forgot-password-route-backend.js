const express = require("express");
const adminForgotPasswordMiddleware = require("./forgot-password-middleware-backend");
const forgotPasswordAdminProcess = require("./forgot-password-process-backend");
const csrfTokenMiddleware = require("../../csrf-and-token-functions/csrf-token-frontend");
function createAdminForgotPasswordRoute() {
  const router = express.Router();
  router.post("/", csrfTokenMiddleware, adminForgotPasswordMiddleware, forgotPasswordAdminProcess);
  return router;
}
module.exports = createAdminForgotPasswordRoute();
