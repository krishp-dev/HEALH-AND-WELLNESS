class UserAuth {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.loadingOverlay = document.querySelector('.loading-overlay');
        this.avatarInput = document.getElementById('avatarInput');
        this.avatarPreview = document.getElementById('avatarPreview');
        this.notification = document.getElementById('notification');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkExistingUser();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.avatarInput.addEventListener('change', (e) => this.handleAvatarChange(e));
    }

    checkExistingUser() {
        const userData = localStorage.getItem('moodTrackerUser');
        if (userData) {
            window.location.href = 'index.html';
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.showLoading();

        const userData = {
            fullName: document.getElementById('fullName').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            email: document.getElementById('email').value,
            avatar: this.avatarPreview.src,
            registrationDate: new Date().toISOString()
        };

        // Simulate API call
        setTimeout(() => {
            try {
                this.saveUser(userData);
                this.showNotification('Registration successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } catch (error) {
                this.showNotification('Error saving user data. Please try again.', 'error');
                this.hideLoading();
            }
        }, 1500);
    }

    handleAvatarChange(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                this.showNotification('Image size should be less than 5MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                this.avatarPreview.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    saveUser(userData) {
        localStorage.setItem('moodTrackerUser', JSON.stringify(userData));
    }

    showLoading() {
        this.loadingOverlay.style.display = 'flex';
    }

    hideLoading() {
        this.loadingOverlay.style.display = 'none';
    }

    showNotification(message, type = 'success') {
        this.notification.textContent = message;
        this.notification.className = `notification ${type} show`;

        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }

    validateForm() {
        const name = document.getElementById('fullName').value;
        const age = document.getElementById('age').value;
        const gender = document.getElementById('gender').value;

        if (!name || !age || !gender) {
            this.showNotification('Please fill in all required fields', 'error');
            return false;
        }

        if (age < 13 || age > 120) {
            this.showNotification('Age must be between 13 and 120', 'error');
            return false;
        }

        return true;
    }
}

// Initialize the auth system when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    new UserAuth();
});

// Add form animations
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

// Add hover animations
document.querySelectorAll('.form-group').forEach(group => {
    group.addEventListener('mouseover', () => {
        group.style.transform = 'translateX(5px)';
    });

    group.addEventListener('mouseout', () => {
        group.style.transform = 'translateX(0)';
    });
});