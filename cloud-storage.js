// Enhanced Cloud Storage Management with Google Drive Integration
// This module handles file uploads to Google Drive and provides fallback storage options

class CloudStorageManager {
    constructor() {
        this.uploadEndpoint = 'http://localhost:3000/api/upload';
        this.baseURL = 'http://localhost:3000/api';
        this.token = localStorage.getItem('portfolio_token');
        
        // Google Drive configuration
        this.driveConfig = {
            folderId: '1BmMRHyBgvfKGOYOH8mZGUJOb8Lk9Y8Kg', // Portfolio folder ID
            apiKey: 'YOUR_GOOGLE_DRIVE_API_KEY', // Replace with your API key
            baseUrl: 'https://www.googleapis.com/drive/v3'
        };
        
        this.initializeUploadHandlers();
    }

    // Initialize upload event handlers
    initializeUploadHandlers() {
        // Photo upload handlers
        const photoUpload = document.getElementById('photoUpload');
        if (photoUpload) {
            photoUpload.addEventListener('change', (e) => this.handlePhotoUpload(e));
        }

        // Memory video upload handlers
        ['childhoodVideo', 'hostelVideo', 'schoolVideo'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('change', (e) => this.handleVideoUpload(e, id));
            }
        });

        // Profile photo upload
        const editPhoto = document.getElementById('editPhoto');
        if (editPhoto) {
            editPhoto.addEventListener('change', (e) => this.handleProfilePhotoUpload(e));
        }
    }

    // Upload to Google Drive with fallback
    async uploadToCloud(file, type = 'image', category = 'general') {
        const progressCallback = this.createProgressCallback(file.name);
        
        try {
            // Try Google Drive first
            const driveResult = await this.uploadToGoogleDrive(file, type, category, progressCallback);
            if (driveResult.success) {
                console.log('✅ Uploaded to Google Drive:', driveResult.url);
                return driveResult;
            }
        } catch (error) {
            console.warn('⚠️ Google Drive upload failed, using fallback:', error.message);
        }

        // Fallback to local server
        try {
            const localResult = await this.uploadToLocalServer(file, type, category, progressCallback);
            console.log('✅ Uploaded to local server:', localResult.url);
            return localResult;
        } catch (error) {
            console.error('❌ All upload methods failed:', error);
            throw new Error('Failed to upload file to any storage provider');
        }
    }

    // Upload to Google Drive
    async uploadToGoogleDrive(file, type, category, progressCallback) {
        return new Promise((resolve, reject) => {
            const metadata = {
                name: `${Date.now()}-${file.name}`,
                parents: [this.driveConfig.folderId]
            };

            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
            form.append('file', file);

            const xhr = new XMLHttpRequest();
            
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && progressCallback) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    progressCallback(percentComplete);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    resolve({
                        success: true,
                        url: `https://drive.google.com/file/d/${response.id}/view`,
                        directUrl: `https://drive.google.com/uc?id=${response.id}`,
                        id: response.id,
                        name: response.name,
                        type: 'google_drive'
                    });
                } else {
                    reject(new Error(`Google Drive upload failed with status: ${xhr.status}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Google Drive upload network error'));
            });

            xhr.open('POST', `${this.driveConfig.baseUrl}/files?uploadType=multipart&key=${this.driveConfig.apiKey}`);
            xhr.send(form);
        });
    }

    // Upload to local server as fallback
    async uploadToLocalServer(file, type, category, progressCallback) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);
            formData.append('category', category);

            const xhr = new XMLHttpRequest();
            
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && progressCallback) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    progressCallback(percentComplete);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200 || xhr.status === 201) {
                    const response = JSON.parse(xhr.responseText);
                    resolve({
                        success: true,
                        url: response.url || response.data.url,
                        id: response.id || response.data.id,
                        name: response.name || response.data.name,
                        type: 'local_server'
                    });
                } else {
                    reject(new Error(`Local server upload failed with status: ${xhr.status}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Local server upload network error'));
            });

            xhr.open('POST', this.uploadEndpoint);
            if (this.token) {
                xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            }
            xhr.send(formData);
        });
    }

    // Create progress callback with UI updates
    createProgressCallback(fileName) {
        return (percent) => {
            // Update upload progress in UI
            this.updateUploadProgress(fileName, percent);
        };
    }

    // Update upload progress in UI
    updateUploadProgress(fileName, percent) {
        let progressContainer = document.getElementById('uploadProgress');
        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.id = 'uploadProgress';
            progressContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 15px;
                border-radius: 10px;
                z-index: 10000;
                min-width: 300px;
            `;
            document.body.appendChild(progressContainer);
        }

        progressContainer.innerHTML = `
            <div style="margin-bottom: 10px;">
                <strong>Uploading: ${fileName}</strong>
            </div>
            <div style="background: rgba(255,255,255,0.2); border-radius: 10px; height: 20px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #4CAF50, #45a049); height: 100%; width: ${percent}%; transition: width 0.3s ease;"></div>
            </div>
            <div style="text-align: center; margin-top: 5px; font-size: 14px;">
                ${Math.round(percent)}%
            </div>
        `;

        if (percent >= 100) {
            setTimeout(() => {
                if (progressContainer && progressContainer.parentNode) {
                    progressContainer.parentNode.removeChild(progressContainer);
                }
            }, 2000);
        }
    }

    // Handle photo upload
    async handlePhotoUpload(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        try {
            for (const file of files) {
                const result = await this.uploadToCloud(file, 'image', 'gallery');
                await this.savePhotoToDatabase(result, file);
            }
            
            // Refresh photo gallery
            if (typeof loadPhotosToPublic === 'function') {
                loadPhotosToPublic();
            }
            
            this.showSuccessMessage(`Successfully uploaded ${files.length} photo(s)`);
        } catch (error) {
            this.showErrorMessage('Failed to upload photos: ' + error.message);
        }
    }

    // Handle video upload for memories
    async handleVideoUpload(event, category) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        const categoryMap = {
            'childhoodVideo': 'childhood',
            'hostelVideo': 'hostel',
            'schoolVideo': 'school'
        };

        try {
            for (const file of files) {
                const result = await this.uploadToCloud(file, 'video', categoryMap[category]);
                await this.saveMemoryToDatabase(result, file, categoryMap[category]);
            }
            
            // Refresh memories
            if (typeof loadMemoriesToPublic === 'function') {
                loadMemoriesToPublic();
            }
            
            this.showSuccessMessage(`Successfully uploaded ${files.length} memory video(s)`);
        } catch (error) {
            this.showErrorMessage('Failed to upload videos: ' + error.message);
        }
    }

    // Handle profile photo upload
    async handleProfilePhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const result = await this.uploadToCloud(file, 'image', 'profile');
            await this.updateProfilePhoto(result);
            
            // Update profile photo in UI
            const profileAvatar = document.querySelector('.profile-avatar');
            if (profileAvatar) {
                profileAvatar.style.backgroundImage = `url(${result.directUrl || result.url})`;
            }
            
            this.showSuccessMessage('Profile photo updated successfully');
        } catch (error) {
            this.showErrorMessage('Failed to upload profile photo: ' + error.message);
        }
    }

    // Save photo to database
    async savePhotoToDatabase(uploadResult, file) {
        const photoData = {
            filename: uploadResult.name,
            originalName: file.name,
            url: uploadResult.directUrl || uploadResult.url,
            category: 'gallery',
            size: file.size,
            type: uploadResult.type,
            cloudId: uploadResult.id
        };

        const response = await fetch(`${this.baseURL}/photos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(photoData)
        });

        if (!response.ok) {
            throw new Error('Failed to save photo to database');
        }

        return await response.json();
    }

    // Save memory to database
    async saveMemoryToDatabase(uploadResult, file, category) {
        const memoryData = {
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            category: category,
            videoUrl: uploadResult.directUrl || uploadResult.url,
            type: uploadResult.type,
            cloudId: uploadResult.id,
            size: file.size
        };

        const response = await fetch(`${this.baseURL}/memories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(memoryData)
        });

        if (!response.ok) {
            throw new Error('Failed to save memory to database');
        }

        return await response.json();
    }

    // Update profile photo
    async updateProfilePhoto(uploadResult) {
        const profileData = {
            profilePhoto: uploadResult.directUrl || uploadResult.url,
            cloudId: uploadResult.id,
            type: uploadResult.type
        };

        const response = await fetch(`${this.baseURL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(profileData)
        });

        if (!response.ok) {
            throw new Error('Failed to update profile photo');
        }

        return await response.json();
    }

    // Show success message
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    // Show error message
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    // Generic message display
    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideInFromTop 0.3s ease;
        `;
        
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOutToTop 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
}

// CSS animations for messages
const messageStyles = `
    @keyframes slideInFromTop {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-100%);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideOutToTop {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-100%);
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = messageStyles;
document.head.appendChild(styleSheet);

// Initialize cloud storage manager
const cloudStorage = new CloudStorageManager();

// Export for global access
if (typeof window !== 'undefined') {
    window.cloudStorage = cloudStorage;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CloudStorageManager;
}
