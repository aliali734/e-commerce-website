const bcrypt = require("bcryptjs");
const Admin = require("../../../models/admin-model");

/**
 * Processes admin registration: verifies the admin secret, hashes the password,
 * and creates a new admin record.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function registerAdminProcess(req, res) {
  const { username, email, password, adminSecret } = req.body;

  try {
    if (adminSecret !== process.env.ADMIN_REGISTRATION_SECRET) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid admin secret key." });
    }

    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already registered." });
    }

    const existingUsername = await Admin.findOne({ username });
    if (existingUsername) {
      return res
        .status(409)
        .json({ success: false, message: "Username is already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await Admin.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully.",
    });
  } catch (err) {
    console.error("Admin register process error:", err);
    return res.status(500).json({ success: false, message: "Server error during registration." });
  }
}

module.exports = registerAdminProcess;
