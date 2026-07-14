/**
 * Forces a client-side logout by clearing session storage and redirecting to login.
 * @param {string} [loginUrl="/auth/user/login/login.html"] - The login page URL.
 */
function forceLogout(loginUrl = "/auth/user/login/login.html") {
  sessionStorage.clear();
  localStorage.removeItem("isLoggedIn");
  window.location.href = loginUrl;
}
