const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../../models/user-model");
const getCookieConfig = require("../../csrf-and-token-functions/cookie-config-backend");

/**
 * Processes user login: verifies credentials and issues a JWT auth cookie.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function loginUserProcess(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ success: false, message: "Account is deactivated." });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "This account uses social sign-in. Please continue with Google or Facebook.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.cookie("authToken", token, getCookieConfig());

    return res.status(200).json({
      success: true,
      message: "Login successful.",
    });
  } catch (err) {
    console.error("Login process error:", err);
    return res.status(500).json({ success: false, message: "Server error during login." });
  }
}

module.exports = loginUserProcess;
