document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('feedContainer');
    const searchInput = document.getElementById('searchInput');
    const openCreateModalBtn = document.getElementById('openCreateModal');
    const modalBg = document.getElementById('modalBg');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelModalBtn = document.getElementById('cancelModal');
    const submitPostBtn = document.getElementById('submitPost');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const detailsBg = document.getElementById('detailsBg');
    const closeDetailsBtn = document.getElementById('closeDetails');
    const mediaUrlInput = document.getElementById('mediaUrl');
    const mediaPreview = document.getElementById('mediaPreview');
    const mtypeBtns = document.querySelectorAll('.mtype-btn');
    const mediaUrlRow = document.getElementById('mediaUrlRow');

    let postsData = [];
    let activeFilter = 'All';
    let activeMediaType = 'image';

    const uploadDropZone = document.getElementById('uploadDropZone');
    const mediaFileInput = document.getElementById('mediaFile');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    // ===== MEDIA TYPE TOGGLE =====
    mtypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            mtypeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeMediaType = btn.dataset.mtype;
            mediaUrlRow.style.display = activeMediaType === 'text' ? 'none' : 'block';
            updateMediaPreview();
        });
    });

    mediaUrlInput.addEventListener('input', updateMediaPreview);

    // ===== UPLOAD DROP ZONE =====
    uploadDropZone.addEventListener('click', () => mediaFileInput.click());

    uploadDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadDropZone.classList.add('drag-over');
    });
    uploadDropZone.addEventListener('dragleave', () => uploadDropZone.classList.remove('drag-over'));
    uploadDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadDropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    });

    mediaFileInput.addEventListener('change', () => {
        const file = mediaFileInput.files[0];
        if (file) handleFileUpload(file);
    });

    async function handleFileUpload(file) {
        uploadDropZone.classList.add('has-file');
        uploadDropZone.querySelector('p').textContent = file.name;
        uploadDropZone.querySelector('i').className = 'bi bi-file-earmark-check-fill';
        uploadProgress.style.display = 'flex';
        progressBar.style.width = '20%';
        progressText.textContent = 'Uploading...';

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) {
                progressBar.style.width = '100%';
                progressText.textContent = '✓ Upload successful!';
                mediaUrlInput.value = data.url;
                activeMediaType = data.media_type;
                mtypeBtns.forEach(b => b.classList.toggle('active', b.dataset.mtype === activeMediaType));
                updateMediaPreview();
                setTimeout(() => { uploadProgress.style.display = 'none'; progressBar.style.width = '0%'; }, 2000);
            } else {
                progressText.textContent = '✗ Upload failed: ' + (data.error || 'Unknown error');
            }
        } catch (err) {
            progressText.textContent = '✗ Upload failed. Server error.';
        }
    }

    function updateMediaPreview() {
        const url = mediaUrlInput.value.trim();
        if (!url) { mediaPreview.innerHTML = ''; return; }
        if (activeMediaType === 'image') {
            mediaPreview.innerHTML = `<img src="${url}" onerror="this.style.display='none'" alt="Preview">`;
        } else if (activeMediaType === 'video') {
            mediaPreview.innerHTML = `<video src="${url}" controls muted></video>`;
        }
    }

    // ===== FILTER =====
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.type;
            fetchPosts();
        });
    });

    // ===== SEARCH =====
    let searchTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(fetchPosts, 300);
    });

    // ===== FETCH POSTS =====
    async function fetchPosts() {
        const search = searchInput.value.trim();
        let url = `/api/posts?search=${encodeURIComponent(search)}&type=${activeFilter}`;
        renderSkeletons();
        try {
            const res = await fetch(url);
            postsData = await res.json();
            renderFeed(postsData);
        } catch (err) {
            feedContainer.innerHTML = `<div class="empty-state"><i class="bi bi-wifi-off"></i><h5>Could not load posts</h5><p>Check your server is running.</p></div>`;
        }
    }

    // ===== RENDER =====
    function renderFeed(posts) {
        updateStats(posts);
        if (posts.length === 0) {
            feedContainer.innerHTML = `<div class="empty-state"><i class="bi bi-people"></i><h5>No guests found</h5><p>Try a different search or filter.</p></div>`;
            return;
        }
        feedContainer.innerHTML = posts.map(p => createPostCard(p)).join('');
        attachCardListeners();
        updateRecentList(posts);
    }

    function updateStats(posts) {
        document.getElementById('totalPosts').textContent = posts.length;
        document.getElementById('vipCount').textContent = posts.filter(p => p.type === 'VIP').length;
        document.getElementById('donorCount').textContent = posts.filter(p => p.type === 'Donor').length;
    }

    function updateRecentList(posts) {
        const list = document.getElementById('recentList');
        list.innerHTML = posts.slice(0, 5).map(p => `
            <li class="recent-item">
                <div class="recent-avatar">${p.name.charAt(0).toUpperCase()}</div>
                <div>
                    <div class="recent-name">${p.name}</div>
                    <div class="recent-time">${p.time}</div>
                </div>
            </li>
        `).join('');
    }

    function getTypeBadge(type) {
        const classMap = { 'VIP': 'type-vip', 'Donor': 'type-donor', 'Visitor': 'type-visitor' };
        const iconMap = { 'VIP': '★', 'Donor': '♥', 'Visitor': '●' };
        return `<span class="type-badge ${classMap[type] || 'type-visitor'}">${iconMap[type] || '●'} ${type}</span>`;
    }

    function getStatusBadge(status) {
        const cls = status === 'Visited' ? 'status-visited' : 'status-completed';
        return `<span class="status-pill ${cls}"><i class="bi bi-check-circle-fill"></i> ${status}</span>`;
    }

    function createPostCard(p) {
        const hasMedia = p.media_url && p.media_url.trim() !== '';
        let mediaHtml = '';

        if (hasMedia && p.media_type === 'image') {
            mediaHtml = `<div class="card-media"><img src="${p.media_url}" alt="${p.name} visit" loading="lazy"></div>`;
        } else if (hasMedia && p.media_type === 'video') {
            mediaHtml = `<div class="card-media"><video src="${p.media_url}" controls muted preload="none"></video></div>`;
        }

        return `
        <article class="post-card" data-id="${p.id}">
            <div class="card-top">
                <div class="guest-info">
                    <div class="guest-avatar">${p.name.charAt(0).toUpperCase()}</div>
                    <div class="guest-meta">
                        <div class="guest-name">${p.name}</div>
                        <div class="guest-time"><i class="bi bi-clock"></i> ${p.time}</div>
                        ${getTypeBadge(p.type)}
                    </div>
                </div>
                <div style="position:relative;">
                    <button class="three-dot-btn" data-id="${p.id}">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <div class="dot-menu" id="dotMenu-${p.id}">
                        <div class="dot-menu-item edit-post" data-id="${p.id}"><i class="bi bi-pencil-fill"></i> Edit Post</div>
                        <div class="dot-menu-item danger delete-post" data-id="${p.id}"><i class="bi bi-trash-fill"></i> Delete Post</div>
                    </div>
                </div>
            </div>

            <div class="card-description">${p.description}</div>

            ${mediaHtml}

            <div class="card-bottom">
                ${getStatusBadge(p.status)}
                <div class="card-actions">
                    <button class="action-btn edit-post" data-id="${p.id}"><i class="bi bi-pencil"></i> Edit</button>
                    <button class="action-btn danger delete-post" data-id="${p.id}"><i class="bi bi-trash"></i> Delete</button>
                    <button class="action-btn primary view-post" data-id="${p.id}"><i class="bi bi-eye"></i> Details</button>
                </div>
            </div>
        </article>`;
    }

    function renderSkeletons() {
        feedContainer.innerHTML = `<div class="skeleton-card"></div><div class="skeleton-card"></div>`;
    }

    // ===== ATTACH CARD LISTENERS =====
    function attachCardListeners() {
        document.querySelectorAll('.three-dot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const menu = document.getElementById(`dotMenu-${id}`);
                document.querySelectorAll('.dot-menu.show').forEach(m => { if (m !== menu) m.classList.remove('show'); });
                menu.classList.toggle('show');
            });
        });

        document.addEventListener('click', () => {
            document.querySelectorAll('.dot-menu.show').forEach(m => m.classList.remove('show'));
        });

        document.querySelectorAll('.edit-post').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(btn.dataset.id));
        });
        document.querySelectorAll('.delete-post').forEach(btn => {
            btn.addEventListener('click', () => deletePost(btn.dataset.id));
        });
        document.querySelectorAll('.view-post').forEach(btn => {
            btn.addEventListener('click', () => openDetails(btn.dataset.id));
        });
    }

    // ===== MODAL =====
    const openModal = (mode = 'create', post = null) => {
        document.getElementById('postId').value = '';
        document.getElementById('guestName').value = '';
        document.getElementById('guestType').value = 'Visitor';
        document.getElementById('guestDesc').value = '';
        document.getElementById('mediaUrl').value = '';
        document.getElementById('guestStatus').value = 'Visited';
        mediaPreview.innerHTML = '';
        activeMediaType = 'image';
        mtypeBtns.forEach(b => b.classList.toggle('active', b.dataset.mtype === 'image'));
        mediaUrlRow.style.display = 'block';
        // Reset upload zone
        uploadDropZone.classList.remove('has-file');
        uploadDropZone.querySelector('p').textContent = 'Click to browse or drag & drop';
        uploadDropZone.querySelector('i').className = 'bi bi-cloud-arrow-up-fill';
        uploadProgress.style.display = 'none';
        progressBar.style.width = '0%';
        mediaFileInput.value = '';

        if (mode === 'edit' && post) {
            document.getElementById('modalHeading').textContent = 'Edit Guest Post';
            document.getElementById('submitPost').innerHTML = '<i class="bi bi-check-lg"></i> Update Post';
            document.getElementById('postId').value = post.id;
            document.getElementById('guestName').value = post.name;
            document.getElementById('guestType').value = post.type;
            document.getElementById('guestDesc').value = post.description;
            document.getElementById('mediaUrl').value = post.media_url || '';
            document.getElementById('guestStatus').value = post.status;
            activeMediaType = post.media_type || 'image';
            mtypeBtns.forEach(b => b.classList.toggle('active', b.dataset.mtype === activeMediaType));
            mediaUrlRow.style.display = activeMediaType === 'text' ? 'none' : 'block';
            updateMediaPreview();
        } else {
            document.getElementById('modalHeading').textContent = 'Create Guest Post';
            document.getElementById('submitPost').innerHTML = '<i class="bi bi-send-fill"></i> Publish Post';
        }
        modalBg.classList.add('show');
    };

    const closeModal = () => modalBg.classList.remove('show');

    openCreateModalBtn.addEventListener('click', () => openModal('create'));
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);
    modalBg.addEventListener('click', (e) => { if (e.target === modalBg) closeModal(); });

    function openEditModal(id) {
        const post = postsData.find(p => p.id == id);
        if (post) openModal('edit', post);
    }

    // ===== SUBMIT POST =====
    submitPostBtn.addEventListener('click', async () => {
        const id = document.getElementById('postId').value;
        const name = document.getElementById('guestName').value.trim();
        const desc = document.getElementById('guestDesc').value.trim();
        if (!name || !desc) { alert('Guest name and description are required.'); return; }

        const now = new Date();
        const formattedTime = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
            ', ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        const payload = {
            name,
            type: document.getElementById('guestType').value,
            time: formattedTime,
            description: desc,
            media_url: document.getElementById('mediaUrl').value.trim(),
            media_type: activeMediaType,
            status: document.getElementById('guestStatus').value
        };

        const url = id ? `/api/posts/${id}` : '/api/posts';
        const method = id ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method, headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) { closeModal(); fetchPosts(); }
        } catch (err) { alert('Failed to save post.'); }
    });

    // ===== DELETE POST =====
    async function deletePost(id) {
        if (!confirm('Are you sure you want to delete this guest post?')) return;
        try {
            const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
            if (res.ok) fetchPosts();
        } catch (err) { alert('Failed to delete post.'); }
    }

    // ===== VIEW DETAILS =====
    function openDetails(id) {
        const p = postsData.find(post => post.id == id);
        if (!p) return;
        const hasMedia = p.media_url && p.media_url.trim();
        let mediaHtml = '';
        if (hasMedia && p.media_type === 'image') mediaHtml = `<img src="${p.media_url}" style="width:100%; border-radius:8px; margin-bottom:14px;">`;
        if (hasMedia && p.media_type === 'video') mediaHtml = `<video src="${p.media_url}" controls style="width:100%; border-radius:8px; margin-bottom:14px;"></video>`;

        document.getElementById('detailsHeading').textContent = p.name;
        document.getElementById('detailsContent').innerHTML = `
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                <div style="width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,#1e4c9a,#7c3aed); display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.4rem; font-weight:700;">${p.name.charAt(0)}</div>
                <div>
                    <div style="font-weight:700; font-size:1.05rem;">${p.name}</div>
                    <div style="font-size:0.8rem; color:#6b7280;">${p.time}</div>
                    <span style="display:inline-block; margin-top:4px; padding:2px 10px; border-radius:20px; font-size:0.7rem; font-weight:700; background:${p.type === 'VIP' ? '#f5f3ff' : p.type === 'Donor' ? '#fdf2f8' : '#ecfeff'}; color:${p.type === 'VIP' ? '#7c3aed' : p.type === 'Donor' ? '#db2777' : '#0891b2'};">${p.type}</span>
                </div>
            </div>
            ${mediaHtml}
            <p style="line-height:1.7; margin-bottom:14px;">${p.description}</p>
            <div style="padding:10px 14px; background:#f8fafc; border-radius:8px; font-size:0.82rem; color:#6b7280;">
                Status: <strong>${p.status}</strong>
            </div>`;
        detailsBg.classList.add('show');
    }

    closeDetailsBtn.addEventListener('click', () => detailsBg.classList.remove('show'));
    detailsBg.addEventListener('click', (e) => { if (e.target === detailsBg) detailsBg.classList.remove('show'); });

    // ===== INIT =====
    fetchPosts();
});
