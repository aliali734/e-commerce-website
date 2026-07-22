const crypto = require("crypto");
const getCookieConfig = require("./cookie-config-backend");

/**
 * Middleware that ensures a CSRF token cookie exists on the response.
 * Sets a new token if one is not already present, and always makes the
 * current token available on req.csrfToken so downstream handlers (e.g.
 * the /auth/csrf-token endpoint) can read it without waiting for the
 * cookie to round-trip through the browser first.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function ensureCsrfCookie(req, res, next) {
  const existingToken = req.cookies?.csrfToken;

  if (existingToken) {
    req.csrfToken = existingToken;
    return next();
  }

  const token = crypto.randomBytes(32).toString("hex");
  const config = getCookieConfig();
  res.cookie("csrfToken", token, {
    ...config,
    httpOnly: false, // Must be readable by JS on the client
  });

  req.csrfToken = token;
  next();
}

module.exports = { ensureCsrfCookie };
