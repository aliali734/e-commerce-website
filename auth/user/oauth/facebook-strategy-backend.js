const { Strategy: FacebookStrategy } = require("passport-facebook");
const User = require("../../../models/user-model");

/**
 * Creates and returns the Passport Facebook OAuth strategy.
 * Finds an existing user by facebookId or email, or creates a new one.
 * @returns {FacebookStrategy}
 */
function createFacebookStrategy() {
  return new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.FRONTEND_URL}/auth/user/oauth/facebook/callback`,
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const facebookId = profile.id;
        const username = profile.displayName?.replace(/\s+/g, "_").toLowerCase()
          || `user_${facebookId.slice(0, 8)}`;

        // Check if user already linked this Facebook account
        let user = await User.findOne({ facebookId });
        if (user) return done(null, user);

        // Check if user exists with same email (link accounts)
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            user.facebookId = facebookId;
            await user.save();
            return done(null, user);
          }
        }

        // Create new user
        const baseUsername = username;
        let finalUsername = baseUsername;
        let counter = 1;
        while (await User.findOne({ username: finalUsername })) {
          finalUsername = `${baseUsername}_${counter++}`;
        }

        user = await User.create({
          username: finalUsername,
          email: email || null,
          password: null,
          facebookId,
          isActive: true,
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  );
}

module.exports = createFacebookStrategy;
