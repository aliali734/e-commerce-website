const jwt = require("jsonwebtoken");

/**
 * Middleware that verifies the admin JWT from the adminAuthToken cookie.
 * Rejects the request if the token is missing or invalid.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function adminAuthMiddleware(req, res, next) {
  const token = req.cookies?.adminAuthToken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. No admin token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden. Not an admin account." });
    }

    req.admin = decoded;
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Invalid or expired token." });
  }
}

module.exports = adminAuthMiddleware;
