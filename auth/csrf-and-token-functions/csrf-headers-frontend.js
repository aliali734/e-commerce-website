/**
 * Builds a headers object that includes the CSRF token for fetch requests.
 * @param {string} csrfToken - The CSRF token string.
 * @returns {HeadersInit} Headers object with CSRF and Content-Type set.
 */
function buildCsrfHeaders(csrfToken) {
  return {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken,
  };
}
