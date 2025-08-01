const express = require('express');
const mysql = require('mysql2/promise');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

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

// File upload configuration for memories
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const category = req.body.category || 'general';
            const uploadPath = path.join(__dirname, `../uploads/memories/${category}`);
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, 'memory-' + uniqueSuffix + path.extname(file.originalname));
        }
    }),
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit for videos
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video and image files are allowed'), false);
        }
    }
});

// GET ALL MEMORIES
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const pool = getDbConnection();
        
        let query = 'SELECT * FROM memories WHERE isVisible = TRUE';
        let params = [];
        
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        
        query += ' ORDER BY sortOrder ASC, created_at DESC';
        
        const [rows] = await pool.execute(query, params);
        
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Get memories error:', error);
        res.status(500).json({ error: 'Failed to fetch memories' });
    }
});

// GET MEMORIES BY CATEGORY
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        
        if (!['childhood', 'hostel', 'school'].includes(category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }
        
        const pool = getDbConnection();
        const [rows] = await pool.execute(
            'SELECT * FROM memories WHERE category = ? AND isVisible = TRUE ORDER BY sortOrder ASC, created_at DESC',
            [category]
        );
        
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Get memories by category error:', error);
        res.status(500).json({ error: 'Failed to fetch memories' });
    }
});

// GET SINGLE MEMORY
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = getDbConnection();
        const [rows] = await pool.execute('SELECT * FROM memories WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Memory not found' });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Get memory error:', error);
        res.status(500).json({ error: 'Failed to fetch memory' });
    }
});

// CREATE NEW MEMORY
router.post('/', authenticateToken, upload.single('video'), [
    body('title').notEmpty().withMessage('Title is required'),
    body('category').isIn(['childhood', 'hostel', 'school']).withMessage('Category must be childhood, hostel, or school'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description too long')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Video file is required' });
        }

        const { title, description, category } = req.body;
        const videoUrl = `/uploads/memories/${category}/${req.file.filename}`;
        
        const pool = getDbConnection();
        const [result] = await pool.execute(`
            INSERT INTO memories (title, description, videoUrl, category)
            VALUES (?, ?, ?, ?)
        `, [title, description || null, videoUrl, category]);

        res.status(201).json({
            success: true,
            message: 'Memory created successfully',
            data: {
                id: result.insertId,
                title,
                description,
                videoUrl,
                category
            }
        });
    } catch (error) {
        console.error('Create memory error:', error);
        res.status(500).json({ error: 'Failed to create memory' });
    }
});

// UPDATE MEMORY
router.put('/:id', authenticateToken, upload.single('video'), [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('category').optional().isIn(['childhood', 'hostel', 'school']).withMessage('Category must be childhood, hostel, or school'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description too long')
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
        
        // Check if memory exists
        const [existingMemory] = await pool.execute('SELECT * FROM memories WHERE id = ?', [id]);
        if (existingMemory.length === 0) {
            return res.status(404).json({ error: 'Memory not found' });
        }

        // Handle video file update
        if (req.file) {
            const category = updateData.category || existingMemory[0].category;
            updateData.videoUrl = `/uploads/memories/${category}/${req.file.filename}`;
            
            // Delete old video file
            if (existingMemory[0].videoUrl) {
                const oldVideoPath = path.join(__dirname, '../', existingMemory[0].videoUrl);
                if (fs.existsSync(oldVideoPath)) {
                    fs.unlinkSync(oldVideoPath);
                }
            }
        }

        // Build dynamic update query
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        
        if (fields.length === 0) {
            return res.status(400).json({ error: 'No data to update' });
        }

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE memories SET ${setClause}, updated_at = NOW() WHERE id = ?`;

        await pool.execute(query, [...values, id]);

        res.json({
            success: true,
            message: 'Memory updated successfully'
        });
    } catch (error) {
        console.error('Update memory error:', error);
        res.status(500).json({ error: 'Failed to update memory' });
    }
});

// DELETE MEMORY
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const pool = getDbConnection();
        
        // Get memory details to delete associated video
        const [memory] = await pool.execute('SELECT videoUrl FROM memories WHERE id = ?', [id]);
        
        if (memory.length === 0) {
            return res.status(404).json({ error: 'Memory not found' });
        }

        // Delete video file if exists
        if (memory[0].videoUrl) {
            const videoPath = path.join(__dirname, '../', memory[0].videoUrl);
            if (fs.existsSync(videoPath)) {
                fs.unlinkSync(videoPath);
            }
        }

        // Delete memory from database
        await pool.execute('DELETE FROM memories WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Memory deleted successfully'
        });
    } catch (error) {
        console.error('Delete memory error:', error);
        res.status(500).json({ error: 'Failed to delete memory' });
    }
});

// TOGGLE MEMORY VISIBILITY
router.patch('/:id/visibility', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const pool = getDbConnection();
        
        // Toggle visibility
        await pool.execute(
            'UPDATE memories SET isVisible = NOT isVisible WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Memory visibility updated successfully'
        });
    } catch (error) {
        console.error('Toggle memory visibility error:', error);
        res.status(500).json({ error: 'Failed to update memory visibility' });
    }
});

// UPDATE MEMORIES ORDER
router.patch('/reorder', authenticateToken, [
    body('memories').isArray().withMessage('Memories must be an array'),
    body('memories.*.id').isInt().withMessage('Memory ID must be integer'),
    body('memories.*.sortOrder').isInt().withMessage('Sort order must be integer')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { memories } = req.body;
        const pool = getDbConnection();

        // Update sort order for each memory
        for (const memory of memories) {
            await pool.execute(
                'UPDATE memories SET sortOrder = ? WHERE id = ?',
                [memory.sortOrder, memory.id]
            );
        }

        res.json({
            success: true,
            message: 'Memory order updated successfully'
        });
    } catch (error) {
        console.error('Reorder memories error:', error);
        res.status(500).json({ error: 'Failed to update memory order' });
    }
});

module.exports = router;
