const jwt = require("jsonwebtoken");
const getCookieConfig = require("../../csrf-and-token-functions/cookie-config-backend");

/**
 * Handles the OAuth success callback after Passport has authenticated the user.
 * Issues a JWT auth cookie and redirects the user to the OAuth success page.
 *
 * Redirects to FRONTEND_URL (not a relative path): the callback page is
 * static HTML that lives on the frontend's separate origin, not on this
 * backend, so a relative redirect would 404 against this server instead.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
function handleOAuthCallback(req, res) {
  if (!req.user) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/user/oauth/oauth-callback-frontend.html?error=auth_failed`
    );
  }

  const token = jwt.sign(
    { id: req.user.id, email: req.user.email, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.cookie("authToken", token, getCookieConfig());

  return res.redirect(
    `${process.env.FRONTEND_URL}/auth/user/oauth/oauth-callback-frontend.html?status=success`
  );
}

module.exports = handleOAuthCallback;
