// Global variable to store current user info
let currentUserInfo = null;

// Check current user role and show/hide admin-only features
function loadCurrentUser() {
    fetch('/api/admin/current-user')
        .then(response => response.json())
        .then(userInfo => {
            currentUserInfo = userInfo;

            // Show Users menu item only for ADMIN role
            if (userInfo.role === 'ADMIN') {
                document.getElementById('users-menu-item').style.display = 'block';
            }
        })
        .catch(error => console.error('Error loading current user:', error));
}

// Section Navigation
document.querySelectorAll('.admin-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.dataset.section;

        // Update menu active state
        document.querySelectorAll('.admin-menu-item').forEach(i => i.classList.remove('active'));
        e.target.classList.add('active');

        // Show selected section
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`${section}-section`).classList.add('active');

        // Load data for the section
        if (section === 'events') {
            loadEvents();
        } else if (section === 'resources') {
            loadResources();
        } else if (section === 'maktoub') {
            loadMaktoub();
        } else if (section === 'users') {
            loadUsers();
        }
    });
});

// Event Management
let editingEventId = null;

function showEventForm() {
    document.getElementById('event-form-container').style.display = 'block';
    document.getElementById('event-form-title').textContent = 'Add New Event';
    document.getElementById('event-form').reset();
    document.getElementById('event-id').value = '';
    editingEventId = null;
}

function hideEventForm() {
    document.getElementById('event-form-container').style.display = 'none';
    document.getElementById('event-form').reset();
    editingEventId = null;
}

function editEvent(id) {
    fetch(`/api/admin/events/${id}`)
        .then(response => response.json())
        .then(event => {
            document.getElementById('event-form-title').textContent = 'Edit Event';
            document.getElementById('event-id').value = event.id;
            document.getElementById('event-title').value = event.title;
            document.getElementById('event-description').value = event.description;
            document.getElementById('event-location').value = event.location;
            document.getElementById('event-date').value = event.eventDate;
            document.getElementById('event-time').value = event.time;
            document.getElementById('event-category').value = event.category;
            document.getElementById('event-form-container').style.display = 'block';
            editingEventId = id;
        })
        .catch(error => console.error('Error loading event:', error));
}

function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        fetch(`/api/admin/events/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            loadEvents();
        })
        .catch(error => console.error('Error deleting event:', error));
    }
}

function loadEvents() {
    fetch('/api/admin/events')
        .then(response => response.json())
        .then(events => {
            const list = document.getElementById('events-list');
            if (events.length === 0) {
                list.innerHTML = '<div class="empty-state">No events found. Click "Add Event" to create one.</div>';
                return;
            }

            list.innerHTML = events.map(event => `
                <div class="list-item">
                    <h4>${event.title}</h4>
                    <p><strong>Description:</strong> ${event.description}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p><strong>Date:</strong> ${new Date(event.eventDate).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${event.time}</p>
                    <p><strong>Category:</strong> ${event.category}</p>
                    <div class="list-item-actions">
                        <button class="btn btn-edit" onclick="editEvent(${event.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteEvent(${event.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error loading events:', error));
}

document.getElementById('event-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const eventData = {
        title: document.getElementById('event-title').value,
        description: document.getElementById('event-description').value,
        location: document.getElementById('event-location').value,
        eventDate: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        category: document.getElementById('event-category').value
    };

    const url = editingEventId
        ? `/api/admin/events/${editingEventId}`
        : '/api/admin/events';

    const method = editingEventId ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
    })
    .then(response => response.json())
    .then(() => {
        hideEventForm();
        loadEvents();
    })
    .catch(error => console.error('Error saving event:', error));
});

// Resource Management
let editingResourceId = null;

function showResourceForm() {
    document.getElementById('resource-form-container').style.display = 'block';
    document.getElementById('resource-form-title').textContent = 'Add New Resource';
    document.getElementById('resource-form').reset();
    document.getElementById('resource-id').value = '';
    editingResourceId = null;
}

function hideResourceForm() {
    document.getElementById('resource-form-container').style.display = 'none';
    document.getElementById('resource-form').reset();
    editingResourceId = null;
}

function editResource(id) {
    fetch(`/api/admin/resources/${id}`)
        .then(response => response.json())
        .then(resource => {
            document.getElementById('resource-form-title').textContent = 'Edit Resource';
            document.getElementById('resource-id').value = resource.id;
            document.getElementById('resource-title').value = resource.title;
            document.getElementById('resource-description').value = resource.description;
            document.getElementById('resource-category').value = resource.category;
            document.getElementById('resource-link').value = resource.link;
            document.getElementById('resource-form-container').style.display = 'block';
            editingResourceId = id;
        })
        .catch(error => console.error('Error loading resource:', error));
}

