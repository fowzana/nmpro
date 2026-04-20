let currentUser = "";

function handleLogin() {
    const user = document.getElementById('username').value;
    if (!user) return alert("Enter a username");
    
    currentUser = user;
    localStorage.setItem("instaUser", user);
    
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    document.getElementById('profile-display-name').innerText = user;
    
    renderFeed();
}

function navigate(pageId, element) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active-page'));
    document.getElementById(pageId).classList.add('active-page');
    
    document.querySelectorAll('.nav-icon').forEach(i => i.classList.remove('active'));
    element.classList.add('active');
    
    if(pageId === 'profile-view') renderProfile();
}

function createPost() {
    const text = document.getElementById('postText').value;
    const file = document.getElementById('postFile').files;
    
    if (!text && !file) return;

    const reader = new FileReader();
    reader.onload = function() {
        const posts = JSON.parse(localStorage.getItem("instaPosts") || "[]");
        posts.unshift({
            user: currentUser,
            text: text,
            img: file ? reader.result : null,
            likes: 0
        });
        localStorage.setItem("instaPosts", JSON.stringify(posts));
        document.getElementById('postText').value = "";
        renderFeed();
    };

    if (file) reader.readAsDataURL(file);
    else {
        // Post text only if no file
        const posts = JSON.parse(localStorage.getItem("instaPosts") || "[]");
        posts.unshift({ user: currentUser, text: text, img: null, likes: 0 });
        localStorage.setItem("instaPosts", JSON.stringify(posts));
        renderFeed();
    }
}

function renderFeed() {
    const container = document.getElementById('feed-container');
    const posts = JSON.parse(localStorage.getItem("instaPosts") || "[]");
    
    container.innerHTML = posts.map((p, i) => `
        <div class="post-card">
            <div class="post-header">👤 ${p.user}</div>
            ${p.img ? `<img src="${p.img}" class="post-img">` : ''}
            <div class="post-footer">
                <div class="post-actions">
                    <i class="fa-regular fa-heart"></i>
                    <i class="fa-regular fa-comment"></i>
                </div>
                <strong>${p.likes} likes</strong>
                <div><strong>${p.user}</strong> ${p.text}</div>
            </div>
        </div>
    `).join('');
}

function renderProfile() {
    const grid = document.getElementById('profile-grid');
    const posts = JSON.parse(localStorage.getItem("instaPosts") || "[]");
    const userPosts = posts.filter(p => p.user === currentUser);
    
    grid.innerHTML = userPosts.map(p => `
        <div class="grid-item" style="background-image: url('${p.img || 'https://via.placeholder.com/150'}')"></div>
    `).join('');
}

// Auto-login check
window.onload = () => {
    const saved = localStorage.getItem("instaUser");
    if(saved) {
        document.getElementById('username').value = saved;
        handleLogin();
    }
}