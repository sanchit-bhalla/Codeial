module.exports.home = function (req, res) {
  // Cookies comes in as request but going back as response
  console.log(req.cookies);

  // change cookie
  res.cookie("userId", 25);

  return res.render("home", {
    title: "Home",
  });
};