function deleteResource(id) {
    if (confirm('Are you sure you want to delete this resource?')) {
        fetch(`/api/admin/resources/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            loadResources();
        })
        .catch(error => console.error('Error deleting resource:', error));
    }
}

function loadResources() {
    fetch('/api/admin/resources')
        .then(response => response.json())
        .then(resources => {
            const list = document.getElementById('resources-list');
            if (resources.length === 0) {
                list.innerHTML = '<div class="empty-state">No resources found. Click "Add Resource" to create one.</div>';
                return;
            }

            list.innerHTML = resources.map(resource => `
                <div class="list-item">
                    <h4>${resource.title}</h4>
                    <p><strong>Description:</strong> ${resource.description}</p>
                    <p><strong>Category:</strong> ${resource.category}</p>
                    <p><strong>Link:</strong> <a href="${resource.link}" target="_blank">${resource.link}</a></p>
                    <div class="list-item-actions">
                        <button class="btn btn-edit" onclick="editResource(${resource.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteResource(${resource.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error loading resources:', error));
}

document.getElementById('resource-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const resourceData = {
        title: document.getElementById('resource-title').value,
        description: document.getElementById('resource-description').value,
        category: document.getElementById('resource-category').value,
        link: document.getElementById('resource-link').value
    };

    const url = editingResourceId
        ? `/api/admin/resources/${editingResourceId}`
        : '/api/admin/resources';

    const method = editingResourceId ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(resourceData)
    })
    .then(response => response.json())
    .then(() => {
        hideResourceForm();
        loadResources();
    })
    .catch(error => console.error('Error saving resource:', error));
});

// Maktoub Management
let editingMaktoubId = null;

function showMaktoubForm() {
    document.getElementById('maktoub-form-container').style.display = 'block';
    document.getElementById('maktoub-form-title').textContent = 'Add New Story';
    document.getElementById('maktoub-form').reset();
    document.getElementById('maktoub-id').value = '';
    editingMaktoubId = null;
}

function hideMaktoubForm() {
    document.getElementById('maktoub-form-container').style.display = 'none';
    document.getElementById('maktoub-form').reset();
    editingMaktoubId = null;
}

function editMaktoub(id) {
    fetch(`/api/admin/maktoub/${id}`)
        .then(response => response.json())
        .then(story => {
            document.getElementById('maktoub-form-title').textContent = 'Edit Story';
            document.getElementById('maktoub-id').value = story.id;
            document.getElementById('maktoub-paper-type').value = story.paperType;
            document.getElementById('maktoub-title').value = story.title;
            document.getElementById('maktoub-student-name').value = story.studentName;
            document.getElementById('maktoub-date').value = story.date;
            document.getElementById('maktoub-description').value = story.description;
            // Note: Can't prefill file input for security reasons
            document.getElementById('maktoub-pdf').removeAttribute('required');
            document.getElementById('maktoub-form-container').style.display = 'block';
            editingMaktoubId = id;
        })
        .catch(error => console.error('Error loading story:', error));
}

function deleteMaktoub(id) {
    if (confirm('Are you sure you want to delete this story?')) {
        fetch(`/api/admin/maktoub/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            loadMaktoub();
        })
        .catch(error => console.error('Error deleting story:', error));
    }
}

function loadMaktoub() {
    fetch('/api/admin/maktoub')
        .then(response => response.json())
        .then(stories => {
            const list = document.getElementById('maktoub-list');
            if (stories.length === 0) {
                list.innerHTML = '<div class="empty-state">No stories found. Click "Add Story" to create one.</div>';
                return;
            }

            list.innerHTML = stories.map(story => `
                <div class="list-item">
                    <h4>${story.title}</h4>
                    <p><strong>Type:</strong> ${story.paperType}</p>
                    <p><strong>Student:</strong> ${story.studentName}</p>
                    <p><strong>Date:</strong> ${new Date(story.date).toLocaleDateString()}</p>
                    <p><strong>Description:</strong> ${story.description}</p>
                    <p><strong>PDF:</strong> <a href="${story.pdfUrl}" target="_blank">View PDF</a></p>
                    <div class="list-item-actions">
                        <button class="btn btn-edit" onclick="editMaktoub(${story.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteMaktoub(${story.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error loading stories:', error));
}

document.getElementById('maktoub-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('paperType', document.getElementById('maktoub-paper-type').value);
    formData.append('title', document.getElementById('maktoub-title').value);
    formData.append('studentName', document.getElementById('maktoub-student-name').value);
    formData.append('date', document.getElementById('maktoub-date').value);
    formData.append('description', document.getElementById('maktoub-description').value);

    const pdfFile = document.getElementById('maktoub-pdf').files[0];
    if (pdfFile) {
        formData.append('pdf', pdfFile);
    }

    const url = editingMaktoubId
        ? `/api/admin/maktoub/${editingMaktoubId}`
        : '/api/admin/maktoub';

    const method = editingMaktoubId ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        body: formData
    })
    .then(response => response.json())
    .then(() => {
        hideMaktoubForm();
        loadMaktoub();
        // Reset the required attribute on the file input
        document.getElementById('maktoub-pdf').setAttribute('required', 'required');
    })
    .catch(error => console.error('Error saving story:', error));
});

