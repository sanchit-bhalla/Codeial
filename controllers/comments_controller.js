const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = function (req, res) {
  Post.findById(req.body.post, function (err, post) {
    // If Post found, only then create the comment bcz we need to add comment in the Post also
    if (post) {
      Comment.create(
        {
          content: req.body.content,
          post: req.body.post, // or post._id
          user: req.user._id,
        },
        function (err, comment) {
          // handle error

          // Updating post
          // Add comment in the post also to which it belongs to
          post.comments.push(comment); // It will automatically pushes comment's ObjectId to the post
          post.save(); // Whenever we update schema, we need to save that also

          res.redirect("/");
        }
      );
    }
  });
};
