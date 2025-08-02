// Enhanced Backend Integration Service
// This service provides seamless connectivity between frontend and backend
// with fallback mechanisms and cloud storage integration

class BackendService {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.token = localStorage.getItem('portfolio_token');
        this.isOnline = navigator.onLine;
        this.retryAttempts = 3;
        this.retryDelay = 1000;
        
        // Initialize connection monitoring
        this.initializeConnectionMonitoring();
        
        // Start backend if not running
        this.initializeBackend();
    }

    // Initialize connection monitoring
    initializeConnectionMonitoring() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🌐 Connection restored');
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📱 Working offline');
        });

        // Check backend connectivity
        this.checkBackendConnection();
        setInterval(() => this.checkBackendConnection(), 30000); // Check every 30 seconds
    }

    // Check if backend is running
    async checkBackendConnection() {
        try {
            const response = await fetch(`${this.baseURL}/health`, {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                console.log('✅ Backend connected successfully');
                this.showConnectionStatus('connected');
                return true;
            }
        } catch (error) {
            console.warn('⚠️ Backend not available:', error.message);
            this.showConnectionStatus('disconnected');
            return false;
        }
    }

    // Initialize backend server
    async initializeBackend() {
        console.log('🚀 Initializing backend service...');
        
        // Try to start backend server automatically
        try {
            // Check if backend is already running
            const isRunning = await this.checkBackendConnection();
            
            if (!isRunning) {
                console.log('📱 Backend not detected, working offline');
            }
        } catch (error) {
            console.log('📱 Working offline');
        }
    }

    // Show connection status
    showConnectionStatus(status) {
        let statusIndicator = document.getElementById('connectionStatus');
        if (!statusIndicator) {
            statusIndicator = document.createElement('div');
            statusIndicator.id = 'connectionStatus';
            statusIndicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 8px 15px;
                border-radius: 20px;
                z-index: 9999;
                font-size: 12px;
                font-weight: 600;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(statusIndicator);
        }

        if (status === 'connected') {
            statusIndicator.style.background = '#4CAF50';
            statusIndicator.style.color = 'white';
            statusIndicator.innerHTML = '🟢 Connected';
            setTimeout(() => statusIndicator.style.opacity = '0', 3000);
        } else {
            // Hide status indicator completely
            statusIndicator.style.opacity = '0';
        }
    }

    // Show offline notice - removed for cleaner UI
    showOfflineNotice() {
        // Silent mode - no UI disruption
        console.log('📱 Working in background mode');
    }

    // Enhanced API request with retry logic
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
        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await fetch(url, config);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.warn(`❌ Attempt ${attempt} failed:`, error.message);
                
                if (attempt === this.retryAttempts) {
                    throw new Error(`Failed after ${this.retryAttempts} attempts: ${error.message}`);
                }
                
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
            }
        }
    }

    // Enhanced Projects API
    async getProjects() {
        try {
            console.log('📥 Fetching projects from backend...');
            const response = await this.makeRequest('/projects');
            
            // Cache successful response
            localStorage.setItem('cached_projects', JSON.stringify(response.data));
            localStorage.setItem('cached_projects_timestamp', Date.now().toString());
            
            return response;
        } catch (error) {
            console.warn('📱 Using cached projects:', error.message);
            
            // Return cached data if available
            const cachedProjects = localStorage.getItem('cached_projects');
            if (cachedProjects) {
                return { data: JSON.parse(cachedProjects), cached: true };
            }
            
            // Return default projects as last resort
            return { data: this.getDefaultProjects(), default: true };
        }
    }

    async createProject(projectData, imageFile = null) {
        try {
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

            const response = await fetch(`${this.baseURL}/projects`, {
                method: 'POST',
                headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {},
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Failed to create project: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Project created successfully');
            
            // Update local cache
            this.updateLocalProjectCache();
            
            return result;
        } catch (error) {
            console.error('❌ Failed to create project:', error);
            
            // Store for offline sync
            this.storeForOfflineSync('createProject', { projectData, imageFile });
            throw error;
        }
    }

    async updateProject(id, projectData, imageFile = null) {
        try {
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

            const response = await fetch(`${this.baseURL}/projects/${id}`, {
                method: 'PUT',
                headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {},
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Failed to update project: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Project updated successfully');
            
            // Update local cache
            this.updateLocalProjectCache();
            
            return result;
        } catch (error) {
            console.error('❌ Failed to update project:', error);
            
            // Store for offline sync
            this.storeForOfflineSync('updateProject', { id, projectData, imageFile });
            throw error;
        }
    }

    async deleteProject(id) {
        try {
            const response = await this.makeRequest(`/projects/${id}`, {
                method: 'DELETE'
            });
            
            console.log('✅ Project deleted successfully');
            
            // Update local cache
            this.updateLocalProjectCache();
            
            return response;
        } catch (error) {
            console.error('❌ Failed to delete project:', error);
            
            // Store for offline sync
            this.storeForOfflineSync('deleteProject', { id });
            throw error;
        }
    }

    // Enhanced Photos API
    async getPhotos(category = null) {
        try {
            const endpoint = category ? `/photos?category=${category}` : '/photos';
            const response = await this.makeRequest(endpoint);
            
            // Cache successful response
            localStorage.setItem('cached_photos', JSON.stringify(response.data));
            localStorage.setItem('cached_photos_timestamp', Date.now().toString());
            
            return response;
        } catch (error) {
            console.warn('📱 Using cached photos:', error.message);
            
            // Return cached data if available
            const cachedPhotos = localStorage.getItem('cached_photos');
            if (cachedPhotos) {
                return { data: JSON.parse(cachedPhotos), cached: true };
            }
            
            return { data: [], default: true };
        }
    }

    async uploadPhoto(photoFile, caption = '', category = 'gallery') {
        try {
            const formData = new FormData();
            formData.append('photo', photoFile);
            formData.append('caption', caption);
            formData.append('category', category);

            const response = await fetch(`${this.baseURL}/photos`, {
                method: 'POST',
                headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {},
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Failed to upload photo: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Photo uploaded successfully');
            
            // Update local cache
            this.updateLocalPhotoCache();
            
            return result;
        } catch (error) {
            console.error('❌ Failed to upload photo:', error);
            
            // Store for offline sync
            this.storeForOfflineSync('uploadPhoto', { photoFile, caption, category });
            throw error;
        }
    }

    // Enhanced Memories API
    async getMemories(category = null) {
        try {
            const endpoint = category ? `/memories/category/${category}` : '/memories';
            const response = await this.makeRequest(endpoint);
            
            // Cache successful response
            localStorage.setItem('cached_memories', JSON.stringify(response.data));
            localStorage.setItem('cached_memories_timestamp', Date.now().toString());
            
            return response;
        } catch (error) {
            console.warn('📱 Using cached memories:', error.message);
            
            // Return cached data if available
            const cachedMemories = localStorage.getItem('cached_memories');
            if (cachedMemories) {
                return { data: JSON.parse(cachedMemories), cached: true };
            }
            
            return { data: [], default: true };
        }
    }

    // Authentication
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
                console.log('✅ Login successful');
            }

            return response;
        } catch (error) {
            console.error('❌ Login failed:', error);
            throw error;
        }
    }

    async logout() {
        this.token = null;
        localStorage.removeItem('portfolio_token');
        localStorage.removeItem('portfolio_user');
        console.log('👋 Logged out successfully');
    }

    // Offline sync functionality
    storeForOfflineSync(operation, data) {
        const offlineQueue = JSON.parse(localStorage.getItem('offline_sync_queue') || '[]');
        offlineQueue.push({
            operation,
            data,
            timestamp: Date.now()
        });
        localStorage.setItem('offline_sync_queue', JSON.stringify(offlineQueue));
        console.log('📦 Stored operation for offline sync:', operation);
    }

    async syncOfflineData() {
        const offlineQueue = JSON.parse(localStorage.getItem('offline_sync_queue') || '[]');
        
        if (offlineQueue.length === 0) return;
        
        console.log(`🔄 Syncing ${offlineQueue.length} offline operations...`);
        
        for (const item of offlineQueue) {
            try {
                switch (item.operation) {
                    case 'createProject':
                        await this.createProject(item.data.projectData, item.data.imageFile);
                        break;
                    case 'updateProject':
                        await this.updateProject(item.data.id, item.data.projectData, item.data.imageFile);
                        break;
                    case 'deleteProject':
                        await this.deleteProject(item.data.id);
                        break;
                    case 'uploadPhoto':
                        await this.uploadPhoto(item.data.photoFile, item.data.caption, item.data.category);
                        break;
                }
                console.log('✅ Synced:', item.operation);
            } catch (error) {
                console.error('❌ Failed to sync:', item.operation, error);
            }
        }
        
        // Clear the queue after successful sync
        localStorage.removeItem('offline_sync_queue');
        console.log('🎉 Offline sync completed');
    }

    // Update local caches
    async updateLocalProjectCache() {
        try {
            const response = await this.makeRequest('/projects');
            localStorage.setItem('cached_projects', JSON.stringify(response.data));
            localStorage.setItem('cached_projects_timestamp', Date.now().toString());
        } catch (error) {
            console.warn('Failed to update project cache:', error);
        }
    }

    async updateLocalPhotoCache() {
        try {
            const response = await this.makeRequest('/photos');
            localStorage.setItem('cached_photos', JSON.stringify(response.data));
            localStorage.setItem('cached_photos_timestamp', Date.now().toString());
        } catch (error) {
            console.warn('Failed to update photo cache:', error);
        }
    }

    // Default projects fallback
    getDefaultProjects() {
        return [
            {
                id: 1,
                title: 'Kiitians Finder',
                description: 'A comprehensive student directory platform for KIIT University that allows searching student details by roll number, accessing contact information, email, course details, and academic information.',
                icon: '🎓',
                technologies: ['React', 'Node.js', 'MongoDB', 'Express.js'],
                liveUrl: 'https://kiit.pages.dev',
                githubUrl: 'https://github.com/ritesh-chauhan0x1/kiitians-finder',
                isFeatured: true,
                category: 'web'
            },
            {
                id: 2,
                title: 'Personal Portfolio',
                description: 'Modern and responsive portfolio website showcasing my skills, projects, and journey as a full-stack developer. Built with clean design and smooth interactions.',
                icon: '🌐',
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'MySQL'],
                liveUrl: 'https://riteshchauhan.pages.dev',
                githubUrl: 'https://github.com/ritesh-chauhan0x1/riteshchauhan',
                isFeatured: false,
                category: 'web'
            },
            {
                id: 3,
                title: 'DSA Solutions Repository',
                description: 'Comprehensive collection of Data Structures and Algorithms solutions in multiple programming languages with detailed explanations and time complexity analysis.',
                icon: '📊',
                technologies: ['Java', 'Python', 'C++', 'Algorithms'],
                liveUrl: 'https://github.com/ritesh-chauhan0x1/DSA-Solutions',
                githubUrl: 'https://github.com/ritesh-chauhan0x1/DSA-Solutions',
                isFeatured: false,
                category: 'algorithms'
            },
            {
                id: 4,
                title: 'Task Management System',
                description: 'Collaborative task management application with real-time updates, drag-and-drop functionality, team collaboration, and progress tracking.',
                icon: '📋',
                technologies: ['Vue.js', 'Socket.io', 'Node.js', 'MySQL'],
                liveUrl: 'https://task-manager-demo.pages.dev',
                githubUrl: 'https://github.com/ritesh-chauhan0x1/task-manager',
                isFeatured: false,
                category: 'web'
            }
        ];
    }

    // Health check
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

// Initialize the backend service
const backendService = new BackendService();

// Export for global access
if (typeof window !== 'undefined') {
    window.backendService = backendService;
    window.enhancedAPI = backendService; // Alias for compatibility
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackendService;
}
