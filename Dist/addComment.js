const newCommentFormHandler=async a=>{a.preventDefault();const b=document.querySelector("#comment").value.trim(),c=a.target.getAttribute("data-post-id");if(b&&c){const a=await fetch("/api/comments",{method:"POST",body:JSON.stringify({comment:b,post_id:c}),headers:{"Content-Type":"application/json"}});a.ok?document.location.replace(`/post/${c}`):alert(a.statusText)}};document.querySelector(".comment-form").addEventListener("submit",newCommentFormHandler);