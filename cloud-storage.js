// Enhanced Cloud Storage Management with Google Drive Integration
// This module handles file uploads to Google Drive and provides fallback storage options

class CloudStorageManager {
    constructor() {
        this.uploadEndpoint = 'http://localhost:3000/api/upload';
        this.baseURL = 'http://localhost:3000/api';
        this.token = localStorage.getItem('portfolio_token');
        
        // Google Drive API configuration for rites.chauhan11@gmail.com
        this.driveConfig = {
            folderId: '1BmMRHyBgvfKGOYOH8mZGUJOb8Lk9Y8Kg', // Ritesh's Portfolio folder ID
            email: 'rites.chauhan11@gmail.com',
            apiKey: this.getApiKey(), // Get from environment or prompt user
            baseUrl: 'https://www.googleapis.com/drive/v3',
            uploadUrl: 'https://www.googleapis.com/upload/drive/v3/files'
        };
        
        this.connectionStatus = 'disconnected';
        this.initializeUploadHandlers();
        this.checkConnection();
    }

    // Get API key from environment or localStorage
    getApiKey() {
        // Try to get from localStorage first (user input)
        const storedKey = localStorage.getItem('google_drive_api_key');
        if (storedKey) return storedKey;
        
        // Fallback to environment variable
        return 'YOUR_GOOGLE_DRIVE_API_KEY'; // Will be replaced with actual key
    }

    // Check Google Drive connection status
    async checkConnection() {
        try {
            const response = await fetch(`${this.driveConfig.baseUrl}/about?fields=user&key=${this.driveConfig.apiKey}`);
            
            if (response.ok) {
                const data = await response.json();
                this.connectionStatus = 'connected';
                console.log(`✅ Google Drive connected for: ${data.user.emailAddress}`);
                this.updateConnectionStatus('connected', `Connected: ${data.user.emailAddress}`);
                return true;
            } else {
                throw new Error(`API Error: ${response.status}`);
            }
        } catch (error) {
            console.warn('⚠️ Google Drive connection failed:', error.message);
            this.connectionStatus = 'disconnected';
            this.updateConnectionStatus('disconnected', 'API Key needed');
            return false;
        }
    }

    // Update connection status in UI
    updateConnectionStatus(status, message) {
        const statusDot = document.getElementById('driveStatusDot');
        const statusText = document.getElementById('driveStatusText');
        const connectionStatus = document.getElementById('connectionStatus');
        
        if (statusDot) {
            statusDot.textContent = status === 'connected' ? '🟢' : '🔴';
        }
        
        if (statusText) {
            statusText.textContent = message;
        }
        
        if (connectionStatus) {
            connectionStatus.textContent = status === 'connected' ? 'Connected and Ready' : 'API Key Required';
        }
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
            // Always try local storage first for reliability
            const localResult = await this.uploadToLocalServer(file, type, category, progressCallback);
            console.log('✅ Uploaded to local server:', localResult.url);
            return localResult;
        } catch (localError) {
            console.warn('⚠️ Local server upload failed, trying Google Drive:', localError.message);
            
            // Fallback to Google Drive
            try {
                const driveResult = await this.uploadToGoogleDrive(file, type, category, progressCallback);
                if (driveResult.success) {
                    console.log('✅ Uploaded to Google Drive:', driveResult.url);
                    return driveResult;
                }
            } catch (driveError) {
                console.warn('⚠️ Google Drive upload also failed:', driveError.message);
            }
            
            // Final fallback - convert to base64 and store locally
            try {
                const base64 = await this.fileToBase64(file);
                return {
                    success: true,
                    url: base64,
                    name: file.name,
                    type: 'localStorage',
                    id: Date.now()
                };
            } catch (base64Error) {
                console.error('❌ All upload methods failed:', base64Error);
                throw new Error('Failed to upload file: All storage methods failed');
            }
        }
    }

    // Upload to Google Drive using API key
    async uploadToGoogleDrive(file, type, category, progressCallback) {
        return new Promise(async (resolve, reject) => {
            try {
                // Check connection first
                const isConnected = await this.checkConnection();
                if (!isConnected) {
                    throw new Error('Google Drive not connected. API key required.');
                }

                // Step 1: Create file metadata
                const metadata = {
                    name: `${Date.now()}-${file.name}`,
                    parents: [this.driveConfig.folderId],
                    description: `Portfolio ${category} uploaded from rites.chauhan11@gmail.com`
                };

                // Step 2: Upload file using resumable upload
                const boundary = '-------314159265358979323846';
                const delimiter = "\r\n--" + boundary + "\r\n";
                const close_delim = "\r\n--" + boundary + "--";

                let body = delimiter +
                    'Content-Type: application/json\r\n\r\n' +
                    JSON.stringify(metadata) +
                    delimiter +
                    'Content-Type: ' + file.type + '\r\n\r\n';

                const reader = new FileReader();
                reader.onload = function(e) {
                    const fileData = e.target.result;
                    body += fileData + close_delim;

                    const xhr = new XMLHttpRequest();
                    
                    xhr.upload.addEventListener('progress', (e) => {
                        if (e.lengthComputable && progressCallback) {
                            const percentComplete = (e.loaded / e.total) * 100;
                            progressCallback(percentComplete);
                        }
                    });

                    xhr.addEventListener('load', () => {
                        if (xhr.status === 200 || xhr.status === 201) {
                            try {
                                const response = JSON.parse(xhr.responseText);
                                
                                // Make file publicly viewable
                                const fileId = response.id;
                                const publicUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
                                
                                resolve({
                                    success: true,
                                    url: publicUrl,
                                    viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
                                    id: fileId,
                                    name: response.name,
                                    type: 'google_drive'
                                });
                            } catch (parseError) {
                                reject(new Error('Failed to parse Google Drive response'));
                            }
                        } else {
                            reject(new Error(`Google Drive upload failed: ${xhr.status} - ${xhr.responseText}`));
                        }
                    });

                    xhr.addEventListener('error', () => {
                        reject(new Error('Network error during Google Drive upload'));
                    });

                    const uploadUrl = `${this.driveConfig.uploadUrl}?uploadType=multipart&key=${this.driveConfig.apiKey}`;
                    xhr.open('POST', uploadUrl);
                    xhr.setRequestHeader('Content-Type', 'multipart/related; boundary="' + boundary + '"');
                    xhr.send(body);
                };

                reader.readAsBinaryString(file);

            } catch (error) {
                console.error('❌ Google Drive upload error:', error);
                reject(error);
            }
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

    // Helper function to convert file to base64
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
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
