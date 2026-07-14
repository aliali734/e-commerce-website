/**
 * Middleware that validates the CSRF token from the request header against the cookie.
 * Rejects requests where the tokens do not match.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function csrfTokenMiddleware(req, res, next) {
  const tokenFromCookie = req.cookies?.csrfToken;
  const tokenFromHeader = req.headers["x-csrf-token"];

  if (!tokenFromCookie || !tokenFromHeader) {
    return res
      .status(403)
      .json({ success: false, message: "CSRF token missing." });
  }

  if (tokenFromCookie !== tokenFromHeader) {
    return res
      .status(403)
      .json({ success: false, message: "CSRF token mismatch." });
  }

  next();
}

module.exports = csrfTokenMiddleware;
