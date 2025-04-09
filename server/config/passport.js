const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email.toLowerCase() });
          if (!user) {
            return done(null, false, {
              message: "Incorrect email or password.",
            });
          }

          if (!user.password) {
            return done(null, false, {
              message:
                "You registered using a social account. Please log in with that method or set a password.",
            });
          }

          const isMatch = await user.matchPassword(password);
          if (!isMatch) {
            return done(null, false, {
              message: "Incorrect email or password.",
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"],
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        const { state } = req.query;
        const redirectUrl = state ? decodeURIComponent(state) : "/";

        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatarUrl: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user, { redirectUrl });
          } else {
            user = await User.findOne({ email: newUser.email });
            if (user) {
              user.googleId = newUser.googleId;
              user.avatarUrl = user.avatarUrl || newUser.avatarUrl;
              user.name = user.name || newUser.name;
              await user.save();
              return done(null, user, { redirectUrl });
            } else {
              user = await User.create(newUser);
              return done(null, user, { redirectUrl });
            }
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ["user:email"],
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        const { state } = req.query;
        const redirectUrl = state ? decodeURIComponent(state) : "/";

        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

        if (!email) {
          return done(null, false, {
            message:
              "GitHub profile does not have a public email. Please add one or use another login method.",
          });
        }

        const newUser = {
          githubId: profile.id,
          name: profile.displayName || profile.username,
          email: email,
          avatarUrl: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({ githubId: profile.id });

          if (user) {
            return done(null, user, { redirectUrl });
          } else {
            user = await User.findOne({ email: newUser.email });
            if (user) {
              user.githubId = newUser.githubId;
              user.avatarUrl = user.avatarUrl || newUser.avatarUrl;
              user.name = user.name || newUser.name;
              await user.save();
              return done(null, user, { redirectUrl });
            } else {
              user = await User.create(newUser);
              return done(null, user, { redirectUrl });
            }
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
