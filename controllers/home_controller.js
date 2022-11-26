const Post = require("../models/post");

module.exports.home = function (req, res) {
  // Cookies comes in as request but going back as response
  // console.log("cookies: ", req.cookies);
  // res.cookie("userId", 25); // change cookie

  // By doing this, user in the Post is just the ObjectId of User. But to show the details of user we need to populate the user details of each post having that ObjectId
  // Post.find({}, function (err, posts) {
  //   return res.render("home", {
  //     title: "Codeial | Home",
  //     posts: posts,
  //   });
  // });

  // Populate the user of each post
  Post.find({})
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })
    .exec(function (err, posts) {
      return res.render("home", {
        title: "Codeial | Home",
        posts: posts,
      });
    });
};
