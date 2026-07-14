/**
 * Checks whether the current user has an active admin session.
 * Makes a lightweight request to the admin session-check endpoint.
 * @returns {Promise<boolean>} True if admin session is valid, false otherwise.
 */
async function checkAdminSession() {
  try {
    const response = await fetch("/auth/admin/session-check", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      return data.isAdmin === true;
    }

    return false;
  } catch {
    return false;
  }
}
