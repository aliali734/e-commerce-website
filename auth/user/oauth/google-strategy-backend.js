const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../../../models/user-model");

/**
 * Creates and returns the Passport Google OAuth 2.0 strategy.
 * Finds an existing user by googleId or email, or creates a new one.
 * @returns {GoogleStrategy}
 */
function createGoogleStrategy() {
  return new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/user/oauth/google/callback`,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;
        const username = profile.displayName?.replace(/\s+/g, "_").toLowerCase()
          || `user_${googleId.slice(0, 8)}`;

        // Check if user already linked this Google account
        let user = await User.findOne({ googleId });
        if (user) return done(null, user);

        // Check if user exists with same email (link accounts)
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            user.googleId = googleId;
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
          googleId,
          isActive: true,
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  );
}

module.exports = createGoogleStrategy;
