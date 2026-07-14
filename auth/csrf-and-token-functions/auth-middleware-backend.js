const jwt = require("jsonwebtoken");

/**
 * Middleware to verify a JWT from the request cookie and attach the payload to req.user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function authMiddleware(req, res, next) {
  const token = req.cookies?.authToken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Invalid or expired token." });
  }
}

module.exports = authMiddleware;
