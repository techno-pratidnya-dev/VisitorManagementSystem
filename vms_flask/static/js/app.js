document.addEventListener('DOMContentLoaded', () => {
    const visitorFeed = document.getElementById('visitorFeed');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter'); // actually we changed filters to buttons in HTML
    const visitorModal = document.getElementById('visitorModal');
    const visitorForm = document.getElementById('visitorForm');
    const modalTitle = document.getElementById('modalTitle');
    const addVisitorBtn = document.getElementById('addVisitorBtn');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    // Filter Buttons logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    let activeStatusFilter = 'All';

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeStatusFilter = btn.dataset.type;
            fetchVisitors();
        });
    });

    const mediaUploadBox = document.getElementById('mediaUploadBox');
    const btnMediaImage = document.getElementById('btnMediaImage');
    const btnMediaText = document.getElementById('btnMediaText');
    let activeMediaTab = 'image';

    btnMediaImage.addEventListener('click', () => {
        btnMediaImage.classList.add('active');
        btnMediaText.classList.remove('active');
        mediaUploadBox.style.display = 'block';
        activeMediaTab = 'image';
    });

    btnMediaText.addEventListener('click', () => {
        btnMediaText.classList.add('active');
        btnMediaImage.classList.remove('active');
        mediaUploadBox.style.display = 'none';
        activeMediaTab = 'text';
    });

    // Modal Control
    const openModal = (mode, visitor = null) => {
        visitorModal.classList.add('show');
        if (mode === 'edit' && visitor) {
            modalTitle.innerText = 'Edit Guest Post';
            document.getElementById('visitorId').value = visitor.id;
            document.getElementById('vName').value = visitor.name;
            document.getElementById('vPurpose').value = visitor.purpose;
            document.getElementById('vMeetingWith').value = visitor.meeting_with;
            document.getElementById('vStatus').value = visitor.status;
        } else {
            modalTitle.innerText = 'Create Guest Post';
            visitorForm.reset();
            document.getElementById('visitorId').value = '';
        }
    };

    const closeModal = () => {
        visitorModal.classList.remove('show');
        visitorForm.reset();
    };

    addVisitorBtn.addEventListener('click', () => openModal('add'));
    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));

    // Form Submission
    visitorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('visitorId').value;
        const formData = new FormData();
        
        formData.append('name', document.getElementById('vName').value);
        formData.append('purpose', document.getElementById('vPurpose').value);
        formData.append('meeting_with', document.getElementById('vMeetingWith').value);
        formData.append('status', document.getElementById('vStatus').value);
        
        const fileInput = document.getElementById('vImage');
        if (activeMediaTab === 'image' && fileInput.files.length > 0) {
            formData.append('vImage', fileInput.files[0]);
        }

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/visitors/${id}` : '/api/visitors';

        try {
            const response = await fetch(url, {
                method: method,
                body: formData
            });

            if (response.ok) {
                closeModal();
                fetchVisitors(); // Refresh feed
            }
        } catch (error) {
            console.error('Error saving post:', error);
        }
    });

    // Fetch and render visitors
    const fetchVisitors = async () => {
        const search = searchInput.value;
        
        renderSkeletons();

        try {
            const response = await fetch(`/api/visitors?search=${search}&status=${activeStatusFilter === 'All' ? '' : activeStatusFilter}`);
            const visitorsData = await response.json();
            window.visitorsData = visitorsData; // store globally for edits
            renderVisitors(visitorsData);
        } catch (error) {
            console.error('Error fetching visitors:', error);
        }
    };

    const renderVisitors = (visitors) => {
        if (visitors.length === 0) {
            visitorFeed.innerHTML = `
                <div class="empty-state" style="text-align:center; padding: 3rem; color: var(--muted);">
                    <i class="fa-solid fa-users" style="font-size: 3rem; margin-bottom: 1rem; opacity:0.5;"></i>
                    <h4>No posts found</h4>
                    <p style="font-size:0.9rem;">Try adjusting your filters or search.</p>
                </div>
            `;
            return;
        }
        visitorFeed.innerHTML = visitors.map(v => createVisitorCard(v)).join('');
        
        // Add edit listeners
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.visitor-card').dataset.id;
                const visitor = window.visitorsData.find(v => v.id == id);
                if (visitor) openModal('edit', visitor);
            });
        });

        // Add delete listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if(confirm('Are you sure you want to delete this post?')) {
                    const id = e.target.closest('.visitor-card').dataset.id;
                    try {
                        const response = await fetch(`/api/visitors/${id}`, { method: 'DELETE' });
                        if(response.ok) {
                            fetchVisitors();
                        }
                    } catch(error) {
                        console.error('Error deleting post:', error);
                    }
                }
            });
        });
    };

    const renderSkeletons = () => {
        visitorFeed.innerHTML = `
            <div class="visitor-card skeleton" style="height: 380px;"></div>
            <div class="visitor-card skeleton" style="height: 380px;"></div>
        `;
    };

    const createVisitorCard = (v) => {
        const isCompleted = v.status === 'Visited' ? 'status-visited' : 'status-pending'; // simplified status classes
        let mediaHtml = '';
        
        // We guess it's a text post if image is blank or placeholder
        if (v.visitor_image && v.visitor_image !== '' && !v.visitor_image.includes('v1.png') && !v.visitor_image.includes('placeholder')) {
            mediaHtml = `<div class="card-media"><img src="${v.visitor_image}" alt="Visit entry" loading="lazy"></div>`;
        }

        return `
            <article class="visitor-card" data-id="${v.id}">
                <div class="card-top">
                    <div class="guest-info">
                        <div class="guest-avatar">${v.name.charAt(0).toUpperCase()}</div>
                        <div class="guest-meta">
                            <div class="guest-name">${v.name}</div>
                            <div class="guest-time"><i class="fa-regular fa-clock"></i> ${v.time}</div>
                            <span class="type-badge type-visitor"><i class="fa-solid fa-circle"></i> ${v.meeting_with || 'General'}</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="options-btn edit-btn" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="options-btn delete-btn" title="Delete" style="color: #ef4444;"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>

                <div class="card-description">${v.purpose}</div>

                ${mediaHtml}

                <div class="card-bottom">
                    <span class="status-pill ${isCompleted}"><i class="fa-solid fa-circle-check"></i> ${v.status}</span>
                    <div class="card-actions">
                        <button class="action-btn primary"><i class="fa-solid fa-eye"></i> Details</button>
                    </div>
                </div>
            </article>
        `;
    };

    // Debounce for search
    let debounceTimer;
    if(searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(fetchVisitors, 300);
        });
    }

    // Initial fetch
    fetchVisitors();
});
