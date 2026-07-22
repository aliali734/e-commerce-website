/**
 * Handles the admin logout process on the client side.
 * Sends a logout request to the backend, then clears session data and redirects.
 */
async function handleAdminLogout() {
  let csrfToken = null;
  try {
    csrfToken = await getOrFetchCsrfToken();
  } catch {
    // Continue with client-side logout even if we can't reach the backend
  }

  try {
    await fetch(`${window.BACKEND_URL}/auth/admin/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken || "",
      },
    });
  } catch {
    // Continue with client-side logout even if the request fails
  } finally {
    forceLogout("/auth/admin/login/login.html");
  }
}

// Trigger logout as soon as this page loads
handleAdminLogout();
