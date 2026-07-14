/**
 * Redirects the user to a dashboard if they are already logged in.
 * Checks for the presence of a session cookie or auth flag.
 * @param {string} [redirectUrl="/dashboard"] - Where to redirect if logged in.
 */
function autoRedirectIfLoggedIn(redirectUrl = "/dashboard") {
  const isLoggedIn =
    document.cookie.split(";").some((c) => c.trim().startsWith("session=")) ||
    sessionStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    window.location.href = redirectUrl;
  }
}
