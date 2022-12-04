const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    // If it's AJAX request
    // Type of AJAX request is XMLHttpRequest (xhr)
    if (req.xhr) {
      // populate user so that we can send the user details also in ajax request
      // NOTE: Do not send password
      let postWithUser = await post.populate("user", "email name"); // populate only email and name
      return res.status(200).json({
        data: {
          post: postWithUser,
        },
        message: "Post created!",
      });
    }

    req.flash("success", "Post published");
    return res.redirect("back");
  } catch (err) {
    req.flash("error", err);
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

      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: "Post deleted",
        });
      }

      req.flash("success", "Post and associated comments deleted");
      return res.redirect("back");
    } else {
      req.flash("error", "You are Not Authorized !");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};
