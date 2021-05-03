const delButtonHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');

        const response = await fetch(`/api/comment/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to delete comment');
        }
    }
};

document
  .querySelector('.comment-card')
  .addEventListener('click', delButtonHandler);


<script src="./js/comment.js"></script>
