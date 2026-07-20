const express = require("express");
const registerMiddleware = require("./register-middleware-backend");
const registerUserProcess = require("./register-process-backend");
const csrfTokenMiddleware = require("../../csrf-and-token-functions/csrf-token-frontend");
function createRegisterRoute() {
  const router = express.Router();
  router.post("/", csrfTokenMiddleware, registerMiddleware, registerUserProcess);
  return router;
}
module.exports = createRegisterRoute();
