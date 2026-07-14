const bcrypt = require("bcryptjs");
const User = require("../../../models/user-model");

/**
 * Processes a password reset: validates the token and updates the user's password.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function resetPasswordUserProcess(req, res) {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset token is invalid or has expired.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (err) {
    console.error("Reset password process error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

module.exports = resetPasswordUserProcess;
