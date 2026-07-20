function getCookieConfig(maxAge) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: maxAge || parseInt(process.env.COOKIE_MAX_AGE) || 604800000,
    path: "/",
  };
}
module.exports = getCookieConfig;
