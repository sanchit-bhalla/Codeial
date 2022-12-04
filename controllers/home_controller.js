const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
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

  // WAY 1 --> Problem Callback Hell
  // Post.find({})
  //   .populate("user")
  //   .populate({
  //     path: "comments",
  //     populate: {
  //       path: "user",
  //     },
  //   })
  //   .exec(function (err, posts) {
  //     // Fetch all Users also
  //     User.find({}, function (err, users) {
  //       return res.render("home", {
  //         title: "Codeial | Home",
  //         posts: posts,
  //         all_users: users,
  //       });
  //     });
  //   });

  // Way 2 --> Using then
  // Here then is not promise. It's just a function provided by mongoose
  // Post.find({}).populate("user").then(function())

  // Way 3 --> Using Promises
  // let posts = Post.find({}).populate("user").exec();
  // posts.then()

  // Way4 --> Using Async Await
  // Best way bcz code becomes more readable and cleaner
  // Also sort the post. Post which was created in end should be displayed on the top
  try {
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } }, // sort comments according to latest date
        populate: {
          path: "user",
        },
      });

    let users = await User.find({});

    return res.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    req.flash("error", err);
    return;
  }
};
