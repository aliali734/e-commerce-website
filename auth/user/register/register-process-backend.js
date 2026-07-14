const bcrypt = require("bcryptjs");
const User = require("../../../models/user-model");

/**
 * Processes user registration: hashes password and creates a new user record.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function registerUserProcess(req, res) {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already registered." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res
        .status(409)
        .json({ success: false, message: "Username is already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (err) {
    console.error("Register process error:", err);
    return res.status(500).json({ success: false, message: "Server error during registration." });
  }
}

module.exports = registerUserProcess;
