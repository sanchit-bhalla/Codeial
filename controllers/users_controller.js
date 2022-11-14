const User = require("../models/user");

module.exports.profile = function (req, res) {
  console.log(req.url);

  if (req.cookies.user_id) {
    User.findById(req.cookies.user_id, function (err, user) {
      if (user) {
        return res.render("user_profile", {
          title: "User Profile",
          user: user,
        });
      } else {
        return res.redirect("/users/sign-in");
      }
    });
  } else {
    return res.redirect("/users/sign-in");
  }
};

// Render the Sign Up page
module.exports.signUp = function (req, res) {
  return res.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

// Render the Sign In page
module.exports.signIn = function (req, res) {
  return res.render("user_sign_in", {
    title: "Codeial | Sign In",
  });
};

// get the sign up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back"); // back to sign-up page
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log(
        "Error in finding user while signing up, So we will create a new user"
      );
      return;
    }

    // creating new user
    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("Error in creatig user while signing up : ", err);
          return;
        }

        return res.redirect("/users/sign-in");
      });
    } else {
      // User already exists
      return res.redirect("back"); // back to sign-up page
    }
  });
};

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
  // find the User
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("Error in finding user while signing in");
      return;
    }

    // Handle User Found
    if (user) {
      // handle password which don't match
      if (user.password != req.body.password) {
        return res.redirect("back");
      }

      // handle session creation
      res.cookie("user_id", user.id);
      return res.redirect("/users/profile");
    } else {
      // Handle User Not Found
      return res.redirect("back");
    }
  });
};

// sign out by clearing the cookie
module.exports.signOut = function (req, res) {
  res.clearCookie("user_id");

  return res.redirect("/"); // Redirect to homePage
};
