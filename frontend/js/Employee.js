document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    loadPage('dashboard');
    
    // Add event listeners to menu items
    const menuItems = document.querySelectorAll('.menu li');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked menu item
            this.classList.add('active');
            
            // Load the corresponding page
            const page = this.getAttribute('data-page');
            if (page !== 'timesheet') { // Skip timesheet as it's being removed
                loadPage(page);
            }
        });
    });
    
    // Add event listeners for interactive elements
    document.addEventListener('click', function(e) {
        // Project details modal
        if (e.target.classList.contains('view-details')) {
            showProjectDetailsModal();
        }
        
        // Announcement details modal
        if (e.target.classList.contains('read-more')) {
            showAnnouncementModal();
        }
        
        // Status dropdown
        if (e.target.closest('.filter button') && e.target.closest('.filter button').textContent.includes('Status')) {
            e.preventDefault(); // Prevent default action
            showStatusDropdown();
            
            // Position the dropdown below the button
            const button = e.target.closest('.filter button');
            const optionsContainer = document.querySelector('.options-container');
            if (button && optionsContainer) {
                const buttonRect = button.getBoundingClientRect();
                optionsContainer.style.top = (buttonRect.bottom + window.scrollY) + 'px';
                optionsContainer.style.left = (buttonRect.left + window.scrollX) + 'px';
            }
        }
        
        // Priority dropdown
        if (e.target.closest('.filter button') && e.target.closest('.filter button').textContent.includes('Priority')) {
            e.preventDefault(); // Prevent default action
            toggleSidebar();
            
            // Position the dropdown below the button
            const button = e.target.closest('.filter button');
            const optionsContainer = document.querySelector('.options-container');
            if (button && optionsContainer) {
                const buttonRect = button.getBoundingClientRect();
                optionsContainer.style.top = (buttonRect.bottom + window.scrollY) + 'px';
                optionsContainer.style.left = (buttonRect.left + window.scrollX) + 'px';
            }
        }
        
        // Close modals when clicking outside
        if (e.target.classList.contains('modal-overlay')) {
            closeAllModals();
        }
        
        // Close options containers when clicking outside of them and not on filter buttons
        if (!e.target.closest('.options-container') && 
            !e.target.closest('.filter button')) {
            const optionsContainers = document.querySelectorAll('.options-container');
            if (optionsContainers.length > 0) {
                optionsContainers.forEach(container => container.remove());
                
                // Remove selected class from filter buttons
                const filterButtons = document.querySelectorAll('.filter button');
                filterButtons.forEach(button => button.classList.remove('selected'));
            }
        }
    });
    
    // Remove timesheet button from sidebar
    const timesheetMenuItem = document.querySelector('.menu li[data-page="timesheet"]');
    if (timesheetMenuItem) {
        timesheetMenuItem.remove();
    }
});

function loadPage(pageName) {
    const pageContent = document.getElementById('page-content');
    const template = document.getElementById(`${pageName}-template`);
    
    if (template) {
        pageContent.innerHTML = '';
        const content = template.content.cloneNode(true);
        pageContent.appendChild(content);
    } else {
        console.error(`Template for ${pageName} not found`);
    }
}

function showProjectDetailsModal() {
    closeAllModals();
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>Website Redesign</h2>
            <button class="close-modal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <div class="project-details">
                <div class="detail-item">
                    <span class="label">Description:</span>
                    <span class="value">Complete overhaul of company website</span>
                </div>
                <div class="detail-item">
                    <span class="label">Status:</span>
                    <span class="value status-active">Active</span>
                </div>
                <div class="detail-item">
                    <span class="label">Progress:</span>
                    <div class="progress-bar">
                        <div class="progress" style="width: 65%;"></div>
                    </div>
                    <span class="value">65%</span>
                </div>
                <div class="detail-item">
                    <span class="label">Due Date:</span>
                    <span class="value">12/31/2024</span>
                </div>
                <div class="detail-item">
                    <span class="label">Team Members:</span>
                    <span class="value">2 members</span>
                </div>
            </div>
        </div>
    `;
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    const closeButton = modalContent.querySelector('.close-modal');
    closeButton.addEventListener('click', closeAllModals);
}

function showAnnouncementModal() {
    closeAllModals();
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>Team Building Event</h2>
            <button class="close-modal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <div class="announcement-details">
                <p>Join us for a team building event next Friday at 3 PM in the conference room.</p>
                <div class="meta-info">
                    <div class="meta-item">
                        <i class="fas fa-user"></i> Team Leader
                    </div>
                    <div class="meta-item">
                        <i class="far fa-calendar"></i> September 6, 2025
                    </div>
                    <div class="meta-item">
                        <i class="far fa-clock"></i> Just now
                    </div>
                </div>
            </div>
        </div>
    `;
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    const closeButton = modalContent.querySelector('.close-modal');
    closeButton.addEventListener('click', closeAllModals);
}

