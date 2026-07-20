const { body, validationResult } = require("express-validator");
const adminForgotPasswordMiddleware = [
  body("email").trim().isEmail().withMessage("Please provide a valid email address.").normalizeEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }
    next();
  },
];
module.exports = adminForgotPasswordMiddleware;
