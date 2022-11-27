const User = require("../models/user");

module.exports.profile = function (req, res) {
  console.log(req.url);
  User.findById(req.params.id, function (err, user) {
    return res.render("user_profile", {
      title: "Profile Page",
      profile_user: user,
    });
  });
};

module.exports.update = function (req, res) {
  // If logged In user tries to update his own profile, only then it is possible
  if (req.user.id == req.params.id) {
    // User.findByIdAndUpdate(req.params.id, {name: req.body.name, email: req.body.email}, function(err, user){
    //   ...
    // })

    // 2nd Way -->  Instead of {name: req.body.name, email: req.body.email}; we could write req.body
    User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
      return res.redirect("back");
    });
  } else {
    return res.status(401).send("Unauthorized");
  }
};

// Render the Sign Up page
module.exports.signUp = function (req, res) {
  // If user is authenticated(logged in) no need of sign up again. So redirect the user to profile page
  if (req.isAuthenticated()) {
    // isAuthenticated() is added by passport and is available globally. So we can use it in controllers also.
    return res.redirect("/users/profile");
  }

  return res.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

// Render the Sign In page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    // If user is authenticated(already Signed In) no need of showing sign in page again. So redirect the user to the profile page
    return res.redirect("/users/profile");
  }

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
  // when passport js authenticate the user, the control comes here and we will redirect user to the homepage
  return res.redirect("/");
};

// Sign Out
module.exports.destroySession = function (req, res) {
  // This function is provided by passportJs.
  req.logout(function (err) {
    if (err) {
      console.log("Error while logging out :(");
      return res.redirect("back");
    }

    return res.redirect("/"); // redirect to homepage
  });
};
