/**
 * Handles OAuth authentication failures.
 * Redirects the user to the OAuth callback page with an error flag.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
function handleOAuthFailure(req, res) {
  return res.redirect(
    "/auth/user/oauth/oauth-callback-frontend.html?error=oauth_failed"
  );
}

module.exports = handleOAuthFailure;
