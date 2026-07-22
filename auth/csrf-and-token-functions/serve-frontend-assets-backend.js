const path = require("path");
const fs = require("fs");

const PROJECT_ROOT = path.join(__dirname, "..");

// Only these file types are ever servable to the browser. Anything else
// (including every *-backend.js file, models/, db.js, package.json, etc.)
// is never reachable over HTTP, even though it lives in the same folders
// as the frontend files for the project's one-function-per-file convention.
const ALLOWED_EXTENSIONS = [".html", ".css"];
const ALLOWED_SUFFIX = "-frontend.js";

function isServableFrontendFile(filePath) {
  const ext = path.extname(filePath);
  if (ALLOWED_EXTENSIONS.includes(ext)) return true;
  if (filePath.endsWith(ALLOWED_SUFFIX)) return true;
  return false;
}

/**
 * Middleware that serves only frontend assets (HTML, CSS, and
 * *-frontend.js files) from anywhere in the project, while refusing to
 * serve backend-only files that happen to live in the same folders.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function serveFrontendAssets(req, res, next) {
  if (req.method !== "GET" && req.method !== "HEAD") return next();

  // Resolve against the project root and reject any path that escapes it
  // (blocks ../.. traversal attempts).
  const requestedPath = path.normalize(req.path).replace(/^(\.\.[/\\])+/, "");
  const absolutePath = path.join(PROJECT_ROOT, requestedPath);

  if (!absolutePath.startsWith(PROJECT_ROOT)) return next();
  if (!isServableFrontendFile(absolutePath)) return next();

  fs.stat(absolutePath, (err, stats) => {
    if (err || !stats.isFile()) return next();
    res.sendFile(absolutePath);
  });
}

module.exports = serveFrontendAssets;
