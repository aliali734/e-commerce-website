function logoutAdminProcess(req, res) {
  res.clearCookie("adminAuthToken", {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/",
  });
  return res.status(200).json({ success: true, message: "Admin logged out successfully." });
}
module.exports = logoutAdminProcess;
