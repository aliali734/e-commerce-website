/**
 * Fetches a fresh CSRF token from the backend endpoint.
 * credentials: "include" is required here since the frontend and backend
 * are separate origins — without it, the browser won't send or store the
 * Set-Cookie response from a cross-site request.
 * @returns {Promise<string>} The CSRF token string.
 */
async function getCsrfTokenFromBackend() {
  const response = await fetch(`${window.BACKEND_URL || ""}/auth/csrf-token`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch CSRF token from backend.");
  }

  const data = await response.json();
  return data.csrfToken;
}
