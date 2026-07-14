const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Admin = require("../../../models/admin-model");

/**
 * Processes an admin forgot-password request: generates a reset token
 * and sends a password reset email to the admin.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function forgotPasswordAdminProcess(req, res) {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    // Always return 200 to prevent admin account enumeration
    if (!admin) {
      return res.status(200).json({
        success: true,
        message: "If that email is registered, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(
      Date.now() + (parseInt(process.env.RESET_TOKEN_EXPIRES_MS) || 3600000)
    );

    admin.resetPasswordToken = token;
    admin.resetPasswordExpires = expires;
    await admin.save();

    const resetUrl = `${process.env.FRONTEND_URL}/auth/admin/reset-password/reset-password.html?token=${token}`;

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
      to: admin.email,
      subject: "Admin Password Reset Request",
      html: `<p>A password reset was requested for your admin account. Click below to reset it. The link expires in 1 hour.</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>If you did not request this, please ignore this email and secure your account.</p>`,
    });

    return res.status(200).json({
      success: true,
      message: "If that email is registered, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Admin forgot password process error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

module.exports = forgotPasswordAdminProcess;
