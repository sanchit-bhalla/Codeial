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
