/**
 * Handles the admin registration form submission on the client side.
 * Validates inputs, sends data to the backend, and displays feedback.
 */
async function handleAdminRegisterSubmit() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const adminSecret = document.getElementById("adminSecret").value;
  const btn = document.getElementById("registerBtn");

  if (!username || !email || !password || !confirmPassword || !adminSecret) {
    showUiMessage("All fields are required.", "error");
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

  const csrfToken = getCsrfCookieToken();
  if (!csrfToken) {
    showUiMessage("Security token missing. Please refresh the page.", "error");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Creating account...";

  try {
    const response = await fetch("/auth/admin/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ username, email, password, adminSecret }),
    });

    const { data, error } = safeJsonParser(await response.text());

    if (error || !data) {
      showUiMessage("Unexpected server response.", "error");
      return;
    }

    if (data.success) {
      showUiMessage("Admin account created! Redirecting to login...", "success");
      setTimeout(() => {
        window.location.href = "../login/login.html";
      }, 2000);
    } else {
      showUiMessage(data.message || "Registration failed.", "error");
    }
  } catch {
    showUiMessage("Network error. Please try again.", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Create Admin Account";
  }
}

// Init
autoRedirectIfLoggedIn("/admin/dashboard");
document.getElementById("registerBtn").addEventListener("click", handleAdminRegisterSubmit);
