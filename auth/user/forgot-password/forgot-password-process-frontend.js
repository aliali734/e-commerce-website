/**
 * Handles the forgot-password form submission on the client side.
 * Sends the user's email to the backend to trigger a password reset email.
 */
async function handleForgotPasswordSubmit() {
  const email = document.getElementById("email").value.trim();
  const btn = document.getElementById("forgotBtn");

  if (!email) {
    showUiMessage("Please enter your email address.", "error");
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
  btn.textContent = "Sending...";

  try {
    const response = await fetch(`${window.BACKEND_URL}/auth/user/forgot-password`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ email }),
    });

    if (response.status === 403) {
      clearCachedCsrfToken();
    }

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
  .addEventListener("click", handleForgotPasswordSubmit);
