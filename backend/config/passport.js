const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
  process.env;

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL:
          GOOGLE_CALLBACK_URL ||
          `${process.env.SERVER_URL || "http://localhost:3000"}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;

          let user = await User.findOne({
            $or: [{ googleId: profile.id }, ...(email ? [{ email }] : [])],
          });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              username: profile.displayName,
              email,
              authProvider: "google",
              profileComplete: false,
            });
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      },
    ),
  );
} else {
  console.warn(
    "Google OAuth disabled: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not configured.",
  );
}

module.exports = passport;
