/**
 * Handles the admin reset-password form submission on the client side.
 * Reads the token from the URL, validates the new password, and sends it to the backend.
 */
async function handleAdminResetPasswordSubmit() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const btn = document.getElementById("resetBtn");

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (!token) {
    showUiMessage("Invalid or missing reset token.", "error");
    return;
  }

  if (!password || !confirmPassword) {
    showUiMessage("Both password fields are required.", "error");
    return;
  }

  if (password !== confirmPassword) {
    showUiMessage("Passwords do not match.", "error");
    return;
  }

  if (password.length < 8) {
    showUiMessage("Password must be at least 8 characters.", "error");
    return;
  }

  let csrfToken;
  try {
    csrfToken = await getOrFetchCsrfToken();
  } catch {
    showUiMessage("Could not reach the server. Please try again.", "error");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Resetting...";

  try {
    const response = await fetch(`${window.BACKEND_URL}/auth/admin/reset-password`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ token, password }),
    });

    if (response.status === 403) {
      clearCachedCsrfToken();
    }

    const { data, error } = safeJsonParser(await response.text());

    if (error || !data) {
      showUiMessage("Unexpected server response.", "error");
      return;
    }

    if (data.success) {
      showUiMessage("Password reset! Redirecting to login...", "success");
      setTimeout(() => {
        window.location.href = "../login/login.html";
      }, 2000);
    } else {
      showUiMessage(data.message || "Reset failed.", "error");
    }
  } catch {
    showUiMessage("Network error. Please try again.", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Reset Password";
  }
}

document.getElementById("resetBtn").addEventListener("click", handleAdminResetPasswordSubmit);
