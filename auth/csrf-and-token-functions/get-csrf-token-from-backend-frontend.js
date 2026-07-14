/**
 * Fetches a fresh CSRF token from the backend endpoint.
 * @returns {Promise<string>} The CSRF token string.
 */
async function getCsrfTokenFromBackend() {
  const response = await fetch("/auth/csrf-token", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch CSRF token from backend.");
  }

  const data = await response.json();
  return data.csrfToken;
}
