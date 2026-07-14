/**
 * Displays a UI message (success or error) in a designated element.
 * @param {string} message - The message text to display.
 * @param {"success"|"error"|"info"} type - The type of message.
 * @param {string} [containerId="ui-message"] - The ID of the container element.
 */
function showUiMessage(message, type = "info", containerId = "ui-message") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.textContent = message;
  container.className = "";
  container.classList.add("ui-message", `ui-message--${type}`);
  container.style.display = "block";

  if (type === "success") {
    setTimeout(() => {
      container.style.display = "none";
    }, 4000);
  }
}
