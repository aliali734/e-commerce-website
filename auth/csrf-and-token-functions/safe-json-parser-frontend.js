/**
 * Safely parses a JSON string without throwing.
 * @param {string} jsonString - The string to parse.
 * @returns {{ data: any, error: string|null }} Parsed data or an error message.
 */
function safeJsonParser(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    return { data, error: null };
  } catch (err) {
    return { data: null, error: "Invalid JSON response from server." };
  }
}
