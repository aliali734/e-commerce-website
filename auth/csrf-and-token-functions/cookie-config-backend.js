/**
 * Returns the standard cookie configuration object for auth cookies.
 *
 * Frontend and backend run as two separate Render services (different
 * origins), so cookies must be sent cross-site. Browsers only allow that
 * with sameSite: "none", which in turn requires secure: true — Render
 * serves both services over HTTPS by default, so this holds in production.
 * In development (same-origin localhost), "lax" is used since "none"
 * without HTTPS is rejected by browsers.
 *
 * @param {number} [maxAge] - Cookie max age in milliseconds. Defaults to env value.
 * @returns {object} Cookie options object.
 */
function getCookieConfig(maxAge) {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: maxAge || parseInt(process.env.COOKIE_MAX_AGE) || 604800000,
    path: "/",
  };
}
module.exports = getCookieConfig;
