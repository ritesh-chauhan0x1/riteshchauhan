const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class GoogleDriveStorage {
    constructor() {
        this.drive = null;
        this.auth = null;
        this.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        this.email = process.env.GOOGLE_DRIVE_EMAIL || 'rites.chauhan11@gmail.com';
        this.initialize();
    }

    async initialize() {
        try {
            console.log(`🔧 Initializing Google Drive for: ${this.email}`);
            
            // OAuth2 credentials setup
            const oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                'http://localhost:3000/auth/google/callback' // Redirect URI
            );

            // If we have stored tokens, use them
            if (process.env.GOOGLE_REFRESH_TOKEN) {
                oauth2Client.setCredentials({
                    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
                    access_token: process.env.GOOGLE_ACCESS_TOKEN
                });
                
                this.auth = oauth2Client;
                this.drive = google.drive({ version: 'v3', auth: oauth2Client });
                
                console.log('✅ Google Drive initialized with stored tokens');
                
                // Test the connection
                await this.testConnection();
            } else {
                console.log('⚠️ Google Drive tokens not found. Run setup to authenticate.');
                this.generateAuthUrl();
            }
        } catch (error) {
            console.error('❌ Google Drive initialization failed:', error.message);
            console.log('📁 Google Drive will be unavailable, falling back to local storage');
        }
    }

    generateAuthUrl() {
        try {
            const oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                'http://localhost:3000/auth/google/callback'
            );

            const scopes = [
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/drive.metadata.readonly'
            ];

            const authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes,
                prompt: 'consent'
            });

            console.log('\n🔐 Google Drive Authentication Required:');
            console.log('📋 Copy this URL and open it in your browser:');
            console.log('🌐', authUrl);
            console.log('\n📝 After authorization, you\'ll get tokens to add to your .env file\n');
            
            return authUrl;
        } catch (error) {
            console.error('❌ Failed to generate auth URL:', error.message);
            return null;
        }
    }

    async testConnection() {
        try {
            if (!this.drive) {
                throw new Error('Google Drive not initialized');
            }

            const response = await this.drive.about.get({
                fields: 'user'
            });

            console.log(`✅ Google Drive connected for: ${response.data.user.emailAddress}`);
            return true;
        } catch (error) {
            console.error('❌ Google Drive connection test failed:', error.message);
            return false;
        }
    }

    async uploadFile(filePath, fileName, mimeType, folder = 'portfolio') {
        try {
            if (!this.drive) {
                return this.saveLocally(filePath, fileName, folder);
            }

            // Create folder if not exists
            const folderId = await this.ensureFolder(folder);

            const fileMetadata = {
                name: fileName,
                parents: [folderId]
            };

            const media = {
                mimeType: mimeType,
                body: fs.createReadStream(filePath)
            };

            const response = await this.drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id,name,webViewLink,webContentLink'
            });

            // Make file publicly accessible
            await this.drive.permissions.create({
                fileId: response.data.id,
                resource: {
                    role: 'reader',
                    type: 'anyone'
                }
            });

            const publicUrl = `https://drive.google.com/uc?export=view&id=${response.data.id}`;
            
            console.log(`✅ File uploaded to Google Drive: ${fileName}`);
            return {
                success: true,
                fileId: response.data.id,
                fileName: response.data.name,
                url: publicUrl,
                viewLink: response.data.webViewLink,
                downloadLink: response.data.webContentLink,
                storage: 'google-drive'
            };
        } catch (error) {
            console.error('❌ Google Drive upload failed:', error.message);
            return this.saveLocally(filePath, fileName, folder);
        }
    }

    async ensureFolder(folderName) {
        try {
            if (this.folderId) return this.folderId;

            // Search for existing folder
            const response = await this.drive.files.list({
                q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
                fields: 'files(id, name)'
            });

            if (response.data.files.length > 0) {
                return response.data.files[0].id;
            }

            // Create new folder
            const folderResponse = await this.drive.files.create({
                resource: {
                    name: folderName,
                    mimeType: 'application/vnd.google-apps.folder'
                },
                fields: 'id'
            });

            return folderResponse.data.id;
        } catch (error) {
            console.error('❌ Folder creation failed:', error.message);
            return null;
        }
    }

    saveLocally(filePath, fileName, folder) {
        try {
            const uploadDir = path.join(__dirname, 'uploads', folder);
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

    async deleteFile(fileId, storage = 'google-drive') {
        try {
            if (storage === 'google-drive' && this.drive && fileId) {
                await this.drive.files.delete({ fileId: fileId });
                console.log(`✅ File deleted from Google Drive: ${fileId}`);
                return { success: true };
            } else if (storage === 'local') {
                // For local files, fileId is the file path
                if (fs.existsSync(fileId)) {
                    fs.unlinkSync(fileId);
                    console.log(`📁 File deleted locally: ${fileId}`);
                }
                return { success: true };
            }
        } catch (error) {
            console.error('❌ File deletion failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    async listFiles(folder = 'portfolio') {
        try {
            if (!this.drive) {
                return this.listLocalFiles(folder);
            }

            const folderId = await this.ensureFolder(folder);
            const response = await this.drive.files.list({
                q: `'${folderId}' in parents`,
                fields: 'files(id, name, size, createdTime, mimeType, webViewLink)'
            });

            return {
                success: true,
                files: response.data.files,
                storage: 'google-drive'
            };
        } catch (error) {
            console.error('❌ File listing failed:', error.message);
            return this.listLocalFiles(folder);
        }
    }

    listLocalFiles(folder) {
        try {
            const uploadDir = path.join(__dirname, 'uploads', folder);
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
                    url: `/uploads/${folder}/${file}`
                };
            });

            return { success: true, files, storage: 'local' };
        } catch (error) {
            console.error('❌ Local file listing failed:', error.message);
            return { success: false, files: [], error: error.message };
        }
    }
}

module.exports = GoogleDriveStorage;
