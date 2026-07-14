const passport = require("passport");
const createGoogleStrategy = require("./google-strategy-backend");
const createFacebookStrategy = require("./facebook-strategy-backend");
const User = require("../../../models/user-model");

/**
 * Initializes Passport with Google and Facebook strategies,
 * and configures serialize/deserialize for session support.
 * @param {import("express").Application} app - The Express application instance.
 */
function initPassport(app) {
  passport.use(createGoogleStrategy());
  passport.use(createFacebookStrategy());

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());
}

module.exports = initPassport;
