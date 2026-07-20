const authMiddleware = require("../../csrf-and-token-functions/auth-middleware-backend");
const logoutMiddleware = [authMiddleware];
module.exports = logoutMiddleware;
