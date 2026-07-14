/**
 * Handles the admin forgot-password form submission on the client side.
 * Sends the admin's email to the backend to trigger a password reset email.
 */
async function handleAdminForgotPasswordSubmit() {
  const email = document.getElementById("email").value.trim();
  const btn = document.getElementById("forgotBtn");

  if (!email) {
    showUiMessage("Please enter your admin email address.", "error");
    return;
  }

  const csrfToken = getCsrfCookieToken();
  if (!csrfToken) {
    showUiMessage("Security token missing. Please refresh the page.", "error");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Sending...";

  try {
    const response = await fetch("/auth/admin/forgot-password", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ email }),
    });

    const { data, error } = safeJsonParser(await response.text());

    if (error || !data) {
      showUiMessage("Unexpected server response.", "error");
      return;
    }

    showUiMessage(
      "If that email is registered, a reset link has been sent.",
      "success"
    );
  } catch {
    showUiMessage("Network error. Please try again.", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Send Reset Link";
  }
}

document
  .getElementById("forgotBtn")
  .addEventListener("click", handleAdminForgotPasswordSubmit);
