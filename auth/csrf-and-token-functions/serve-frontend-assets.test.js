const fs = require("fs");
const path = require("path");
const os = require("os");
const express = require("express");
const request = require("supertest");

const serveFrontendAssets = require("./serve-frontend-assets-backend");

describe("serveFrontendAssets middleware", () => {
  let tmpRoot;
  let app;

  beforeAll(() => {
    // Build a throwaway folder structure that mimics auth/user/login/
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "frontend-test-"));
    fs.mkdirSync(path.join(tmpRoot, "auth", "user", "login"), { recursive: true });
    fs.writeFileSync(path.join(tmpRoot, "auth", "user", "login", "login.html"), "<html>login</html>");
    fs.writeFileSync(path.join(tmpRoot, "auth", "user", "login", "login.css"), "body{}");
    fs.writeFileSync(
      path.join(tmpRoot, "auth", "user", "login", "login-process-frontend.js"),
      "console.log('frontend');"
    );
    fs.writeFileSync(
      path.join(tmpRoot, "auth", "user", "login", "login-process-backend.js"),
      "module.exports = function loginUserProcess() { /* secrets */ };"
    );
    fs.writeFileSync(path.join(tmpRoot, "db.js"), "module.exports = { secret: true };");
  });

  afterAll(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  beforeEach(() => {
    jest.resetModules();
    jest.doMock("path", () => {
      const actualPath = jest.requireActual("path");
      return {
        ...actualPath,
        join: (...args) => {
          if (args[1] === "..") return tmpRoot;
          return actualPath.join(...args);
        },
      };
    });
    const freshServeFrontendAssets = require("./serve-frontend-assets-backend");
    app = express();
    app.use(freshServeFrontendAssets);
    app.use((req, res) => res.status(404).json({ notFound: true }));
  });

  afterEach(() => {
    jest.dontMock("path");
  });

  test("serves an .html file", async () => {
    const res = await request(app).get("/auth/user/login/login.html");
    expect(res.status).toBe(200);
    expect(res.text).toContain("login");
  });

  test("serves a .css file", async () => {
    const res = await request(app).get("/auth/user/login/login.css");
    expect(res.status).toBe(200);
  });

  test("serves a *-frontend.js file", async () => {
    const res = await request(app).get("/auth/user/login/login-process-frontend.js");
    expect(res.status).toBe(200);
    expect(res.text).toContain("frontend");
  });

  test("refuses to serve a *-backend.js file", async () => {
    const res = await request(app).get("/auth/user/login/login-process-backend.js");
    expect(res.status).toBe(404);
    expect(res.body.notFound).toBe(true);
  });

  test("refuses to serve db.js", async () => {
    const res = await request(app).get("/db.js");
    expect(res.status).toBe(404);
  });

  test("refuses a path traversal attempt", async () => {
    const res = await request(app).get("/auth/user/login/../../../db.js");
    expect(res.status).toBe(404);
  });
});
