function csrfTokenMiddleware(req, res, next) {
  const tokenFromCookie = req.cookies?.csrfToken;
  const tokenFromHeader = req.headers["x-csrf-token"];
  if (!tokenFromCookie || !tokenFromHeader) {
    return res.status(403).json({ success: false, message: "CSRF token missing." });
  }
  if (tokenFromCookie !== tokenFromHeader) {
    return res.status(403).json({ success: false, message: "CSRF token mismatch." });
  }
  next();
}
module.exports = csrfTokenMiddleware;
