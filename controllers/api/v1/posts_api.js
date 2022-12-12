const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.index = async function (req, res) {
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

  return res.status(200).json({
    message: "List of Posts",
    posts: posts,
  });
};

module.exports.destroy = async function (req, res) {
  try {
    // ../destroy/post/:id => route
    let post = await Post.findById(req.params.id);

    // check whether logged In user and the user who write this post are same or not
    // post.user refers the object Id of user until we populate it(as we did in home_controller)
    // We should compare with string form of objectId
    // if (post.user == req.user.id) {
    //.id means converting the ObjectId into String --> provided by mongoose
    post.remove();

    await Comment.deleteMany({ post: req.params.id });

    return res.json(200, {
      message: "Post and associated comments deleted successfully!",
    });
    // } else {
    //   req.flash("error", "You are Not Authorized !");
    //   return res.redirect("back");
    // }
  } catch (err) {
    // req.flash("error", err);
    // return res.redirect("back");
    console.log("*****", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
