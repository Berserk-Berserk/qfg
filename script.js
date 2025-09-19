let posts = [];
let editingPostId = null;
const apiUrl = 'https://qfg.onrender.com';

async function loadPosts() {
    try {
        const response = await fetch(apiUrl);
        posts = await response.json();
        renderPosts();
    } catch (error) {
        console.error('Помилка завантаження постів:', error);
    }
}

function renderPosts() {
    const source = document.getElementById('post-template').innerHTML;
    const template = Handlebars.compile(source);
    const html = template({ posts });
    document.getElementById('posts').innerHTML = html;
}

async function savePost() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!title || !content) {
        alert('Заповніть усі поля!');
        return;
    }

    if (editingPostId) {
        const post = posts.find(p => p.id === editingPostId);
        post.title = title;
        post.content = content;
        await fetch(`${apiUrl}/${editingPostId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post)
        });
        editingPostId = null;
        document.querySelector('.post-form button').textContent = 'Опублікувати';
    } else {
        const newPost = {
            id: Date.now().toString(),
            title,
            content
        };
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost)
        });
    }

    loadPosts(); // після збереження перезавантажуємо
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
}

function editPost(id) {
    const post = posts.find(p => p.id === id);
    document.getElementById('title').value = post.title;
    document.getElementById('content').value = post.content;
    editingPostId = id;
    document.querySelector('.post-form button').textContent = 'Оновити';
}

async function deletePost(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    loadPosts();
}

loadPosts();
