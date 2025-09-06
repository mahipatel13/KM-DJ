// --- Dynamic Manage My Team Section ---
async function loadTeamsForLeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.name) return;
    const res = await fetch(`/api/teams/byleader?leader=${encodeURIComponent(user.name)}`);
    const data = await res.json();
    if (!data.success) return;
    const teams = data.teams;
    const teamInfoDiv = document.querySelector('#team-overview-content .team-info');
    if (!teamInfoDiv) return;
    teamInfoDiv.innerHTML = '';
    teams.forEach(team => {
        const div = document.createElement('div');
        div.className = 'team-card';
        div.innerHTML = `
            <div class="info-row"><div class="info-label">Team Name</div><div class="info-value">${team.name}</div></div>
            <div class="info-row"><div class="info-label">Description</div><div class="info-value">${team.desc || ''}</div></div>
            <div class="info-row"><div class="info-label">Deadline</div><div class="info-value">${team.deadline || ''}</div></div>
            <div class="info-row"><div class="info-label">Members</div><div class="info-value">${(team.members||[]).map(m=>m.name).join(', ')}</div></div>
            <button class="edit-team-btn" data-teamid="${team._id}">Edit</button>
        `;
        teamInfoDiv.appendChild(div);
    });
    // Add event listeners for edit buttons
    document.querySelectorAll('.edit-team-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            openEditTeamModal(this.getAttribute('data-teamid'));
        });
    });
}

async function openEditTeamModal(teamId) {
    // Fetch all employees
    const empRes = await fetch('/api/auth/employees');
    const empData = await empRes.json();
    if (!empData.success) return alert('Could not load employees');
    // Fetch team details
    const teamRes = await fetch(`/api/teams/byleader?leader=${encodeURIComponent(JSON.parse(localStorage.getItem('user')).name)}`);
    const teamData = await teamRes.json();
    const team = (teamData.teams||[]).find(t => t._id === teamId);
    if (!team) return alert('Team not found');

    // Create modal
    let modal = document.getElementById('edit-team-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'edit-team-modal';
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Team Members</h2>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <form id="edit-team-form">
                        <div class="form-group">
                            <label for="edit-team-members"><b>Add Employees</b></label>
                            <select id="edit-team-members" multiple style="width:100%;min-height:120px;">
                                ${empData.users.map(u => `<option value="${u._id}" ${team.members.some(m=>m._id===u._id)?'selected':''}>${u.name} (${u.userId})</option>`).join('')}
                            </select>
                            <small>Select one or more employees to add to this team.</small>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary cancel-modal">Cancel</button>
                            <button type="submit" class="btn-primary">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        modal.classList.add('show');
        modal.querySelector('#edit-team-members').innerHTML = empData.users.map(u => `<option value="${u._id}" ${team.members.some(m=>m._id===u._id)?'selected':''}>${u.name} (${u.userId})</option>`).join('');
    }
    // Close modal (remove from DOM for safety)
    const closeModal = () => {
        if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
    };
    modal.querySelector('.close-modal').onclick = closeModal;
    modal.querySelector('.cancel-modal').onclick = closeModal;
    // Handle form submit
    modal.querySelector('#edit-team-form').onsubmit = async function(e) {
        e.preventDefault();
        const selected = Array.from(modal.querySelector('#edit-team-members').selectedOptions).map(opt=>opt.value);
        const res = await fetch('/api/teams/members', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamId, memberIds: selected })
        });
        const data = await res.json();
        if (data.success) {
            alert('Team members updated!');
            closeModal();
            loadTeamsForLeader();
        } else {
            alert('Failed to update team members');
        }
    };
}

