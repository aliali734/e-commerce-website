/**
 * Reads the CSRF token directly from the csrfToken cookie set by the server.
 * @returns {string|null} The CSRF token value or null if not found.
 */
function getCsrfCookieToken() {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === "csrfToken") {
      return decodeURIComponent(value);
    }
  }
  return null;
}
