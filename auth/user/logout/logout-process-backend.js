function logoutUserProcess(req, res) {
  res.clearCookie("authToken", {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/",
  });
  return res.status(200).json({ success: true, message: "Logged out successfully." });
}
module.exports = logoutUserProcess;
