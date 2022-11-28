const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = async function (req, res) {
  try {
    await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    return res.redirect("back");
  } catch (err) {
    console.log("error in creating a post: ", err);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    // ../destroy/post/:id => route
    let post = await Post.findById(req.params.id);

    // check whether logged In user and the user who write this post are same or not
    // post.user refers the object Id of user until we populate it(as we did in home_controller)
    // We should compare with string form of objectId
    if (post.user == req.user.id) {
      //.id means converting the ObjectId into String --> provided by mongoose
      post.remove();

      await Comment.deleteMany({ post: req.params.id });
      return res.redirect("back");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log("error in deleting a post: ", err);
    return;
  }
};
