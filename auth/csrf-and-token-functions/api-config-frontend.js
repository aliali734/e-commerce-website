/**
 * The backend's absolute base URL.
 *
 * Frontend and backend are deployed as two separate services, so every
 * fetch() call from the frontend must target this absolute URL — a
 * relative path like fetch("/auth/user/login") would hit the frontend's
 * own server instead of the backend, and 404.
 *
 * Set this to your backend's real Render URL once you deploy, e.g.:
 *   window.BACKEND_URL = "https://your-backend.onrender.com";
 */
window.BACKEND_URL = window.BACKEND_URL || "http://localhost:3000";
