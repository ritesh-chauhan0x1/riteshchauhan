const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

class AWSStorage {
    constructor() {
        this.s3 = null;
        this.bucketName = process.env.AWS_BUCKET_NAME;
        this.initialize();
    }

    initialize() {
        try {
            // Configure AWS
            AWS.config.update({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION || 'us-east-1'
            });

            this.s3 = new AWS.S3();
            console.log('✅ AWS S3 storage initialized');
        } catch (error) {
            console.error('❌ AWS S3 initialization failed:', error.message);
            console.log('📁 Falling back to local storage');
        }
    }

    async uploadFile(filePath, fileName, mimeType, folder = 'portfolio') {
        try {
            if (!this.s3 || !this.bucketName) {
                return this.saveLocally(filePath, fileName, folder);
            }

            const fileContent = fs.readFileSync(filePath);
            const key = `${folder}/${fileName}`;

            const params = {
                Bucket: this.bucketName,
                Key: key,
                Body: fileContent,
                ContentType: mimeType,
                ACL: 'public-read' // Make file publicly accessible
            };

            const result = await this.s3.upload(params).promise();
            
            console.log(`✅ File uploaded to S3: ${fileName}`);
            return {
                success: true,
                fileName: fileName,
                url: result.Location,
                key: result.Key,
                storage: 'aws-s3'
            };
        } catch (error) {
            console.error('❌ S3 upload failed:', error.message);
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

    async deleteFile(key, storage = 'aws-s3') {
        try {
            if (storage === 'aws-s3' && this.s3 && this.bucketName) {
                await this.s3.deleteObject({
                    Bucket: this.bucketName,
                    Key: key
                }).promise();
                
                console.log(`✅ File deleted from S3: ${key}`);
                return { success: true };
            } else if (storage === 'local') {
                if (fs.existsSync(key)) {
                    fs.unlinkSync(key);
                    console.log(`📁 File deleted locally: ${key}`);
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
            if (!this.s3 || !this.bucketName) {
                return this.listLocalFiles(folder);
            }

            const params = {
                Bucket: this.bucketName,
                Prefix: `${folder}/`
            };

            const result = await this.s3.listObjectsV2(params).promise();
            
            return {
                success: true,
                files: result.Contents || [],
                storage: 'aws-s3'
            };
        } catch (error) {
            console.error('❌ S3 file listing failed:', error.message);
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
                    Key: `${folder}/${file}`,
                    Size: stats.size,
                    LastModified: stats.mtime,
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

module.exports = AWSStorage;
