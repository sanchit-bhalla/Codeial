const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require("../mailers/comments_mailer");
const Like = require("../models/like");
const queue = require("../config/kue");
const commmentEmailWorker = require("../worker/comment_email_worker");

module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);

    // If Post found, only then create the comment bcz we need to add comment in the Post also
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post, // or post._id
        user: req.user._id,
      });

      // Updating post
      // Add comment in the post also to which it belongs to
      post.comments.push(comment); // It will automatically pushes comment's ObjectId to the post
      post.save(); // Whenever we update schema, we need to save that also

      // populate user name and post id so that we can send the user details also in ajax request
      // NOTE: Do not send user's password
      let populatedComment = await comment.populate("user", "email name");

      // Sending mail
      // WAY 1 : It will try to send immediately and will increase load on CPU. However we can send email after some time also i.e as a delayed job
      // commentsMailer.newComment(populatedComment);

      // WAY2: Send as delayed job
      // If queue not present it will create new queue else enquee in previous queue
      let job = queue.create("emails", populatedComment).save(function (err) {
        if (err) {
          console.log("Error in creating a queue", err);
          return;
        }

        console.log("job enqueued", job.id);
      });

      // If it's AJAX request
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment: populatedComment,
          },
          message: "Comment created!",
        });
      }

      req.flash("success", "Comment added successfully !");
      return res.redirect("back");
    } else {
      req.flash("error", "Post not found !");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);

    // User who tries to delete comment should have posted that comment
    // .id is string form of ObjectId
    if (comment.user == req.user.id) {
      // Before deleting the comment, save the postId to which this comment belongs to
      let postId = comment.post;

      comment.remove(); // delete comment

      // remove(pull out) comment id from the comments array of post
      let post = await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });

      // destroy the associated likes for this comment
      await Like.deleteMany({ likeable: comment._id, onModel: "Comment" });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            message: "Comment Deleted !",
          },
        });
      }

      req.flash("success", "Comment deleted successfully !");
      return res.redirect("back");
    } else {
      req.flash("error", "You are not Authorized !");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};
