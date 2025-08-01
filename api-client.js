// Frontend API Integration for Portfolio Backend
// This file handles all API calls to the backend server

class PortfolioAPI {
    constructor(baseURL = 'http://localhost:3000/api') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('portfolio_token');
    }

    // Helper method to make authenticated requests
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add authorization header if token exists
        if (this.token && !config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Helper method for FormData requests (file uploads)
    async makeFormRequest(endpoint, formData) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: 'POST',
            headers: {},
            body: formData
        };

        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('Form request failed:', error);
            throw error;
        }
    }

    // AUTHENTICATION
    async login(username, password) {
        try {
            const response = await this.makeRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });

            if (response.success) {
                this.token = response.token;
                localStorage.setItem('portfolio_token', this.token);
                localStorage.setItem('portfolio_user', JSON.stringify(response.user));
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        this.token = null;
        localStorage.removeItem('portfolio_token');
        localStorage.removeItem('portfolio_user');
    }

    async verifyToken() {
        try {
            return await this.makeRequest('/auth/verify');
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    // PROFILE
    async getProfile() {
        return await this.makeRequest('/profile');
    }

    async updateProfile(profileData, profilePhoto = null) {
        if (profilePhoto) {
            const formData = new FormData();
            Object.keys(profileData).forEach(key => {
                formData.append(key, profileData[key]);
            });
            formData.append('profilePhoto', profilePhoto);

            return await this.makeFormRequest('/profile', formData);
        } else {
            return await this.makeRequest('/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });
        }
    }

    // PROJECTS
    async getProjects() {
        return await this.makeRequest('/projects');
    }

    async getProject(id) {
        return await this.makeRequest(`/projects/${id}`);
    }

    async createProject(projectData, imageFile = null) {
        const formData = new FormData();
        Object.keys(projectData).forEach(key => {
            if (key === 'technologies' && Array.isArray(projectData[key])) {
                formData.append(key, JSON.stringify(projectData[key]));
            } else {
                formData.append(key, projectData[key]);
            }
        });

        if (imageFile) {
            formData.append('image', imageFile);
        }

        return await this.makeFormRequest('/projects', formData);
    }

    async updateProject(id, projectData, imageFile = null) {
        const formData = new FormData();
        Object.keys(projectData).forEach(key => {
            if (key === 'technologies' && Array.isArray(projectData[key])) {
                formData.append(key, JSON.stringify(projectData[key]));
            } else {
                formData.append(key, projectData[key]);
            }
        });

        if (imageFile) {
            formData.append('image', imageFile);
        }

        const url = `${this.baseURL}/projects/${id}`;
        const config = {
            method: 'PUT',
            headers: {},
            body: formData
        };

        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, config);
        return await response.json();
    }

    async deleteProject(id) {
        return await this.makeRequest(`/projects/${id}`, {
            method: 'DELETE'
        });
    }

    // MEMORIES
    async getMemories(category = null) {
        const endpoint = category ? `/memories/category/${category}` : '/memories';
        return await this.makeRequest(endpoint);
    }

    async createMemory(memoryData, videoFile) {
        const formData = new FormData();
        Object.keys(memoryData).forEach(key => {
            formData.append(key, memoryData[key]);
        });
        formData.append('video', videoFile);

        return await this.makeFormRequest('/memories', formData);
    }

    async updateMemory(id, memoryData, videoFile = null) {
        const formData = new FormData();
        Object.keys(memoryData).forEach(key => {
            formData.append(key, memoryData[key]);
        });

        if (videoFile) {
            formData.append('video', videoFile);
        }

        const url = `${this.baseURL}/memories/${id}`;
        const config = {
            method: 'PUT',
            headers: {},
            body: formData
        };

        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, config);
        return await response.json();
    }

    async deleteMemory(id) {
        return await this.makeRequest(`/memories/${id}`, {
            method: 'DELETE'
        });
    }

    // PHOTOS
    async getPhotos(category = null) {
        const endpoint = category ? `/photos?category=${category}` : '/photos';
        return await this.makeRequest(endpoint);
    }

    async uploadPhoto(photoFile, caption = '', category = 'gallery') {
        const formData = new FormData();
        formData.append('photo', photoFile);
        formData.append('caption', caption);
        formData.append('category', category);

        return await this.makeFormRequest('/photos', formData);
    }

    async uploadMultiplePhotos(photoFiles, category = 'gallery') {
        const formData = new FormData();
        photoFiles.forEach(file => {
            formData.append('photos', file);
        });
        formData.append('category', category);

        return await this.makeFormRequest('/photos/bulk', formData);
    }

    async deletePhoto(id) {
        return await this.makeRequest(`/photos/${id}`, {
            method: 'DELETE'
        });
    }

    // SKILLS
    async getSkills() {
        return await this.makeRequest('/skills');
    }

    async createSkill(skillData) {
        return await this.makeRequest('/skills', {
            method: 'POST',
            body: JSON.stringify(skillData)
        });
    }

    // CONTACT
    async sendContactMessage(messageData) {
        return await this.makeRequest('/contact', {
            method: 'POST',
            body: JSON.stringify(messageData)
        });
    }

    // UTILITY METHODS
    isAuthenticated() {
        return !!this.token;
    }

    getStoredUser() {
        const user = localStorage.getItem('portfolio_user');
        return user ? JSON.parse(user) : null;
    }
}