// Ensure teams load on page load and tab switch
document.addEventListener('DOMContentLoaded', function() {
    // Page navigation
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    // Set default active page
    const defaultPage = document.getElementById('dashboard-page');
    if (defaultPage) defaultPage.style.display = 'block';
    // Set default active nav item
    const defaultNavItem = document.querySelector('.nav-item[data-page="dashboard"]');
    if (defaultNavItem) defaultNavItem.classList.add('active');

    // Function to navigate to a specific page
    function navigateToPage(pageId) {
        // Hide all pages
        pages.forEach(page => page.style.display = 'none');
        // Show selected page
        const targetPage = document.getElementById(pageId + '-page');
        if (targetPage) {
            targetPage.style.display = 'block';
        }
        // Update active nav item
        navItems.forEach(navItem => {
            navItem.classList.remove('active');
        });
        const targetNavItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
        if (targetNavItem) {
            targetNavItem.classList.add('active');
        }
        // If manage-team tab, load teams
        if (pageId === 'manage-team') {
            loadTeamsForLeader();
        }
    }

    // Add click event listeners to all navigation items
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            navigateToPage(pageId);
        });
    });

    // Load teams if already on manage-team page
    if (document.getElementById('manage-team-page').style.display !== 'none') {
        loadTeamsForLeader();
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Page navigation
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    // Set default active page
    const defaultPage = document.getElementById('dashboard-page');
    if (defaultPage) defaultPage.style.display = 'block';
    
    // Set default active nav item
    const defaultNavItem = document.querySelector('.nav-item[data-page="dashboard"]');
    if (defaultNavItem) defaultNavItem.classList.add('active');

    // Function to navigate to a specific page
    function navigateToPage(pageId) {
        // Hide all pages
        pages.forEach(page => page.style.display = 'none');
        
        // Show selected page
        const targetPage = document.getElementById(pageId + '-page');
        if (targetPage) {
            targetPage.style.display = 'block';
        }
        
        // Update active nav item
        navItems.forEach(navItem => {
            navItem.classList.remove('active');
        });
        
        const targetNavItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
        if (targetNavItem) {
            targetNavItem.classList.add('active');
        }
    }

    // Add click event listeners to all navigation items
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            navigateToPage(pageId);
        });
    });

    // Tab switching in Manage Team page
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding tab content
            const tabId = this.getAttribute('data-tab') + '-content';
            tabContents.forEach(content => content.style.display = 'none');
            document.getElementById(tabId).style.display = 'block';
        });
    });

    // ...existing code...

    // Placeholder for charts (in a real application, you would use a charting library)
    function initCharts() {
        // This is where you would initialize charts with a library like Chart.js
        // For this example, we're using placeholder images
        console.log('Charts would be initialized here in a real application');
    }

    // Initialize charts when the performance analytics tab is clicked
    const performanceTab = document.querySelector('[data-tab="performance-analytics"]');
    if (performanceTab) {
        performanceTab.addEventListener('click', initCharts);
    }

    // Modal functionality
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    }

    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
        });
    }

    // Close modal when clicking outside or on close button
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    const closeButtons = document.querySelectorAll('.close-modal, .cancel-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeAllModals();
        });
    });

    // Add Member button functionality
    const addMemberBtn = document.querySelector('.add-member-btn');
    if (addMemberBtn) {
        addMemberBtn.addEventListener('click', function() {
            openModal('add-member-modal');
        });
    }

    // Add Member form submission
    const addMemberForm = document.getElementById('add-member-form');
    if (addMemberForm) {
        addMemberForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Here you would normally process the form data and add the member
            alert('Member added successfully!');
            closeAllModals();
        });
    }

    // Member action buttons functionality
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent event bubbling
            const action = this.classList.contains('edit') ? 'Edit' : 'View';
            const memberRow = this.closest('.member-row');
            if (memberRow) {
                const memberName = memberRow.querySelector('.member-info div:last-child').textContent;
                alert(`${action} ${memberName} functionality would be implemented here`);
            }
        });
    });

    // Project card click functionality
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function(event) {
            // Only navigate if not clicking on the add project button
            if (!event.target.closest('.add-project-btn')) {
                const projectType = this.getAttribute('data-project');
                const projectTitle = this.querySelector('h3').textContent;
                
                // Set project detail modal title
                document.getElementById('project-detail-title').textContent = projectTitle;
                
                // Populate project info (this would be more dynamic in a real app)
                const projectInfo = document.querySelector('.project-info');
                if (projectInfo) {
                    let projectContent = '';
                    
                    if (projectType === 'ecommerce') {
                        projectContent = `
                            <h3>E-commerce Project</h3>
                            <p>Online shopping platform development with product catalog, shopping cart, and payment processing.</p>
                            <div class="info-row">
                                <div class="info-label">Status</div>
                                <div class="info-value">In Progress (75%)</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Start Date</div>
                                <div class="info-value">2024-11-15</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Due Date</div>
                                <div class="info-value">2025-03-30</div>
                            </div>
                        `;
                    } else if (projectType === 'mobile-app') {
                        projectContent = `
                            <h3>Mobile App Development</h3>
                            <p>Cross-platform mobile application for iOS and Android with push notifications.</p>
                            <div class="info-row">
                                <div class="info-label">Status</div>
                                <div class="info-value">In Progress (45%)</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Start Date</div>
                                <div class="info-value">2024-12-01</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Due Date</div>
                                <div class="info-value">2025-04-15</div>
                            </div>
                        `;
                    } else if (projectType === 'database') {
                        projectContent = `
                            <h3>Database Migration</h3>
                            <p>Legacy system database migration to new cloud-based infrastructure.</p>
                            <div class="info-row">
                                <div class="info-label">Status</div>
                                <div class="info-value">In Progress (30%)</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Start Date</div>
                                <div class="info-value">2024-12-15</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Due Date</div>
                                <div class="info-value">2025-02-28</div>
                            </div>
                        `;
                    }
                    
                    projectInfo.innerHTML = projectContent;
                }
                
                // Open the project detail modal
                openModal('project-detail-modal');
            }
        });
    });

    // Add Project button functionality
    const addProjectBtn = document.querySelector('.add-project-btn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            alert('Add project functionality would be implemented here');
        });
    }

    // Add Task button in project detail modal and main task page
    const addTaskProjectBtn = document.getElementById('add-task-project-btn');
    const addTaskBtns = document.querySelectorAll('.add-task-btn');
    
    if (addTaskProjectBtn) {
        addTaskProjectBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            closeAllModals();
            openModal('add-task-modal');
        });
    }
    
    // Add event listeners to all add task buttons
    addTaskBtns.forEach(btn => {
        btn.addEventListener('click', function(event) {
            event.stopPropagation();
            openModal('add-task-modal');
        });
    });

    // Add Task form submission
    const addTaskForm = document.getElementById('add-task-form');
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Here you would normally process the form data and add the task
            alert('Task added successfully!');
            closeAllModals();
        });
    }
    
    // Task priority dropdown functionality
    const taskPrioritySelect = document.getElementById('task-priority');
    if (taskPrioritySelect) {
        taskPrioritySelect.addEventListener('click', function() {
            // This event listener ensures the dropdown opens when clicked
            // The browser handles the rest of the dropdown functionality
        });
    }
    
    // Task assignee dropdown functionality
    const taskAssigneeSelect = document.getElementById('task-assignee');
    if (taskAssigneeSelect) {
        taskAssigneeSelect.addEventListener('click', function() {
            // This event listener ensures the dropdown opens when clicked
            // The browser handles the rest of the dropdown functionality
        });
    }

    // Task filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const taskCards = document.querySelectorAll('.task-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            
            // Filter tasks
            taskCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-status') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Task action buttons functionality
    const taskActionBtns = document.querySelectorAll('.task-card .action-btn');
    taskActionBtns.forEach(btn => {
        btn.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent event bubbling
            const action = this.classList.contains('edit') ? 'Edit' : 
                          this.classList.contains('complete') ? 'Complete' : 
                          this.classList.contains('reopen') ? 'Reopen' : 'View';
            const taskTitle = this.closest('.task-card').querySelector('h3').textContent;
            alert(`${action} task: ${taskTitle} functionality would be implemented here`);
        });
    });
    
    // Announcements page functionality
    const createAnnouncementBtn = document.querySelector('.create-announcement-btn');
    if (createAnnouncementBtn) {
        createAnnouncementBtn.addEventListener('click', function() {
            openModal('create-announcement-modal');
        });
    }
    
    // Create Announcement form submission
    const createAnnouncementForm = document.getElementById('create-announcement-form');
    if (createAnnouncementForm) {
        createAnnouncementForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Here you would normally process the form data and add the announcement
            alert('Team announcement created successfully!');
            closeAllModals();
        });
    }
    
    // Announcement filter functionality
    const announcementFilterBtns = document.querySelectorAll('#announcements-page .filter-tabs .filter-btn');
    const announcementCards = document.querySelectorAll('.announcement-card');
    
    announcementFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active filter button
            announcementFilterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            
            // Filter announcements
            announcementCards.forEach(card => {
                if (filter === 'all' || card.querySelector('.announcement-tag').classList.contains(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Mark announcement as read
    const markReadBtns = document.querySelectorAll('.mark-read-btn');
    markReadBtns.forEach(btn => {
        btn.addEventListener('click', function(event) {
            event.stopPropagation();
            const announcementCard = this.closest('.announcement-card');
            const statusBadge = announcementCard.querySelector('.announcement-status');
            if (statusBadge) {
                statusBadge.remove();
            }
            this.remove();
            
            // Update unread count (in a real app, this would be more dynamic)
            const unreadCount = document.querySelector('.metric-card:nth-child(2) .metric-value');
            if (unreadCount && parseInt(unreadCount.textContent) > 0) {
                unreadCount.textContent = parseInt(unreadCount.textContent) - 1;
            }
        });
    });
    
    // Project detail modal tabs
    const projectTabs = document.querySelectorAll('.project-tabs .tab');
    const projectTabContents = document.querySelectorAll('.project-tab-content');
    
    projectTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            projectTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            projectTabContents.forEach(content => content.style.display = 'none');
            document.getElementById(tabId + '-content').style.display = 'block';
        });
    });

    // Function to update last updated time
    function updateLastUpdated() {
        const now = new Date();
        const minutes = Math.floor((now - lastUpdate) / 60000);
    document.querySelector('.last-updated span').textContent = `${minutes} minutes ago`;
    }

    // Set initial last update time
    const lastUpdate = new Date();
    lastUpdate.setMinutes(lastUpdate.getMinutes() - 2); // Start at 2 minutes ago

    // Update the last updated time every minute
    setInterval(updateLastUpdated, 60000);
});