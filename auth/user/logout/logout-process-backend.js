/**
 * Processes user logout by clearing the auth cookie on the server side.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
function logoutUserProcess(req, res) {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
}

module.exports = logoutUserProcess;
