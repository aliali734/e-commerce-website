const { body, validationResult } = require("express-validator");

/**
 * Validation middleware for the user forgot-password endpoint.
 * Validates that a valid email is provided.
 * @type {import("express").RequestHandler[]}
 */
const forgotPasswordMiddleware = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }
    next();
  },
];

module.exports = forgotPasswordMiddleware;
