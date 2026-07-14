const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../../../models/admin-model");
const getCookieConfig = require("../../csrf-and-token-functions/cookie-config-backend");

/**
 * Processes admin login: verifies credentials and issues a JWT admin auth cookie.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function loginAdminProcess(req, res) {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    if (!admin.isActive) {
      return res
        .status(403)
        .json({ success: false, message: "Admin account is deactivated." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin", isSuperAdmin: admin.isSuperAdmin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.cookie("adminAuthToken", token, getCookieConfig());

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
    });
  } catch (err) {
    console.error("Admin login process error:", err);
    return res.status(500).json({ success: false, message: "Server error during login." });
  }
}

module.exports = loginAdminProcess;
