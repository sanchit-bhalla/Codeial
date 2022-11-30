const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = async function (req, res) {
  try {
    await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    req.flash("success", "Post published");
  } catch (err) {
    req.flash("error", err);
  } finally {
    return res.redirect("back");
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
      req.flash("success", "Post and associated comments deleted");
    } else {
      req.flash("error", "You are Not Authorized !");
    }
  } catch (err) {
    req.flash("error", err);
  } finally {
    return res.redirect("back");
  }
};
