// Enhanced File Upload Manager
class FileUploadManager {
    constructor() {
        this.uploadPath = './uploads/';
        this.maxFileSize = {
            profile: 5 * 1024 * 1024, // 5MB for profile images
            photos: 10 * 1024 * 1024, // 10MB for gallery photos
            projects: 10 * 1024 * 1024, // 10MB for project images
            memories: 50 * 1024 * 1024 // 50MB for memory videos
        };
        this.allowedTypes = {
            profile: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
            photos: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
            projects: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
            memories: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'video/mov']
        };
        this.profileImagePath = './uploads/profile/images/';
    }

    // Validate file before upload
    validateFile(file, category) {
        const errors = [];

        // Check file size
        if (file.size > this.maxFileSize[category]) {
            const maxSizeMB = this.maxFileSize[category] / (1024 * 1024);
            errors.push(`File size must be less than ${maxSizeMB}MB`);
        }

        // Check file type
        if (!this.allowedTypes[category].includes(file.type)) {
            errors.push(`File type ${file.type} is not allowed for ${category}`);
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Generate unique filename
    generateFileName(originalName, category) {
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2);
        const extension = originalName.substring(originalName.lastIndexOf('.'));
        return `${category}-${timestamp}-${randomId}${extension}`;
    }

    // Save file to uploads folder (for future server-side implementation)
    async saveToUploads(file, category) {
        try {
            // For now, we'll create a URL that represents where the file would be saved
            const fileName = this.generateFileName(file.name, category);
            let relativePath;
            
            // Special handling for profile images
            if (category === 'profile') {
                relativePath = `uploads/profile/images/${fileName}`;
            } else {
                relativePath = `uploads/${category}/${fileName}`;
            }
            
            // Convert to base64 for current system compatibility
            const base64 = await this.fileToBase64(file);
            
            // Store file info for future server implementation
            const fileInfo = {
                originalName: file.name,
                fileName: fileName,
                path: relativePath,
                size: file.size,
                type: file.type,
                category: category,
                uploadDate: new Date().toISOString(),
                base64: base64 // Keep base64 for current system
            };

            // Save file info to localStorage for now
            this.saveFileInfo(fileInfo, category);

            return {
                success: true,
                filePath: relativePath,
                fileName: fileName,
                base64: base64,
                fileInfo: fileInfo
            };

        } catch (error) {
            console.error('Error saving file:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Save file information to localStorage
    saveFileInfo(fileInfo, category) {
        const storageKey = `uploaded_${category}_files`;
        const existingFiles = JSON.parse(localStorage.getItem(storageKey) || '[]');
        existingFiles.push(fileInfo);
        localStorage.setItem(storageKey, JSON.stringify(existingFiles));
    }

    // Get uploaded files by category
    getUploadedFiles(category) {
        const storageKey = `uploaded_${category}_files`;
        return JSON.parse(localStorage.getItem(storageKey) || '[]');
    }

    // Convert file to base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    // Delete uploaded file
    deleteUploadedFile(fileName, category) {
        const storageKey = `uploaded_${category}_files`;
        const existingFiles = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updatedFiles = existingFiles.filter(file => file.fileName !== fileName);
        localStorage.setItem(storageKey, JSON.stringify(updatedFiles));
        
        return {
            success: true,
            message: `File ${fileName} deleted successfully`
        };
    }

    // Get file URL (for display purposes)
    getFileUrl(fileInfo) {
        // For now, return base64. In future server implementation, return actual file URL
        return fileInfo.base64 || fileInfo.path;
    }

    // Clear all uploaded files (utility function)
    clearAllUploads(category) {
        const storageKey = `uploaded_${category}_files`;
        localStorage.removeItem(storageKey);
        return {
            success: true,
            message: `All ${category} uploads cleared`
        };
    }
}

// Initialize the file upload manager
const fileUploadManager = new FileUploadManager();

// Enhanced profile photo upload function
async function uploadProfilePhoto() {
    const photoInput = document.getElementById('editPhoto');
    
    if (!photoInput.files || !photoInput.files[0]) {
        showMessage('Please select a profile photo first!', 'error');
        return null;
    }

    const file = photoInput.files[0];
    
    // Validate file
    const validation = fileUploadManager.validateFile(file, 'profile');
    if (!validation.isValid) {
        showMessage(`Upload failed: ${validation.errors.join(', ')}`, 'error');
        return null;
    }

    try {
        showMessage('Uploading profile photo...', 'info');
        
        // Save file using the upload manager
        const result = await fileUploadManager.saveToUploads(file, 'profile');
        
        if (result.success) {
            // Update the hero profile image immediately
            const heroProfileImg = document.getElementById('heroProfileImg');
            if (heroProfileImg) {
                heroProfileImg.src = result.base64;
                heroProfileImg.alt = 'Ritesh Chauhan - Profile Photo';
                console.log('✅ Hero profile image updated successfully');
            }
            
            // Update profile data in localStorage
            const STORAGE_KEYS = { profile: 'portfolio_profile' }; // Define locally if not available
            const profileData = JSON.parse(localStorage.getItem(STORAGE_KEYS.profile) || '{}');
            profileData.photo = result.base64;
            profileData.photoFileName = result.fileName;
            profileData.photoPath = result.filePath;
            localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profileData));
            
            // Update other profile images in the page
            const profileAvatars = document.querySelectorAll('.profile-avatar');
            profileAvatars.forEach(avatar => {
                avatar.style.backgroundImage = `url(${result.base64})`;
                avatar.style.backgroundSize = 'cover';
                avatar.style.backgroundPosition = 'center';
            });
            
            // Update uploaded files manager display
            const uploadedFilesContainer = document.getElementById('uploadedProfileFiles');
            if (uploadedFilesContainer) {
                uploadedFilesContainer.innerHTML = showUploadedFilesManager('profile');
            }
            
            showMessage('✅ Profile photo uploaded successfully! The hero image has been updated.', 'success');
            return result;
        } else {
            showMessage(`Upload failed: ${result.error}`, 'error');
            return null;
        }
        
    } catch (error) {
        console.error('Profile photo upload error:', error);
        showMessage(`Upload failed: ${error.message}`, 'error');
        return null;
    }
}

// Function to display uploaded files management UI
function showUploadedFilesManager(category) {
    const files = fileUploadManager.getUploadedFiles(category);
    
    if (files.length === 0) {
        return `<p>No ${category} files uploaded yet.</p>`;
    }
    
    let html = `<div class="uploaded-files-manager">
        <h4>Uploaded ${category.charAt(0).toUpperCase() + category.slice(1)} Files</h4>`;
    
    files.forEach(file => {
        const isImage = file.type.startsWith('image/');
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        
        html += `
        <div class="uploaded-file-item" data-filename="${file.fileName}">
            ${isImage ? `<img src="${file.base64}" alt="${file.originalName}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 5px;">` : '<div class="file-icon">📁</div>'}
            <div class="file-info">
                <strong>${file.originalName}</strong><br>
                <small>Size: ${fileSize}MB | Uploaded: ${new Date(file.uploadDate).toLocaleDateString()}</small>
            </div>
            <button onclick="deleteUploadedFile('${file.fileName}', '${category}')" class="btn-delete">🗑️</button>
        </div>`;
    });
    
    html += '</div>';
    return html;
}

// Function to delete uploaded file
function deleteUploadedFile(fileName, category) {
    if (confirm('Are you sure you want to delete this file?')) {
        const result = fileUploadManager.deleteUploadedFile(fileName, category);
        if (result.success) {
            showMessage(result.message, 'success');
            // Refresh the display
            location.reload();
        }
    }
}

// Export functions for global use
window.fileUploadManager = fileUploadManager;
window.uploadProfilePhoto = uploadProfilePhoto;
window.showUploadedFilesManager = showUploadedFilesManager;
window.deleteUploadedFile = deleteUploadedFile;
