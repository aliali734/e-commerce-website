process.env.JWT_SECRET = "test_secret";
process.env.NODE_ENV = "test";

const express = require("express");
const cookieParser = require("cookie-parser");
const request = require("supertest");

const csrfTokenRoute = require("./csrf-token-route-backend");

function buildApp() {
  const app = express();
  app.use(cookieParser());
  app.use("/auth/csrf-token", csrfTokenRoute);
  return app;
}

describe("GET /auth/csrf-token", () => {
  let app;

  beforeEach(() => {
    app = buildApp();
  });

  test("sets a csrfToken cookie and returns it in the response body", async () => {
    const res = await request(app).get("/auth/csrf-token");
    expect(res.status).toBe(200);
    expect(res.body.csrfToken).toBeTruthy();

    const cookies = res.headers["set-cookie"] || [];
    const csrfCookie = cookies.find((c) => c.startsWith("csrfToken="));
    expect(csrfCookie).toBeTruthy();

    // The value returned in the JSON body must match the cookie's value,
    // since the frontend relies on the body (not document.cookie, which
    // it can't read cross-origin) for the X-CSRF-Token header.
    const cookieValue = csrfCookie.split(";")[0].split("=")[1];
    expect(cookieValue).toBe(res.body.csrfToken);
  });

  test("reuses an existing csrfToken cookie instead of overwriting it", async () => {
    const res = await request(app)
      .get("/auth/csrf-token")
      .set("Cookie", ["csrfToken=already-existing-token"]);

    expect(res.status).toBe(200);
    expect(res.body.csrfToken).toBe("already-existing-token");
    // No new Set-Cookie should be issued when one already exists
    const cookies = res.headers["set-cookie"] || [];
    expect(cookies.some((c) => c.startsWith("csrfToken="))).toBe(false);
  });
});
