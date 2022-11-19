const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

// authentication using passport
// The local authentication strategy authenticates users using a username and password. The strategy requires a verify callback, which accepts these credentials and calls done providing a user.
// done reports back to the passportJs - ?
// 1st parameter of done is err. If there is no err, pass null
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    function (email, password, done) {
      // find a User and establish the identity
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          console.log("Error in finding user ---> Passport");
          return done(err);
        }

        if (!user || user.password != password) {
          console.log("Invalid Username/Password");
          return done(null, false);
        }

        console.log("Returing user to serializeUser");
        return done(null, user); // return user to serializeUser
      });
    }
  )
);

// serializing the user to decide which key is to be kept in the cookies
// when user signed in -> we find the id and send it in the cookie
passport.serializeUser(function (user, done) {
  console.log("Inside serializeUser");
  done(null, user.id); // store the user id in the session cookie which is encrypted using express-session
});

// deserializing the user from the key in the cookies
// When browser makes the request, it sends back the cookie(userId), so we need to deserialize it
passport.deserializeUser(function (id, done) {
  console.log("Inside deserializeUser");
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding user --> Passport");
      return done(err);
    }

    return done(null, user);
  });
});

// check if user is authenticated
// e.g If user opens profile page, we first need to check whether user is authenticated or not
passport.checkAuthentication = function (req, res, next) {
  // if user is signed in, then pass on the req to the next function i.e controller's action
  if (req.isAuthenticated()) {
    // isAuthenticated() -> added by passport in the req
    return next();
  }

  // if user is not signed in
  return res.redirect("/users/sign-in");
};

// To pass the user data to the views(e.g Profile Page), we need to set signed in user to the locals
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed-in user from the session cookie and we are just sending this to the locals for the views
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