// Enhanced Admin System Integration
class AdminSystem {
    constructor() {
        this.api = new PortfolioAPI();
        this.isLoggedIn = false;
        this.currentUser = null;
    }

    async initialize() {
        // Check if user is already logged in
        const token = localStorage.getItem('portfolio_token');
        if (token) {
            try {
                const response = await this.api.verifyToken();
                if (response.valid) {
                    this.isLoggedIn = true;
                    this.currentUser = response.user;
                    this.showAdminFeatures();
                }
            } catch (error) {
                console.log('Token invalid, requiring login');
                this.logout();
            }
        }
    }

    async login(username, password) {
        try {
            const response = await this.api.login(username, password);
            if (response.success) {
                this.isLoggedIn = true;
                this.currentUser = response.user;
                this.showAdminFeatures();
                showMessage('Login successful! Welcome back, ' + username, 'success');
                return true;
            }
        } catch (error) {
            showMessage('Login failed: ' + error.message, 'error');
            return false;
        }
    }

    logout() {
        this.api.logout();
        this.isLoggedIn = false;
        this.currentUser = null;
        this.hideAdminFeatures();
        showMessage('Logged out successfully', 'info');
    }

    showAdminFeatures() {
        // Show admin-only elements
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(element => {
            element.style.display = 'block';
        });

        // Update admin dashboard visibility
        const adminDashboard = document.getElementById('adminDashboard');
        if (adminDashboard) {
            adminDashboard.classList.remove('hidden');
        }
    }

    hideAdminFeatures() {
        // Hide admin-only elements
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(element => {
            element.style.display = 'none';
        });

        // Hide admin dashboard
        const adminDashboard = document.getElementById('adminDashboard');
        if (adminDashboard) {
            adminDashboard.classList.add('hidden');
        }
    }

    // Enhanced upload methods with progress tracking
    async uploadMemoryWithProgress(memoryData, videoFile, progressCallback) {
        const formData = new FormData();
        Object.keys(memoryData).forEach(key => {
            formData.append(key, memoryData[key]);
        });
        formData.append('video', videoFile);

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    if (progressCallback) progressCallback(percentComplete);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 201) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error('Upload failed'));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed'));
            });

            xhr.open('POST', `${this.api.baseURL}/memories`);
            xhr.setRequestHeader('Authorization', `Bearer ${this.api.token}`);
            xhr.send(formData);
        });
    }

    async uploadPhotosWithProgress(photoFiles, category, progressCallback) {
        const formData = new FormData();
        photoFiles.forEach(file => {
            formData.append('photos', file);
        });
        formData.append('category', category);

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    if (progressCallback) progressCallback(percentComplete);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 201) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error('Upload failed'));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed'));
            });

            xhr.open('POST', `${this.api.baseURL}/photos/bulk`);
            xhr.setRequestHeader('Authorization', `Bearer ${this.api.token}`);
            xhr.send(formData);
        });
    }
}

// Initialize API and Admin System
const portfolioAPI = new PortfolioAPI();
const adminSystem = new AdminSystem();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    adminSystem.initialize();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioAPI, AdminSystem };
}
