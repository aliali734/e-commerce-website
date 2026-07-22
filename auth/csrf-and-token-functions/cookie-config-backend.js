/**
 * Returns the standard cookie configuration object for auth cookies.
 *
 * Frontend and backend are one single Render service (same origin), so
 * "lax" is the right setting here — it's the standard, safe default for
 * same-origin apps and also plays nicely with OAuth redirect flows.
 *
 * @param {number} [maxAge] - Cookie max age in milliseconds. Defaults to env value.
 * @returns {object} Cookie options object.
 */
function getCookieConfig(maxAge) {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: maxAge || parseInt(process.env.COOKIE_MAX_AGE) || 604800000,
    path: "/",
  };
}
module.exports = getCookieConfig;
