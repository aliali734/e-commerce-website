const bcrypt = require("bcryptjs");
const Admin = require("../../../models/admin-model");

/**
 * Processes an admin password reset: validates the token and updates the admin's password.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function resetPasswordAdminProcess(req, res) {
  const { token, password } = req.body;

  try {
    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Reset token is invalid or has expired.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    admin.password = hashedPassword;
    admin.resetPasswordToken = null;
    admin.resetPasswordExpires = null;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Admin password has been reset successfully.",
    });
  } catch (err) {
    console.error("Admin reset password process error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

module.exports = resetPasswordAdminProcess;
