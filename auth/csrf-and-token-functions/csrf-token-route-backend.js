const express = require("express");
const { ensureCsrfCookie } = require("./ensure-csrf-cookie-frontend");

/**
 * Express router for GET /auth/csrf-token.
 * Guarantees a csrfToken cookie exists (creating one if needed via
 * ensureCsrfCookie) and returns its value in the response body so the
 * frontend can read it even in setups where document.cookie access is
 * inconvenient, and so the frontend has an explicit way to obtain a
 * token on demand instead of only relying on it having been set by an
 * earlier same-origin page load.
 */
function createCsrfTokenRoute() {
  const router = express.Router();

  router.get("/", ensureCsrfCookie, (req, res) => {
    return res.status(200).json({ csrfToken: req.csrfToken });
  });

  return router;
}

module.exports = createCsrfTokenRoute();
