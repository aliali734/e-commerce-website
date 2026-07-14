/**
 * A wrapper around fetch() that automatically includes credentials and the CSRF token.
 * Redirects to login if a 401 response is received.
 * @param {string} url - The endpoint URL.
 * @param {RequestInit} [options={}] - Additional fetch options.
 * @returns {Promise<Response>} The fetch response.
 */
async function authProtectedFetch(url, options = {}) {
  const csrfToken =
    document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("csrfToken="))
      ?.split("=")[1] || "";

  const defaultHeaders = {
    "Content-Type": "application/json",
    "X-CSRF-Token": decodeURIComponent(csrfToken),
  };

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    sessionStorage.clear();
    window.location.href = "/auth/user/login/login.html";
  }

  return response;
}
