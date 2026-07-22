/**
 * Caches the CSRF token in memory for the lifetime of the page.
 * We deliberately do NOT read this from document.cookie: the cookie
 * belongs to the backend's origin, and frontend JS running on a
 * different origin can never see it there. The token value itself comes
 * from the JSON body of GET /auth/csrf-token instead. The cookie still
 * travels automatically with each request (that's what sameSite: "none"
 * on the backend is for) — this cached value is only used for the
 * X-CSRF-Token header side of the double-submit check.
 */
let cachedCsrfToken = null;

/**
 * Returns a usable CSRF token, fetching one from the backend if we don't
 * already have one cached for this page load.
 * @returns {Promise<string>} The CSRF token string.
 */
async function getOrFetchCsrfToken() {
  if (cachedCsrfToken) return cachedCsrfToken;

  cachedCsrfToken = await getCsrfTokenFromBackend();
  return cachedCsrfToken;
}

/**
 * Clears the cached token, e.g. after a 403 CSRF mismatch, so the next
 * call fetches a fresh one instead of retrying with a stale value.
 */
function clearCachedCsrfToken() {
  cachedCsrfToken = null;
}
