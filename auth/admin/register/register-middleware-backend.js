const { body, validationResult } = require("express-validator");
const adminRegisterMiddleware = [
  body("username").trim().isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters.")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores."),
  body("email").trim().isEmail().withMessage("Please provide a valid email address.").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter.")
    .matches(/[0-9]/).withMessage("Password must contain at least one number.")
    .matches(/[^a-zA-Z0-9]/).withMessage("Password must contain at least one special character."),
  body("adminSecret").notEmpty().withMessage("Admin secret key is required."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
    }
    next();
  },
];
module.exports = adminRegisterMiddleware;
