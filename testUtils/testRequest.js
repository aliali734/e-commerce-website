/**
 * Wraps a supertest agent so every request automatically carries a
 * matching CSRF cookie + header, the way a real browser session would
 * after ensureCsrfCookie ran on a GET request.
 */
function withCsrf(agent, method, url) {
  const csrfToken = "test-csrf-token";
  return agent[method](url)
    .set("Cookie", [`csrfToken=${csrfToken}`])
    .set("X-CSRF-Token", csrfToken);
}

module.exports = { withCsrf };
