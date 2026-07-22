/**
 * The backend's absolute base URL.
 *
 * For this project, frontend and backend are one single Render service
 * (same origin), so this defaults to an empty string — every
 * `${window.BACKEND_URL}/auth/...` call then naturally resolves to a
 * relative path like `/auth/...`, which is correct for same-origin.
 *
 * Only set this to a real absolute URL if you later split the frontend
 * and backend into two separate deployments.
 */
window.BACKEND_URL = window.BACKEND_URL || "";
