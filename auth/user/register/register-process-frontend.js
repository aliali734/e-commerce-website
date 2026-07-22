/**
 * Handles the user registration form submission on the client side.
 * Validates inputs, sends data to the backend, and displays feedback.
 */
async function handleRegisterSubmit() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const btn = document.getElementById("registerBtn");

  if (!username || !email || !password || !confirmPassword) {
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

  let csrfToken;
  try {
    csrfToken = await getOrFetchCsrfToken();
  } catch {
    showUiMessage("Could not reach the server. Please try again.", "error");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Creating account...";

  try {
    const response = await fetch(`${window.BACKEND_URL}/auth/user/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ username, email, password }),
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
      showUiMessage("Account created! Redirecting to login...", "success");
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
    btn.textContent = "Create Account";
  }
}

// Init
autoRedirectIfLoggedIn("/dashboard");
document.getElementById("registerBtn").addEventListener("click", handleRegisterSubmit);
