const express = require("express");
const adminResetPasswordMiddleware = require("./reset-password-middleware-backend");
const resetPasswordAdminProcess = require("./reset-password-process-backend");
const csrfTokenMiddleware = require("../../csrf-and-token-functions/csrf-token-frontend");
function createAdminResetPasswordRoute() {
  const router = express.Router();
  router.post("/", csrfTokenMiddleware, adminResetPasswordMiddleware, resetPasswordAdminProcess);
  return router;
}
module.exports = createAdminResetPasswordRoute();
