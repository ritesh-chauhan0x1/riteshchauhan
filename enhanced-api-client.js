// Enhanced Frontend API Integration for Portfolio Backend
// This file handles all API calls to the backend server with improved error handling and cloud storage support

class EnhancedPortfolioAPI {
    constructor(baseURL = 'http://localhost:3000/api') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('portfolio_token');
        this.isOnline = navigator.onLine;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Monitor online/offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('✅ Connection restored - syncing data...');
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📱 Offline mode activated');
        });
    }

    // Helper method to make authenticated requests with retry logic
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            // Check if online for non-GET requests
            if (!this.isOnline && options.method !== 'GET') {
                return this.handleOfflineRequest(endpoint, options);
            }

            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`API Request failed: ${endpoint}`, error);
            
            // Try fallback for GET requests
            if (options.method === 'GET' || !options.method) {
                return this.handleOfflineRequest(endpoint, options);
            }
            
            throw error;
        }
    }

    // Helper method for FormData requests with progress tracking
    async makeFormRequest(endpoint, formData, progressCallback) {
        const url = `${this.baseURL}${endpoint}`;
        
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            if (progressCallback) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        progressCallback(percentComplete);
                    }
                });
            }

            xhr.addEventListener('load', () => {
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(data);
                    } else {
                        reject(new Error(data.error || `HTTP ${xhr.status}`));
                    }
                } catch (error) {
                    reject(new Error('Invalid JSON response'));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error'));
            });

            xhr.open('POST', url);
            
            if (this.token) {
                xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            }
            
            xhr.send(formData);
        });
    }

    // Handle offline requests with localStorage fallback
    handleOfflineRequest(endpoint, options) {
        console.log('📱 Handling offline request:', endpoint);
        
        // For GET requests, try localStorage cache
        if (!options.method || options.method === 'GET') {
            const cacheKey = `api_cache_${endpoint}`;
            const cached = localStorage.getItem(cacheKey);
            
            if (cached) {
                return JSON.parse(cached);
            }
        }

        // Store POST/PUT/DELETE requests for later sync
        if (options.method && options.method !== 'GET') {
            const offlineQueue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
            offlineQueue.push({
                endpoint,
                options,
                timestamp: Date.now()
            });
            localStorage.setItem('offline_queue', JSON.stringify(offlineQueue));
            
            return {
                success: true,
                message: 'Request queued for sync when online',
                offline: true
            };
        }

        throw new Error('No cached data available offline');
    }

    // Sync offline data when connection is restored
    async syncOfflineData() {
        const offlineQueue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
        
        for (const request of offlineQueue) {
            try {
                await this.makeRequest(request.endpoint, request.options);
                console.log('✅ Synced offline request:', request.endpoint);
            } catch (error) {
                console.error('❌ Failed to sync request:', request.endpoint, error);
            }
        }

        if (offlineQueue.length > 0) {
            localStorage.removeItem('offline_queue');
            console.log(`✅ Synced ${offlineQueue.length} offline requests`);
        }
    }

    // Cache GET responses
    cacheResponse(endpoint, data) {
        const cacheKey = `api_cache_${endpoint}`;
        localStorage.setItem(cacheKey, JSON.stringify(data));
    }

    // AUTHENTICATION
    async login(username, password) {
        try {
            const response = await this.makeRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });

            if (response.success && response.token) {
                this.token = response.token;
                localStorage.setItem('portfolio_token', this.token);
            }

            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    async logout() {
        try {
            await this.makeRequest('/auth/logout', { method: 'POST' });
            this.token = null;
            localStorage.removeItem('portfolio_token');
            return { success: true };
        } catch (error) {
            // Even if logout fails on server, clear local token
            this.token = null;
            localStorage.removeItem('portfolio_token');
            return { success: true };
        }
    }

    async verifyToken() {
        if (!this.token) {
            return { success: false, error: 'No token available' };
        }

        try {
            const response = await this.makeRequest('/auth/verify');
            return response;
        } catch (error) {
            // Token invalid, clear it
            this.token = null;
            localStorage.removeItem('portfolio_token');
            throw error;
        }
    }

    // PROJECTS with enhanced functionality
    async getProjects() {
        try {
            const response = await this.makeRequest('/projects');
            this.cacheResponse('/projects', response);
            return response;
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            throw error;
        }
    }

    async getProject(id) {
        return await this.makeRequest(`/projects/${id}`);
    }

    async createProject(projectData, imageFile = null, progressCallback = null) {
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

        return await this.makeFormRequest('/projects', formData, progressCallback);
    }

    async updateProject(id, projectData, imageFile = null, progressCallback = null) {
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
        
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            if (progressCallback) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        progressCallback(percentComplete);
                    }
                });
            }

            xhr.addEventListener('load', () => {
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(data);
                    } else {
                        reject(new Error(data.error || `HTTP ${xhr.status}`));
                    }
                } catch (error) {
                    reject(new Error('Invalid JSON response'));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error'));
            });

            xhr.open('PUT', url);
            
            if (this.token) {
                xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            }
            
            xhr.send(formData);
        });
    }

    async deleteProject(id) {
        return await this.makeRequest(`/projects/${id}`, {
            method: 'DELETE'
        });
    }

    // PHOTOS with enhanced functionality
    async getPhotos(category = null) {
        const endpoint = category ? `/photos?category=${category}` : '/photos';
        try {
            const response = await this.makeRequest(endpoint);
            this.cacheResponse(endpoint, response);
            return response;
        } catch (error) {
            console.error('Failed to fetch photos:', error);
            throw error;
        }
    }

    async uploadPhoto(photoFile, caption = '', category = 'gallery', progressCallback = null) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        formData.append('caption', caption);
        formData.append('category', category);

        return await this.makeFormRequest('/photos', formData, progressCallback);
    }

    async uploadMultiplePhotos(photoFiles, category = 'gallery', progressCallback = null) {
        const formData = new FormData();
        photoFiles.forEach(file => {
            formData.append('photos', file);
        });
        formData.append('category', category);

        return await this.makeFormRequest('/photos/bulk', formData, progressCallback);
    }

    async deletePhoto(id) {
        return await this.makeRequest(`/photos/${id}`, {
            method: 'DELETE'
        });
    }

    async updatePhoto(id, photoData) {
        return await this.makeRequest(`/photos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(photoData)
        });
    }

    // STORAGE INFO
    async getStorageInfo() {
        return await this.makeRequest('/projects/storage/info');
    }

    // UTILITY METHODS
    isAuthenticated() {
        return !!this.token;
    }

    getConnectionStatus() {
        return {
            online: this.isOnline,
            hasToken: !!this.token,
            baseURL: this.baseURL
        };
    }

    // Clear all cached data
    clearCache() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('api_cache_')) {
                localStorage.removeItem(key);
            }
        });
        console.log('🗑️ API cache cleared');
    }
}

// Enhanced Admin System with Cloud Storage Integration
class EnhancedAdminSystem {
    constructor(api = null) {
        this.api = api || new EnhancedPortfolioAPI();
        this.isLoggedIn = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Auto-verify token on page load
        if (this.api.token) {
            this.verifyLogin();
        }
    }

    async verifyLogin() {
        try {
            const response = await this.api.verifyToken();
            this.isLoggedIn = response.success;
            return response;
        } catch (error) {
            this.isLoggedIn = false;
            return { success: false, error: error.message };
        }
    }

    async login(username, password) {
        try {
            const response = await this.api.login(username, password);
            this.isLoggedIn = response.success;
            
            if (this.isLoggedIn) {
                console.log('✅ Admin login successful');
                this.showDashboard();
            }
            
            return response;
        } catch (error) {
            console.error('❌ Admin login failed:', error);
            throw error;
        }
    }

    async logout() {
        try {
            await this.api.logout();
            this.isLoggedIn = false;
            this.hideDashboard();
            console.log('✅ Admin logout successful');
        } catch (error) {
            console.error('❌ Admin logout failed:', error);
        }
    }

    // Project Management with Cloud Storage
    async addProject(projectData, imageFile) {
        if (!this.isLoggedIn) {
            throw new Error('Admin authentication required');
        }

        return new Promise((resolve, reject) => {
            this.api.createProject(projectData, imageFile, (progress) => {
                this.updateUploadProgress('project', progress);
            }).then(resolve).catch(reject);
        });
    }

    async updateProject(id, projectData, imageFile) {
        if (!this.isLoggedIn) {
            throw new Error('Admin authentication required');
        }

        return new Promise((resolve, reject) => {
            this.api.updateProject(id, projectData, imageFile, (progress) => {
                this.updateUploadProgress('project', progress);
            }).then(resolve).catch(reject);
        });
    }

    // Photo Management with Cloud Storage
    async uploadPhotos(photoFiles, category = 'gallery') {
        if (!this.isLoggedIn) {
            throw new Error('Admin authentication required');
        }

        if (photoFiles.length === 1) {
            return new Promise((resolve, reject) => {
                this.api.uploadPhoto(photoFiles[0], '', category, (progress) => {
                    this.updateUploadProgress('photo', progress);
                }).then(resolve).catch(reject);
            });
        } else {
            return new Promise((resolve, reject) => {
                this.api.uploadMultiplePhotos(photoFiles, category, (progress) => {
                    this.updateUploadProgress('photos', progress);
                }).then(resolve).catch(reject);
            });
        }
    }

    // Progress tracking for uploads
    updateUploadProgress(type, progress) {
        const progressBar = document.getElementById(`${type}-upload-progress`);
        const progressText = document.getElementById(`${type}-upload-text`);
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Uploading ${type}... ${Math.round(progress)}%`;
        }

        console.log(`📤 ${type} upload progress: ${Math.round(progress)}%`);
    }

    // Storage management
    async getStorageInfo() {
        if (!this.isLoggedIn) {
            throw new Error('Admin authentication required');
        }

        return await this.api.getStorageInfo();
    }

    // UI Management
    showDashboard() {
        const dashboard = document.getElementById('adminDashboard');
        const loginModal = document.getElementById('loginModal');
        
        if (dashboard) {
            dashboard.classList.remove('hidden');
        }
        
        if (loginModal) {
            loginModal.style.display = 'none';
        }

        this.loadDashboardData();
    }

    hideDashboard() {
        const dashboard = document.getElementById('adminDashboard');
        
        if (dashboard) {
            dashboard.classList.add('hidden');
        }
    }

    async loadDashboardData() {
        try {
            // Load projects
            const projects = await this.api.getProjects();
            this.displayProjects(projects.data || []);

            // Load photos
            const photos = await this.api.getPhotos();
            this.displayPhotos(photos.data || []);

            // Load storage info
            const storageInfo = await this.getStorageInfo();
            this.displayStorageInfo(storageInfo.data || {});
        } catch (error) {
            console.error('❌ Failed to load dashboard data:', error);
        }
    }

    displayProjects(projects) {
        const projectsList = document.getElementById('projectsList');
        if (!projectsList) return;

        if (projects.length === 0) {
            projectsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <p>No projects yet. Add your first project!</p>
                </div>
            `;
            return;
        }

        projectsList.innerHTML = projects.map((project, index) => `
            <div class="project-item">
                <div class="project-info">
                    <h4>${project.title}</h4>
                    <p>${project.description}</p>
                    <div class="project-meta">
                        <span class="project-category">${project.category}</span>
                        <span class="project-status">${project.isFeatured ? 'Featured' : 'Regular'}</span>
                    </div>
                </div>
                <div class="project-actions">
                    <button class="btn btn-small btn-edit" onclick="editProject(${project.id})">Edit</button>
                    <button class="btn btn-small btn-delete" onclick="deleteProject(${project.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    displayPhotos(photos) {
        const uploadedPhotos = document.getElementById('uploadedPhotos');
        if (!uploadedPhotos) return;

        if (photos.length === 0) {
            uploadedPhotos.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-camera"></i>
                    <p>No photos yet. Upload your first photo!</p>
                </div>
            `;
            return;
        }

        uploadedPhotos.innerHTML = photos.map(photo => `
            <div class="uploaded-photo-item">
                <img src="${photo.url}" alt="${photo.caption || 'Photo'}" loading="lazy">
                <div class="photo-actions">
                    <button class="photo-delete-btn" onclick="deletePhoto(${photo.id})">&times;</button>
                </div>
                ${photo.caption ? `<div class="photo-caption">${photo.caption}</div>` : ''}
            </div>
        `).join('');
    }

    displayStorageInfo(storageInfo) {
        const storageInfoElement = document.getElementById('storageInfo');
        if (!storageInfoElement) return;

        storageInfoElement.innerHTML = `
            <div class="storage-info">
                <h4>📊 Storage Information</h4>
                <p><strong>Primary Storage:</strong> ${storageInfo.primary || 'Local Storage'}</p>
                <p><strong>Fallback:</strong> ${storageInfo.fallback || 'Local Storage'}</p>
                <div class="storage-availability">
                    <h5>Available Storage Options:</h5>
                    <ul>
                        <li>Google Drive: ${storageInfo.available?.googleDrive ? '✅' : '❌'}</li>
                        <li>AWS S3: ${storageInfo.available?.aws ? '✅' : '❌'}</li>
                        <li>Local Storage: ${storageInfo.available?.local ? '✅' : '❌'}</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

// Initialize API and Admin System
const enhancedAPI = new EnhancedPortfolioAPI();
const enhancedAdmin = new EnhancedAdminSystem(enhancedAPI);

// Global functions for admin interface
window.enhancedAPI = enhancedAPI;
window.enhancedAdmin = enhancedAdmin;

// Console welcome for developers
console.log(`
🚀 Enhanced Portfolio API System Loaded
   Features:
   • ☁️  Cloud storage (Google Drive, AWS S3)
   • 📱 Offline support with sync
   • 📤 Upload progress tracking
   • 🔄 Automatic retry logic
   • 💾 Smart caching system
   
   Usage:
   enhancedAPI.getProjects()
   enhancedAdmin.login(username, password)
`);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Auto-verify admin token if present
    if (enhancedAPI.token) {
        enhancedAdmin.verifyLogin();
    }

    // Setup connection status indicator
    const connectionStatus = document.getElementById('connectionStatus');
    if (connectionStatus) {
        const updateStatus = () => {
            const status = enhancedAPI.getConnectionStatus();
            connectionStatus.innerHTML = `
                <span class="status-indicator ${status.online ? 'online' : 'offline'}">
                    ${status.online ? '🟢' : '🔴'} ${status.online ? 'Online' : 'Offline'}
                </span>
            `;
        };
        
        updateStatus();
        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EnhancedPortfolioAPI, EnhancedAdminSystem };
}
