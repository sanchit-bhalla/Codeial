const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = function (req, res) {
  Post.create(
    {
      content: req.body.content,
      user: req.user._id,
    },
    function (err, post) {
      if (err) {
        console.log("error in creating a post");
        return;
      }

      return res.redirect("back");
    }
  );
};

module.exports.destroy = function (req, res) {
  // ../destroy/post/:id => route
  Post.findById(req.params.id, function (err, post) {
    // check whether logged In user and the user who tries to delete the post are same or not
    // post.user refers the object Id of user until we populate it(as we did in home_controller)
    // We should compare with string form of objectId
    if (post.user == req.user.id) {
      //.id means converting the ObjectId into String --> provided by mongoose
      post.remove();

      Comment.deleteMany({ post: req.params.id }, function (err) {
        // only 1 parameter i.e err bcz it can't return the deleted comments as they are deleted
        return res.redirect("back");
      });
    } else {
      return res.redirect("back");
    }
  });
};
