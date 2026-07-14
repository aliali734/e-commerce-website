const authMiddleware = require("../../csrf-and-token-functions/auth-middleware-backend");

/**
 * Middleware stack for the user logout endpoint.
 * Ensures the user is authenticated before allowing logout.
 * @type {import("express").RequestHandler[]}
 */
const logoutMiddleware = [authMiddleware];

module.exports = logoutMiddleware;