// Password Change
document.getElementById('password-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const messageDiv = document.getElementById('password-message');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
        messageDiv.textContent = 'New passwords do not match';
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';
        return;
    }

    // Validate password length
    if (newPassword.length < 8) {
        messageDiv.textContent = 'Password must be at least 8 characters long';
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';
        return;
    }

    const passwordData = {
        currentPassword: currentPassword,
        newPassword: newPassword
    };

    fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData)
    })
    .then(response => {
        if (response.ok) {
            return response.text().then(text => {
                messageDiv.textContent = text;
                messageDiv.className = 'message success';
                messageDiv.style.display = 'block';
                document.getElementById('password-form').reset();
            });
        } else {
            return response.text().then(text => {
                messageDiv.textContent = text;
                messageDiv.className = 'message error';
                messageDiv.style.display = 'block';
            });
        }
    })
    .catch(error => {
        console.error('Error changing password:', error);
        messageDiv.textContent = 'An error occurred while changing password';
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';
    });
});

// User Management
function showUserForm() {
    document.getElementById('user-form-container').style.display = 'block';
    document.getElementById('user-form').reset();
    document.getElementById('user-form-message').style.display = 'none';
}

function hideUserForm() {
    document.getElementById('user-form-container').style.display = 'none';
    document.getElementById('user-form').reset();
    document.getElementById('user-form-message').style.display = 'none';
}

function deleteUser(id, username) {
    if (confirm(`Are you sure you want to delete user "${username}"?`)) {
        fetch(`/api/admin/users/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                loadUsers();
            } else {
                return response.text().then(text => {
                    alert('Error: ' + text);
                });
            }
        })
        .catch(error => console.error('Error deleting user:', error));
    }
}

function loadUsers() {
    fetch('/api/admin/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Access denied');
            }
            return response.json();
        })
        .then(users => {
            const list = document.getElementById('users-list');
            if (users.length === 0) {
                list.innerHTML = '<div class="empty-state">No users found. Click "Add User" to create one.</div>';
                return;
            }

            list.innerHTML = users.map(user => `
                <div class="list-item">
                    <h4>${user.username}</h4>
                    <p><strong>Role:</strong> <span class="user-role ${user.role.toLowerCase()}">${user.role}</span></p>
                    <div class="list-item-actions">
                        ${user.id !== currentUserInfo?.id ?
                            `<button class="btn btn-danger" onclick="deleteUser(${user.id}, '${user.username}')">Delete</button>`
                            : '<span class="current-user-badge">Current User</span>'}
                    </div>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error loading users:', error);
            const list = document.getElementById('users-list');
            list.innerHTML = '<div class="empty-state error">You do not have permission to view users.</div>';
        });
}

document.getElementById('user-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const messageDiv = document.getElementById('user-form-message');
    const userData = {
        username: document.getElementById('user-username').value,
        password: document.getElementById('user-password').value,
        role: document.getElementById('user-role').value
    };

    fetch('/api/admin/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            return response.json().then(() => {
                messageDiv.textContent = 'User created successfully!';
                messageDiv.className = 'message success';
                messageDiv.style.display = 'block';
                document.getElementById('user-form').reset();
                loadUsers();
                setTimeout(() => {
                    hideUserForm();
                }, 1500);
            });
        } else {
            return response.text().then(text => {
                messageDiv.textContent = text;
                messageDiv.className = 'message error';
                messageDiv.style.display = 'block';
            });
        }
    })
    .catch(error => {
        console.error('Error creating user:', error);
        messageDiv.textContent = 'An error occurred while creating user';
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';
    });
});

// Load initial data
loadCurrentUser();
loadEvents();
