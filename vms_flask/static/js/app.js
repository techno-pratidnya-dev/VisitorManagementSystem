document.addEventListener('DOMContentLoaded', () => {
    const visitorFeed = document.getElementById('visitorFeed');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const visitorModal = document.getElementById('visitorModal');
    const visitorForm = document.getElementById('visitorForm');
    const modalTitle = document.getElementById('modalTitle');
    const addVisitorBtn = document.getElementById('addVisitorBtn');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    let visitorsData = [];

    // Modal Control
    const openModal = (mode, visitor = null) => {
        visitorModal.style.display = 'flex';
        if (mode === 'edit' && visitor) {
            modalTitle.innerText = 'Edit Visitor';
            document.getElementById('visitorId').value = visitor.id;
            document.getElementById('vName').value = visitor.name;
            document.getElementById('vPurpose').value = visitor.purpose;
            document.getElementById('vMeetingWith').value = visitor.meeting_with;
            document.getElementById('vStatus').value = visitor.status;
        } else {
            modalTitle.innerText = 'Add New Visitor';
            visitorForm.reset();
            document.getElementById('visitorId').value = '';
        }
    };

    const closeModal = () => {
        visitorModal.style.display = 'none';
        visitorForm.reset();
    };

    addVisitorBtn.addEventListener('click', () => openModal('add'));
    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));

    // Form Submission
    visitorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('visitorId').value;
        const payload = {
            name: document.getElementById('vName').value,
            purpose: document.getElementById('vPurpose').value,
            meeting_with: document.getElementById('vMeetingWith').value,
            status: document.getElementById('vStatus').value
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/visitors/${id}` : '/api/visitors';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                closeModal();
                fetchVisitors(); // Refresh feed
            }
        } catch (error) {
            console.error('Error saving visitor:', error);
        }
    });

    // Fetch and render visitors
    const fetchVisitors = async () => {
        const search = searchInput.value;
        const status = statusFilter.value;
        
        renderSkeletons();

        try {
            const response = await fetch(`/api/visitors?search=${search}&status=${status === 'AllStatus' ? '' : status}`);
            visitorsData = await response.json();
            renderVisitors(visitorsData);
        } catch (error) {
            console.error('Error fetching visitors:', error);
        }
    };

    const renderVisitors = (visitors) => {
        if (visitors.length === 0) {
            visitorFeed.innerHTML = `
                <div class="empty-state" style="text-align:center; padding: 3rem; color: var(--text-muted);">
                    <i class="fa-solid fa-user-slash" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>No visitors found</h3>
                </div>
            `;
            return;
        }
        visitorFeed.innerHTML = visitors.map(v => createVisitorCard(v)).join('');
        
        // Add edit listeners
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.visitor-card').dataset.id;
                const visitor = visitorsData.find(v => v.id == id);
                openModal('edit', visitor);
            });
        });
    };

    const renderSkeletons = () => {
        visitorFeed.innerHTML = `
            <div class="visitor-card skeleton" style="height: 450px; border:none; margin-bottom: 20px;"></div>
            <div class="visitor-card skeleton" style="height: 450px; border:none; margin-bottom: 20px;"></div>
        `;
    };

    const createVisitorCard = (v) => {
        const statusClass = `status-${v.status.toLowerCase()}`;
        return `
            <div class="visitor-card" data-id="${v.id}">
                <div class="card-header">
                    <div class="user-info">
                        <img src="${v.profile_image}" alt="${v.name}" class="avatar">
                        <div class="user-text">
                            <h3>${v.name}</h3>
                            <p class="visit-meta">${v.time}</p>
                        </div>
                    </div>
                    <button class="options-btn edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
                </div>
                <div class="card-content">
                    <p class="purpose-text">${v.purpose}</p>
                    <p class="meeting-with"><i class="fa-solid fa-user-tie"></i> Meeting with: ${v.meeting_with}</p>
                </div>
                <div class="card-media">
                    <img src="${v.visitor_image}" alt="Visit entry" loading="lazy">
                </div>
                <div class="card-footer">
                    <span class="status-badge ${statusClass}">${v.status}</span>
                    <div class="action-row">
                        <div class="interactions">
                            <button class="interaction-btn"><i class="fa-regular fa-thumbs-up"></i> 12</button>
                            <button class="interaction-btn"><i class="fa-regular fa-comment"></i> 3</button>
                        </div>
                        <div class="main-actions">
                            <button class="btn btn-outline edit-btn">Edit</button>
                            <button class="btn btn-primary">Revisit</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    // Debounce for search
    let debounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(fetchVisitors, 300);
    });

    statusFilter.addEventListener('change', fetchVisitors);

    // Initial fetch
    fetchVisitors();
});

// Modal Logic
function viewDetails(id) {
    alert(`Showing details for Visitor ID: ${id}. \n(In a full production app, this would open a rich modal or separate page)`);
}
