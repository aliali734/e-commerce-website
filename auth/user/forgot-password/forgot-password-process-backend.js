const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../../../models/user-model");

/**
 * Processes a forgot-password request: generates a reset token and sends a reset email.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function forgotPasswordUserProcess(req, res) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // Always return 200 to prevent user enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email is registered, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(
      Date.now() + (parseInt(process.env.RESET_TOKEN_EXPIRES_MS) || 3600000)
    );

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/auth/user/reset-password/reset-password.html?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click the link below to reset your password. It expires in 1 hour.</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    });

    return res.status(200).json({
      success: true,
      message: "If that email is registered, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password process error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

module.exports = forgotPasswordUserProcess;
