const { body, validationResult } = require("express-validator");

/**
 * Validation middleware for the admin reset-password endpoint.
 * Validates the reset token and the new password with stricter admin rules.
 * @type {import("express").RequestHandler[]}
 */
const adminResetPasswordMiddleware = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("Reset token is required."),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number.")
    .matches(/[^a-zA-Z0-9]/)
    .withMessage("Password must contain at least one special character."),

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

module.exports = adminResetPasswordMiddleware;
