const express = require('express');
const mysql = require('mysql2/promise');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const UnifiedStorage = require('../storage/unified-storage');

const router = express.Router();
const fileStorage = new UnifiedStorage();

// Get database connection
const getDbConnection = () => {
    return mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'portfolio_db',
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const jwt = require('jsonwebtoken');
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Enhanced file upload configuration with cloud storage
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = path.join(__dirname, '../temp-uploads');
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
        }
    }),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// GET ALL PROJECTS
router.get('/', async (req, res) => {
    try {
        const pool = getDbConnection();
        const [rows] = await pool.execute(`
            SELECT * FROM projects 
            ORDER BY isFeatured DESC, sortOrder ASC, created_at DESC
        `);
        
        // Parse technologies JSON and ensure valid URLs
        const projects = rows.map(project => ({
            ...project,
            technologies: project.technologies ? JSON.parse(project.technologies) : [],
            imageUrl: project.imageUrl || '/api/placeholder-image'
        }));
        
        res.json({
            success: true,
            data: projects,
            count: projects.length
        });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// GET SINGLE PROJECT
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = getDbConnection();
        const [rows] = await pool.execute('SELECT * FROM projects WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        const project = {
            ...rows[0],
            technologies: rows[0].technologies ? JSON.parse(rows[0].technologies) : []
        };
        
        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// CREATE NEW PROJECT with Cloud Storage
router.post('/', authenticateToken, upload.single('image'), [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('technologies').optional().isJSON().withMessage('Technologies must be valid JSON array'),
    body('liveUrl').optional().isURL().withMessage('Live URL must be valid'),
    body('githubUrl').optional().isURL().withMessage('GitHub URL must be valid'),
    body('category').optional().isIn(['web', 'mobile', 'desktop', 'api', 'ai', 'blockchain', 'other']).withMessage('Invalid category')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const {
            title,
            description,
            technologies,
            liveUrl,
            githubUrl,
            category = 'web',
            isFeatured = false,
            status = 'completed'
        } = req.body;

        let imageUrl = null;
        let storageInfo = {};

        // Handle image upload to cloud storage
        if (req.file) {
            const uploadResult = await fileStorage.uploadFile(
                req.file.path,
                req.file.filename,
                req.file.mimetype,
                'projects'
            );

            if (uploadResult.success) {
                imageUrl = uploadResult.url;
                storageInfo = {
                    fileId: uploadResult.fileId,
                    storage: uploadResult.storage
                };
            }

            // Clean up temp file
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }

        const pool = getDbConnection();
        
        // Parse technologies if provided
        let techArray = [];
        if (technologies) {
            try {
                techArray = JSON.parse(technologies);
            } catch (e) {
                return res.status(400).json({ error: 'Invalid technologies format' });
            }
        }

        const [result] = await pool.execute(`
            INSERT INTO projects (title, description, technologies, liveUrl, githubUrl, imageUrl, category, isFeatured, status, storageInfo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [title, description, JSON.stringify(techArray), liveUrl || null, githubUrl || null, imageUrl, category, isFeatured, status, JSON.stringify(storageInfo)]);

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: {
                id: result.insertId,
                title,
                description,
                technologies: techArray,
                liveUrl,
                githubUrl,
                imageUrl,
                category,
                isFeatured,
                status,
                storageInfo
            }
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// UPDATE PROJECT
router.put('/:id', authenticateToken, upload.single('image'), [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('technologies').optional().isJSON().withMessage('Technologies must be valid JSON array'),
    body('liveUrl').optional().isURL().withMessage('Live URL must be valid'),
    body('githubUrl').optional().isURL().withMessage('GitHub URL must be valid'),
    body('category').optional().isIn(['web', 'mobile', 'desktop', 'api', 'ai', 'blockchain', 'other']).withMessage('Invalid category')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { id } = req.params;
        const updateData = { ...req.body };
        const pool = getDbConnection();
        
        // Get existing project for storage cleanup
        const [existingProject] = await pool.execute('SELECT * FROM projects WHERE id = ?', [id]);
        if (existingProject.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Handle new image upload
        if (req.file) {
            // Delete old image if exists
            const oldStorageInfo = existingProject[0].storageInfo ? JSON.parse(existingProject[0].storageInfo) : {};
            if (oldStorageInfo.fileId) {
                await fileStorage.deleteFile(oldStorageInfo.fileId, oldStorageInfo.storage, existingProject[0].imageUrl);
            }

            // Upload new image
            const uploadResult = await fileStorage.uploadFile(
                req.file.path,
                req.file.filename,
                req.file.mimetype,
                'projects'
            );

            if (uploadResult.success) {
                updateData.imageUrl = uploadResult.url;
                updateData.storageInfo = JSON.stringify({
                    fileId: uploadResult.fileId,
                    storage: uploadResult.storage
                });
            }

            // Clean up temp file
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }

        // Parse technologies if provided
        if (updateData.technologies) {
            try {
                const techArray = JSON.parse(updateData.technologies);
                updateData.technologies = JSON.stringify(techArray);
            } catch (e) {
                return res.status(400).json({ error: 'Invalid technologies format' });
            }
        }

        // Build dynamic update query
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        
        if (fields.length === 0) {
            return res.status(400).json({ error: 'No data to update' });
        }

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE projects SET ${setClause}, updated_at = NOW() WHERE id = ?`;

        await pool.execute(query, [...values, id]);

        res.json({
            success: true,
            message: 'Project updated successfully'
        });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// DELETE PROJECT
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const pool = getDbConnection();
        
        // Get project details to delete associated files
        const [project] = await pool.execute('SELECT * FROM projects WHERE id = ?', [id]);
        
        if (project.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Delete files from storage
        const storageInfo = project[0].storageInfo ? JSON.parse(project[0].storageInfo) : {};
        if (storageInfo.fileId) {
            await fileStorage.deleteFile(storageInfo.fileId, storageInfo.storage, project[0].imageUrl);
        }

        // Delete project from database
        await pool.execute('DELETE FROM projects WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// GET STORAGE INFO
router.get('/storage/info', authenticateToken, async (req, res) => {
    try {
        const storageInfo = fileStorage.getStorageInfo();
        res.json({
            success: true,
            data: storageInfo
        });
    } catch (error) {
        console.error('Get storage info error:', error);
        res.status(500).json({ error: 'Failed to get storage info' });
    }
});

// PLACEHOLDER IMAGE ENDPOINT
router.get('/placeholder-image', (req, res) => {
    const placeholderSvg = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f0f0f0"/>
            <text x="50%" y="50%" font-family="Arial" font-size="18" fill="#999" text-anchor="middle" dy=".3em">
                Project Image
            </text>
        </svg>
    `;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(placeholderSvg);
});

module.exports = router;
