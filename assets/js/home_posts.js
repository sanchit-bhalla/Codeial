// wrap inside {} to provide scope
{
  // Right now when user creates new post/comment or delete existing posts/comments, the whole home page is reloaded. But we don't want to reload the whole page everytime, so we wil be using ajax

  // Method to submit the form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $(`#new-post-form`);

    newPostForm.submit(function (e) {
      e.preventDefault(); // bcz we don't want that form will be submitted automatically. We want to do it manually so that we can use ajax and prevent the whole page from reloading

      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(), //  serialize() method creates a URL encoded text string by serializing form values.
        success: function (data) {
          // data is in form of JSON
          let newPost = newPostDom(data.data.post);
          $("#posts-list-container>ul").prepend(newPost);

          showNotification("success", "Post published");

          // Adding click handler to the delete anchor tag of newly created post
          deletePost($(" .delete-post-button", newPost));
          // $(' .delete-post-button', newPost) finds the element with class delete-post-button inside the object newPost.
          // NOTE : there must be space before .delete-post-button

          // Adding Click handler to comments Form so that we will be able to use ajax there
          CreateComment(newPost);

          // enable the functionality of the toggle like button on the new post
          new ToggleLike($(" .toggle-like-button", newPost));
        },
        error: function (error) {
          console.log(error.responseText);
          showNotification("error", error);
        },
      });
    });
  };

  // Method to create a post in DOM
  let newPostDom = function (post) {
    return $(`<li id="post-${post._id}">
                <p>
                  
                  <small>
                    <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
                  </small>
                  
                  ${post.content}
                  <br>
                  <small> ${post.user.name} </small>

                  <br>

                  <small>
                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                      0 Likes
                    </a>                  
                  </small>

                </p>
              
                <div id="post-comments">
                  <form action="/comments/create" method="POST">
                    <input
                      type="text"
                      name="content"
                      placeholder="Type Here to add comment..."
                      required
                    />
                    <input type="hidden" name="post" value="${post._id}" />
                    <input type="submit" value="Add Comment" />
                  </form>
              
                  <div class="post-comments-list">
                    <ul id="post-comments-${post._id}">
                    </ul>
                  </div>
                </div>
              </li>`);
  };

  // Method to remove a post from DOM
  let deletePost = function (deleteLink) {
    // deleteLink is of form -
    // <a class="delete-post-button" href="/posts/destroy/<%= post.id %>">X</a>

    $(deleteLink).click(function (e) {
      e.preventDefault(); // Bcz we want to send it to the controller manually so that we would be able to use AJAX

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"), // e.g /posts/destroy/post_id
        success: function (data) {
          // Post and associated comments are removed from DB, we just need to remove it from the frontend
          $(`#post-${data.data.post_id}`).remove();

          showNotification("success", "Post and associated comments deleted");
        },
        error: function (error) {
          console.log(error.responseText);
          showNotification("error", error);
        },
      });
    });
  };

  // Method to create a comment inside the given post
  let CreateComment = function (post) {
    let newCommentForm = $(" form", post);

    newCommentForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "post",
        url: "/comments/create",
        data: newCommentForm.serialize(), //  serialize() method creates a URL encoded text string by serializing form values.
        success: function (data) {
          let newComment = newCommentDOM(data.data.comment);
          let postId = data.data.comment.post;
          $(`#post-comments-${postId}`).prepend(newComment);

          showNotification("success", "Comment published");

          // Adding click handler to the delete anchor tag of newly created Comment
          // $(' .delete-comment-form', newComment) finds the element with class delete-post-button inside the object newComment.
          deleteComment($(" .delete-comment-button", newComment));
          // NOTE : there must be space before .delete-comment-form

          // enable the functionality of the toggle like button on the new comment
          new ToggleLike($(" .toggle-like-button", newComment));
        },
        error: function (error) {
          console.log(error.responseText);
          showNotification("error", error);
        },
      });
    });
  };

  // Method to create a comment in DOM
  let newCommentDOM = function (comment) {
    return $(`<li>
    <p>
      <small>
        <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
      </small>
      ${comment.content}
      <br>
      <small>${comment.user.name}</small>

      <small>
        <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
          0 Likes
        </a>
      </small>

    </p>
  </li>`);
  };

  let deleteComment = function (deleteLink) {
    // deleteLink is of form -
    // <a class="delete-comment-form" href="/comments/destroy/<%= comment.id %>">X</a
    $(deleteLink).click(function (e) {
      e.preventDefault(); // Bcz we want to send it to the controller manually so that we would be able to use AJAX

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"), // e.g /comments/destroy/comment_id
        success: function (data) {
          // comments are removed from DB, we just need to remove it from the frontend
          $(deleteLink).closest("li").remove();

          showNotification("success", "Comment deleted");
        },
        error: function (error) {
          console.log(error.responseText);
          showNotification("error", error);
        },
      });
    });
  };

  // Method to show noty js notifications(flash messages)
  let showNotification = (messageType, message) => {
    new Noty({
      theme: "relax",
      text: message,
      type: messageType,
      layout: "topRight",
      timeout: 1500,
    }).show();
  };

  // Adding AJAX Deletion for all the posts which are already present
  // USing JQuery
  let allCurrentPosts = $("#posts-list-container>ul>li");
  for (let post of allCurrentPosts) {
    deletePost($(" .delete-post-button", post)); // or post.getElementsByClassName("delete-post-button")[0]

    // Adding click handler for creating comments on already present posts so that we can use AJAX
    CreateComment(post);

    // Adding click handler for deleting comments also
    let allCommentsDeleteLink = $(" .delete-comment-button", post); // or post.getElementsByClassName("delete-comment-button")
    for (let deleteLink of allCommentsDeleteLink) {
      deleteComment(deleteLink);
    }
  }

  // Calling Function
  createPost();
}
