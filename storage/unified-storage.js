const GoogleDriveStorage = require('./google-drive');
const AWSStorage = require('./aws-s3');
const path = require('path');
const fs = require('fs');

class UnifiedStorage {
    constructor() {
        this.primaryStorage = null;
        this.fallbackStorage = null;
        this.initialize();
    }

    initialize() {
        const storageType = process.env.STORAGE_TYPE || 'auto';
        
        console.log(`🔧 Initializing storage (type: ${storageType})`);
        
        switch (storageType.toLowerCase()) {
            case 'google-drive':
            case 'gdrive':
                this.primaryStorage = new GoogleDriveStorage();
                break;
            case 'aws':
            case 's3':
                this.primaryStorage = new AWSStorage();
                break;
            case 'local':
                this.primaryStorage = null;
                break;
            case 'auto':
            default:
                // Try Google Drive first, then AWS, then local
                if (process.env.GOOGLE_PRIVATE_KEY) {
                    this.primaryStorage = new GoogleDriveStorage();
                } else if (process.env.AWS_ACCESS_KEY_ID) {
                    this.primaryStorage = new AWSStorage();
                }
                break;
        }

        // Always have local as fallback
        this.fallbackStorage = 'local';
        
        console.log(`✅ Storage system initialized`);
        console.log(`   Primary: ${this.primaryStorage ? this.primaryStorage.constructor.name : 'Local Storage'}`);
        console.log(`   Fallback: Local Storage`);
    }

    async uploadFile(filePath, fileName, mimeType, folder = 'portfolio') {
        try {
            // Try primary storage first
            if (this.primaryStorage) {
                const result = await this.primaryStorage.uploadFile(filePath, fileName, mimeType, folder);
                if (result.success) {
                    return result;
                }
            }

            // Fallback to local storage
            return this.saveLocally(filePath, fileName, folder);
        } catch (error) {
            console.error('❌ Upload failed:', error.message);
            return this.saveLocally(filePath, fileName, folder);
        }
    }

    saveLocally(filePath, fileName, folder) {
        try {
            const uploadDir = path.join(__dirname, '..', 'uploads', folder);
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const localPath = path.join(uploadDir, fileName);
            fs.copyFileSync(filePath, localPath);

            const publicUrl = `/uploads/${folder}/${fileName}`;
            
            console.log(`📁 File saved locally: ${fileName}`);
            return {
                success: true,
                fileName: fileName,
                url: publicUrl,
                localPath: localPath,
                storage: 'local'
            };
        } catch (error) {
            console.error('❌ Local storage failed:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteFile(fileId, storage, filePath) {
        try {
            if (this.primaryStorage && storage !== 'local') {
                const result = await this.primaryStorage.deleteFile(fileId, storage);
                if (result.success) {
                    return result;
                }
            }

            // Delete local file if it exists
            if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`📁 File deleted locally: ${filePath}`);
            }

            return { success: true };
        } catch (error) {
            console.error('❌ File deletion failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    async listFiles(folder = 'portfolio') {
        try {
            if (this.primaryStorage) {
                const result = await this.primaryStorage.listFiles(folder);
                if (result.success) {
                    return result;
                }
            }

            // Fallback to local listing
            return this.listLocalFiles(folder);
        } catch (error) {
            console.error('❌ File listing failed:', error.message);
            return this.listLocalFiles(folder);
        }
    }

    listLocalFiles(folder) {
        try {
            const uploadDir = path.join(__dirname, '..', 'uploads', folder);
            if (!fs.existsSync(uploadDir)) {
                return { success: true, files: [], storage: 'local' };
            }

            const files = fs.readdirSync(uploadDir).map(file => {
                const filePath = path.join(uploadDir, file);
                const stats = fs.statSync(filePath);
                return {
                    name: file,
                    size: stats.size,
                    createdTime: stats.birthtime,
                    url: `/uploads/${folder}/${file}`,
                    localPath: filePath
                };
            });

            return { success: true, files, storage: 'local' };
        } catch (error) {
            console.error('❌ Local file listing failed:', error.message);
            return { success: false, files: [], error: error.message };
        }
    }

    getStorageInfo() {
        return {
            primary: this.primaryStorage ? this.primaryStorage.constructor.name : 'Local Storage',
            fallback: 'Local Storage',
            available: {
                googleDrive: !!process.env.GOOGLE_PRIVATE_KEY,
                aws: !!process.env.AWS_ACCESS_KEY_ID,
                local: true
            }
        };
    }
}

module.exports = UnifiedStorage;
