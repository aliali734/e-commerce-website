const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const { connectDatabase } = require("./db");

// User routes
const userRegisterRoute = require("./auth/user/register/register-route-backend");
const userLoginRoute = require("./auth/user/login/login-route-backend");
const userForgotPasswordRoute = require("./auth/user/forgot-password/forgot-password-route-backend");
const userResetPasswordRoute = require("./auth/user/reset-password/reset-password-route-backend");
const userLogoutRoute = require("./auth/user/logout/logout-route-backend");

// Admin routes
const adminRegisterRoute = require("./auth/admin/register/register-route-backend");
const adminLoginRoute = require("./auth/admin/login/login-route-backend");
const adminForgotPasswordRoute = require("./auth/admin/forgot-password/forgot-password-route-backend");
const adminResetPasswordRoute = require("./auth/admin/reset-password/reset-password-route-backend");
const adminLogoutRoute = require("./auth/admin/logout/logout-route-backend");

// OAuth
const oAuthRoute = require("./auth/user/oauth/oauth-route-backend");
const initPassport = require("./auth/user/oauth/passport-init-backend");

// CSRF
const { ensureCsrfCookie } = require("./auth/csrf-and-token-functions/ensure-csrf-cookie-frontend");
const csrfTokenRoute = require("./auth/csrf-and-token-functions/csrf-token-route-backend");
const serveFrontendAssets = require("./auth/csrf-and-token-functions/serve-frontend-assets-backend");

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Security middleware
  app.use(helmet());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
      credentials: true,
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
  app.use(limiter);

  // Session (required by Passport for OAuth temporary state)
  // Backed by MongoDB instead of the default in-memory store, which leaks
  // memory and doesn't survive restarts or work across multiple instances.
  app.use(
    session({
      secret: process.env.COOKIE_SECRET || "changeme",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: "sessions",
        ttl: 10 * 60, // seconds — matches the cookie maxAge below
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 10 * 60 * 1000, // 10 minutes — only needed during OAuth handshake
      },
    })
  );

  // Passport (OAuth strategies)
  initPassport(app);

  // CSRF cookie on all GET requests
  app.use(ensureCsrfCookie);
  app.use("/auth/csrf-token", csrfTokenRoute);

  // Static files — auth/ lives at the project root, mixed with backend
  // files, so we can't use plain express.static() without risking exposing
  // *-backend.js source. This only serves html/css/*-frontend.js.
  app.use(serveFrontendAssets);

  // User auth routes
  app.use("/auth/user/register", userRegisterRoute);
  app.use("/auth/user/login", userLoginRoute);
  app.use("/auth/user/forgot-password", userForgotPasswordRoute);
  app.use("/auth/user/reset-password", userResetPasswordRoute);
  app.use("/auth/user/logout", userLogoutRoute);
  app.use("/auth/user/oauth", oAuthRoute);

  // Admin auth routes
  app.use("/auth/admin/register", adminRegisterRoute);
  app.use("/auth/admin/login", adminLoginRoute);
  app.use("/auth/admin/forgot-password", adminForgotPasswordRoute);
  app.use("/auth/admin/reset-password", adminResetPasswordRoute);
  app.use("/auth/admin/logout", adminLogoutRoute);

  // DB connect then listen
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }

  return app;
}

startServer();
