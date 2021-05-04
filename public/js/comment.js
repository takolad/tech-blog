const commentBtnEl = document.getElementById('comment-submit');

const newFormHandler = async (event) => {
  event.preventDefault();

  const message = document.querySelector('#comment-field').value.trim();
  const blog_id = commentBtnEl.getAttribute('data-comm-id');
  const user_id = commentBtnEl.getAttribute('data-user-id');

  if (message && blog_id && user_id) {
    const response = await fetch(`/api/comments`, {
      method: 'POST',
      body: JSON.stringify({ message: message, user_id: user_id, blog_id: blog_id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace(`/blog/${blog_id}`);
    } else {
      alert('Failed to post comment');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/comments/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to delete comment');
    }
  }
};

let commentList = document.querySelector('.comment-form');
if (commentList) {
  commentList.addEventListener('submit', newFormHandler);
}

document
  .querySelector('.comment-card')
  .addEventListener('click', delButtonHandler);