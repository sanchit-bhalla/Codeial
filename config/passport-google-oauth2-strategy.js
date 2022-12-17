const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");

// tell passport to use a new strategy for google login
passport.use(
  new googleStrategy(
    {
      clientID:
        "482615347695-rf3nkk8r5iqr55p1g0d984ultrbg5lv6.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      console.log(accessToken, refreshToken);

      // find a user
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        if (err) {
          console.log("Error in google strategy-passport", err);
          return;
        }

        if (user) {
          // if user found, set it as req.user i.e Sign In the user
          return done(null, user);
        } else {
          // if user not found, create a new user and set it as req.user i.e Sign In the user
          User.create(
            {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"), // Bcz google will not send us the password an since we need password to create user in database, we use this crypto for generating random password
            },
            function (err, user) {
              if (err) {
                console.log(
                  "Error in creating user google strategy-passport",
                  err
                );
                return;
              }

              return done(null, user);
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