function showStatusDropdown() {
    const existingOptionsContainer = document.querySelector('.options-container');
    if (existingOptionsContainer) {
        existingOptionsContainer.remove();
        return;
    }
    const statusButton = document.querySelector('.filter button:first-child');
    if (statusButton) {
        statusButton.classList.add('selected');
    }
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    const optionsHeader = document.createElement('div');
    optionsHeader.className = 'options-header';
    optionsHeader.textContent = 'Select Status';
    optionsContainer.appendChild(optionsHeader);
    const optionsList = document.createElement('div');
    optionsList.className = 'options-list';
    const statuses = ['All Status', 'To Do', 'In Progress', 'Completed', 'Overdue'];
    statuses.forEach(status => {
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        optionItem.textContent = status;
        if (status === 'All Status') {
            optionItem.classList.add('selected');
        }
        optionItem.addEventListener('click', function() {
            const statusButton = document.querySelector('.filter button:first-child');
            if (statusButton) {
                statusButton.innerHTML = status + ' <i class="fas fa-chevron-down"></i>';
            }
            filterTasksByStatus(status);
            optionsContainer.remove();
        });
        optionsList.appendChild(optionItem);
    });
    optionsContainer.appendChild(optionsList);
    const tasksContainer = document.querySelector('.tasks-container');
    if (tasksContainer) {
        tasksContainer.parentNode.insertBefore(optionsContainer, tasksContainer);
    }
}

function toggleSidebar() {
    const existingOptionsContainer = document.querySelector('.options-container');
    if (existingOptionsContainer) {
        existingOptionsContainer.remove();
        return;
    }
    const priorityButton = document.querySelector('.filter button:nth-child(2)');
    if (priorityButton) {
        priorityButton.classList.add('selected');
    }
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    const optionsHeader = document.createElement('div');
    optionsHeader.className = 'options-header';
    optionsHeader.textContent = 'Select Priority';
    optionsContainer.appendChild(optionsHeader);
    const optionsList = document.createElement('div');
    optionsList.className = 'options-list';
    const priorities = ['All Priority', 'High', 'Medium', 'Low'];
    priorities.forEach(priority => {
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        optionItem.textContent = priority;
        if (priority === 'All Priority') {
            optionItem.classList.add('selected');
        }
        optionItem.addEventListener('click', function() {
            const priorityButton = document.querySelector('.filter button:nth-child(2)');
            if (priorityButton) {
                priorityButton.innerHTML = priority + ' <i class="fas fa-chevron-down"></i>';
            }
            filterTasksByPriority(priority);
            optionsContainer.remove();
        });
        optionsList.appendChild(optionItem);
    });
    optionsContainer.appendChild(optionsList);
    const tasksContainer = document.querySelector('.tasks-container');
    if (tasksContainer) {
        tasksContainer.parentNode.insertBefore(optionsContainer, tasksContainer);
    }
}

function closeAllModals() {
    const existingModals = document.querySelectorAll('.modal-overlay');
    existingModals.forEach(modal => modal.remove());
    const existingDropdowns = document.querySelectorAll('.dropdown-menu');
    existingDropdowns.forEach(dropdown => dropdown.remove());
    const existingOptionsContainers = document.querySelectorAll('.options-container');
    existingOptionsContainers.forEach(container => container.remove());
}

function filterTasksByStatus(status) {
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(card => {
        const taskStatus = card.querySelector('.task-status').textContent.trim();
        if (status === 'All Status' || taskStatus.includes(status)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterTasksByPriority(priority) {
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(card => {
        const priorityElement = card.querySelector('.task-priority');
        let taskPriority = '';
        if (priorityElement.classList.contains('high')) {
            taskPriority = 'High';
        } else if (priorityElement.classList.contains('medium')) {
            taskPriority = 'Medium';
        } else if (priorityElement.classList.contains('low')) {
            taskPriority = 'Low';
        }
        if (priority === 'All Priority' || taskPriority === priority) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}