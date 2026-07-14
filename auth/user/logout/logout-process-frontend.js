/**
 * Handles the user logout process on the client side.
 * Sends a logout request to the backend, then clears session data and redirects.
 */
async function handleLogout() {
  const csrfToken = getCsrfCookieToken();

  try {
    await fetch("/auth/user/logout", {
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
    forceLogout("/auth/user/login/login.html");
  }
}

// Trigger logout as soon as this page loads
handleLogout();
