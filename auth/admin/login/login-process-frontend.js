/**
 * Handles the admin login form submission on the client side.
 * Validates inputs, sends credentials to the backend, and handles the response.
 */
async function handleAdminLoginSubmit() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const btn = document.getElementById("loginBtn");

  if (!email || !password) {
    showUiMessage("Email and password are required.", "error");
    return;
  }

  const csrfToken = getCsrfCookieToken();
  if (!csrfToken) {
    showUiMessage("Security token missing. Please refresh the page.", "error");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Signing in...";

  try {
    const response = await fetch("/auth/admin/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ email, password }),
    });

    const { data, error } = safeJsonParser(await response.text());

    if (error || !data) {
      showUiMessage("Unexpected server response.", "error");
      return;
    }

    if (data.success) {
      sessionStorage.setItem("isLoggedIn", "true");
      showUiMessage("Login successful! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 1500);
    } else {
      showUiMessage(data.message || "Login failed.", "error");
    }
  } catch {
    showUiMessage("Network error. Please try again.", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Sign In";
  }
}

// Init
autoRedirectIfLoggedIn("/admin/dashboard");
document.getElementById("loginBtn").addEventListener("click", handleAdminLoginSubmit);
