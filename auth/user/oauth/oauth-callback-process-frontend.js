/**
 * Reads the OAuth result from the URL query params and either
 * redirects the user to the dashboard on success or shows an error.
 */
function handleOAuthCallbackResult() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  const error = params.get("error");

  const spinner = document.getElementById("spinner");
  const title = document.getElementById("title");
  const subtitle = document.getElementById("subtitle");

  if (status === "success") {
    sessionStorage.setItem("isLoggedIn", "true");
    title.textContent = "Sign in successful!";
    subtitle.textContent = "Redirecting you now...";
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1200);
    return;
  }

  // Show error state
  spinner.style.display = "none";

  const errorIcon = document.createElement("div");
  errorIcon.className = "error-icon";
  errorIcon.textContent = "⚠️";
  document.getElementById("card").prepend(errorIcon);

  if (error === "auth_failed") {
    title.textContent = "Authentication failed";
    subtitle.textContent = "We could not verify your account. Please try again.";
  } else if (error === "oauth_failed") {
    title.textContent = "Sign in cancelled";
    subtitle.textContent = "The sign in was cancelled or failed. Please try again.";
  } else {
    title.textContent = "Something went wrong";
    subtitle.textContent = "Please go back and try again.";
  }

  setTimeout(() => {
    window.location.href = "/auth/user/login/login.html";
  }, 3000);
}

handleOAuthCallbackResult();
