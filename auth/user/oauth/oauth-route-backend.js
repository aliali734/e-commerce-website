const express = require("express");
const passport = require("passport");
const handleOAuthCallback = require("./oauth-callback-handler-backend");
const handleOAuthFailure = require("./oauth-failure-handler-backend");

/**
 * Express router for all user OAuth endpoints.
 *
 * GET /auth/user/oauth/google          — initiates Google login
 * GET /auth/user/oauth/google/callback — Google redirects here after auth
 * GET /auth/user/oauth/facebook          — initiates Facebook login
 * GET /auth/user/oauth/facebook/callback — Facebook redirects here after auth
 */
function createOAuthRoutes() {
  const router = express.Router();
  const failureRedirect = `${process.env.FRONTEND_URL}/auth/user/oauth/oauth-callback-frontend.html?error=oauth_failed`;

  // Google
  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect,
    }),
    handleOAuthCallback
  );

  // Facebook
  router.get(
    "/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
  );

  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
      session: false,
      failureRedirect,
    }),
    handleOAuthCallback
  );

  // Generic failure route
  router.get("/failure", handleOAuthFailure);

  return router;
}

module.exports = createOAuthRoutes();
