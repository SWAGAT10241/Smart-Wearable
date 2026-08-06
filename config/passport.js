const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if this Google account is already linked to a user
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Also check if the email is already registered via local signup
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Link Google to the existing local account
            user.googleId = profile.id;
            user.authProvider = 'google';
            await user.save();
          } else {
            // Brand new user via Google — profile completion (phone, emergency
            // contact, height, weight) still required afterward, since Google
            // doesn't provide those fields
            user = await User.create({
              username: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              authProvider: 'google',
              profileComplete: false,
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
