const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class GoogleDriveStorage {
    constructor() {
        this.drive = null;
        this.folderId = process.env.GDRIVE_FOLDER_ID;
        this.initialize();
    }

    async initialize() {
        try {
            // Google Drive API setup
            const credentials = {
                type: 'service_account',
                project_id: process.env.GOOGLE_PROJECT_ID,
                private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                client_id: process.env.GOOGLE_CLIENT_ID,
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://oauth2.googleapis.com/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs"
            };

            const auth = new google.auth.GoogleAuth({
                credentials: credentials,
                scopes: ['https://www.googleapis.com/auth/drive.file']
            });

            this.drive = google.drive({ version: 'v3', auth });
            console.log('✅ Google Drive storage initialized');
        } catch (error) {
            console.error('❌ Google Drive initialization failed:', error.message);
            console.log('📁 Falling back to local storage');
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
