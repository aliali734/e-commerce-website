/**
 * The backend's absolute base URL.
 *
 * Frontend (GitHub Pages) and backend (Render) are genuinely separate
 * origins, so every fetch() call from the frontend must target this
 * absolute URL — a relative path like fetch("/auth/user/login") would
 * hit GitHub Pages' own static server instead of the backend, and 404.
 */
window.BACKEND_URL = window.BACKEND_URL || "https://e-commerce-website-j3yr.onrender.com";
