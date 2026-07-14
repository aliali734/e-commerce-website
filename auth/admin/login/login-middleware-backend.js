const { body, validationResult } = require("express-validator");

/**
 * Validation middleware for the admin login endpoint.
 * Validates email and password fields.
 * @type {import("express").RequestHandler[]}
 */
const adminLoginMiddleware = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),

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

module.exports = adminLoginMiddleware;
