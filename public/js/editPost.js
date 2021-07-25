const editFormHandler = async (event) => {
  event.preventDefault();
  
  const title = document.querySelector('#title').value.trim();
  const content = document.querySelector('#content').value.trim();
  const post = document.querySelector('.edit-form');
  id = post.dataset.post_id;

  if (title && content) {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          content
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert(response.statusText);
      }
    }
  }

  const deleteFormHandler = async (event) => {
    event.preventDefault();

    const post = document.querySelector('.edit-form');
    id = post.dataset.post_id;
  
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
      // body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }

  }  
  
  document.querySelector('.edit-post-btn').addEventListener('click', editFormHandler);

  document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);