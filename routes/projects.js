const express = require('express');
const mysql = require('mysql2/promise');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Get database connection from main app
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

// Middleware for authentication (import from main server file)
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

// File upload configuration for projects
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = path.join(__dirname, '../uploads/projects');
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
        fileSize: 5 * 1024 * 1024 // 5MB limit
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
        
        // Parse technologies JSON
        const projects = rows.map(project => ({
            ...project,
            technologies: project.technologies ? JSON.parse(project.technologies) : []
        }));
        
        res.json({
            success: true,
            data: projects
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

// CREATE NEW PROJECT
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
        if (req.file) {
            imageUrl = `/uploads/projects/${req.file.filename}`;
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
            INSERT INTO projects (title, description, technologies, liveUrl, githubUrl, imageUrl, category, isFeatured, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [title, description, JSON.stringify(techArray), liveUrl || null, githubUrl || null, imageUrl, category, isFeatured, status]);

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
                status
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
        
        if (req.file) {
            updateData.imageUrl = `/uploads/projects/${req.file.filename}`;
        }

        // Parse technologies if provided
        if (updateData.technologies) {
            try {
                updateData.technologies = JSON.stringify(JSON.parse(updateData.technologies));
            } catch (e) {
                return res.status(400).json({ error: 'Invalid technologies format' });
            }
        }

        const pool = getDbConnection();
        
        // Check if project exists
        const [existingProject] = await pool.execute('SELECT * FROM projects WHERE id = ?', [id]);
        if (existingProject.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
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
        
        // Get project details to delete associated image
        const [project] = await pool.execute('SELECT imageUrl FROM projects WHERE id = ?', [id]);
        
        if (project.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Delete image file if exists
        if (project[0].imageUrl) {
            const imagePath = path.join(__dirname, '../', project[0].imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
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

// UPDATE PROJECT ORDER
router.patch('/reorder', authenticateToken, [
    body('projects').isArray().withMessage('Projects must be an array'),
    body('projects.*.id').isInt().withMessage('Project ID must be integer'),
    body('projects.*.sortOrder').isInt().withMessage('Sort order must be integer')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { projects } = req.body;
        const pool = getDbConnection();

        // Update sort order for each project
        for (const project of projects) {
            await pool.execute(
                'UPDATE projects SET sortOrder = ? WHERE id = ?',
                [project.sortOrder, project.id]
            );
        }

        res.json({
            success: true,
            message: 'Project order updated successfully'
        });
    } catch (error) {
        console.error('Reorder projects error:', error);
        res.status(500).json({ error: 'Failed to update project order' });
    }
});

module.exports = router;
