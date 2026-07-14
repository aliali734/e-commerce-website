const crypto = require("crypto");
const getCookieConfig = require("./cookie-config-backend");

/**
 * Middleware that ensures a CSRF token cookie exists on the response.
 * Sets a new token if one is not already present.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function ensureCsrfCookie(req, res, next) {
  if (!req.cookies?.csrfToken) {
    const token = crypto.randomBytes(32).toString("hex");
    const config = getCookieConfig();
    res.cookie("csrfToken", token, {
      ...config,
      httpOnly: false, // Must be readable by JS on the client
    });
  }
  next();
}

module.exports = { ensureCsrfCookie };
