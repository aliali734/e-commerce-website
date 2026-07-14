/**
 * Returns the standard cookie configuration object for auth cookies.
 * @param {number} [maxAge] - Cookie max age in milliseconds. Defaults to env value.
 * @returns {object} Cookie options object.
 */
function getCookieConfig(maxAge) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: maxAge || parseInt(process.env.COOKIE_MAX_AGE) || 604800000,
    path: "/",
  };
}

module.exports = getCookieConfig;
