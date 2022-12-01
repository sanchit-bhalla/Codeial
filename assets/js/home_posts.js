// wrap inside {} to provide scope
{
  // Right now when user creates new post or comment, the whole home page is reloaded. But we don't want to reload the whole page everytime, so we wil be using ajax

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
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // Method to create a post in DOM
  let newPostDom = function (post) {
    return $(`<li id="post-${post._id}">
                <p>
                  
                  <small>
                    <a class="delete-post-button" href="/posts/destroy/${post.id}">X</a>
                  </small>
                  
                  ${post.content}
                  <br />
                  <small> ${post.user.name} </small>
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
                  <% } %>
              
                  <div class="post-comments-list">
                    <ul id="post-comments-${post._id}">
                    </ul>
                  </div>
                </div>
              </li>`);
  };

  createPost();
}
