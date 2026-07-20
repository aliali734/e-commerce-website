const express = require("express");
const adminRegisterMiddleware = require("./register-middleware-backend");
const registerAdminProcess = require("./register-process-backend");
const csrfTokenMiddleware = require("../../csrf-and-token-functions/csrf-token-frontend");
function createAdminRegisterRoute() {
  const router = express.Router();
  router.post("/", csrfTokenMiddleware, adminRegisterMiddleware, registerAdminProcess);
  return router;
}
module.exports = createAdminRegisterRoute();
