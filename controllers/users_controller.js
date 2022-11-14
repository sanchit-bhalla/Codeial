const User = require("../models/user");

module.exports.profile = function (req, res) {
  console.log(req.url);
  return res.render("user_profile", {
    title: "Profile Page",
  });
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
        "Error in finding user while signing up, So we will create a new user. Err : ",
        err
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
  // TODO later
};
