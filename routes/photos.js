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

// File upload configuration for photos
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = path.join(__dirname, '../uploads/photos');
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
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

// GET ALL PHOTOS
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const pool = getDbConnection();
        
        let query = 'SELECT * FROM photos WHERE isVisible = TRUE';
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
        console.error('Get photos error:', error);
        res.status(500).json({ error: 'Failed to fetch photos' });
    }
});

// GET SINGLE PHOTO
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = getDbConnection();
        const [rows] = await pool.execute('SELECT * FROM photos WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Photo not found' });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Get photo error:', error);
        res.status(500).json({ error: 'Failed to fetch photo' });
    }
});

// UPLOAD SINGLE PHOTO
router.post('/', authenticateToken, upload.single('photo'), [
    body('caption').optional().isLength({ max: 200 }).withMessage('Caption too long'),
    body('category').optional().isLength({ max: 50 }).withMessage('Category too long')
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
            return res.status(400).json({ error: 'Photo file is required' });
        }

        const { caption, category = 'gallery' } = req.body;
        const filename = req.file.filename;
        const originalName = req.file.originalname;
        const url = `/uploads/photos/${filename}`;
        
        const pool = getDbConnection();
        const [result] = await pool.execute(`
            INSERT INTO photos (filename, originalName, caption, url, category)
            VALUES (?, ?, ?, ?, ?)
        `, [filename, originalName, caption || null, url, category]);

        res.status(201).json({
            success: true,
            message: 'Photo uploaded successfully',
            data: {
                id: result.insertId,
                filename,
                originalName,
                caption,
                url,
                category
            }
        });
    } catch (error) {
        console.error('Upload photo error:', error);
        res.status(500).json({ error: 'Failed to upload photo' });
    }
});

// UPLOAD MULTIPLE PHOTOS
router.post('/bulk', authenticateToken, upload.array('photos', 10), [
    body('category').optional().isLength({ max: 50 }).withMessage('Category too long')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No photo files provided' });
        }

        const { category = 'gallery' } = req.body;
        const pool = getDbConnection();
        const uploadedPhotos = [];

        for (const file of req.files) {
            const filename = file.filename;
            const originalName = file.originalname;
            const url = `/uploads/photos/${filename}`;
            
            const [result] = await pool.execute(`
                INSERT INTO photos (filename, originalName, url, category)
                VALUES (?, ?, ?, ?)
            `, [filename, originalName, url, category]);

            uploadedPhotos.push({
                id: result.insertId,
                filename,
                originalName,
                url,
                category
            });
        }

        res.status(201).json({
            success: true,
            message: `${uploadedPhotos.length} photos uploaded successfully`,
            data: uploadedPhotos
        });
    } catch (error) {
        console.error('Bulk upload photos error:', error);
        res.status(500).json({ error: 'Failed to upload photos' });
    }
});

// UPDATE PHOTO
router.put('/:id', authenticateToken, [
    body('caption').optional().isLength({ max: 200 }).withMessage('Caption too long'),
    body('category').optional().isLength({ max: 50 }).withMessage('Category too long')
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
        
        // Check if photo exists
        const [existingPhoto] = await pool.execute('SELECT * FROM photos WHERE id = ?', [id]);
        if (existingPhoto.length === 0) {
            return res.status(404).json({ error: 'Photo not found' });
        }

        // Build dynamic update query
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        
        if (fields.length === 0) {
            return res.status(400).json({ error: 'No data to update' });
        }

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE photos SET ${setClause}, updated_at = NOW() WHERE id = ?`;

        await pool.execute(query, [...values, id]);

        res.json({
            success: true,
            message: 'Photo updated successfully'
        });
    } catch (error) {
        console.error('Update photo error:', error);
        res.status(500).json({ error: 'Failed to update photo' });
    }
});

// DELETE PHOTO
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const pool = getDbConnection();
        
        // Get photo details to delete associated file
        const [photo] = await pool.execute('SELECT filename, url FROM photos WHERE id = ?', [id]);
        
        if (photo.length === 0) {
            return res.status(404).json({ error: 'Photo not found' });
        }

        // Delete photo file if exists
        if (photo[0].filename) {
            const photoPath = path.join(__dirname, '../uploads/photos', photo[0].filename);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }

        // Delete photo from database
        await pool.execute('DELETE FROM photos WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Photo deleted successfully'
        });
    } catch (error) {
        console.error('Delete photo error:', error);
        res.status(500).json({ error: 'Failed to delete photo' });
    }
});

// TOGGLE PHOTO VISIBILITY
router.patch('/:id/visibility', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const pool = getDbConnection();
        
        // Toggle visibility
        await pool.execute(
            'UPDATE photos SET isVisible = NOT isVisible WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Photo visibility updated successfully'
        });
    } catch (error) {
        console.error('Toggle photo visibility error:', error);
        res.status(500).json({ error: 'Failed to update photo visibility' });
    }
});

// UPDATE PHOTOS ORDER
router.patch('/reorder', authenticateToken, [
    body('photos').isArray().withMessage('Photos must be an array'),
    body('photos.*.id').isInt().withMessage('Photo ID must be integer'),
    body('photos.*.sortOrder').isInt().withMessage('Sort order must be integer')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { photos } = req.body;
        const pool = getDbConnection();

        // Update sort order for each photo
        for (const photo of photos) {
            await pool.execute(
                'UPDATE photos SET sortOrder = ? WHERE id = ?',
                [photo.sortOrder, photo.id]
            );
        }

        res.json({
            success: true,
            message: 'Photo order updated successfully'
        });
    } catch (error) {
        console.error('Reorder photos error:', error);
        res.status(500).json({ error: 'Failed to update photo order' });
    }
});

// GET PHOTO CATEGORIES
router.get('/categories/list', async (req, res) => {
    try {
        const pool = getDbConnection();
        const [rows] = await pool.execute(`
            SELECT DISTINCT category, COUNT(*) as count 
            FROM photos 
            WHERE isVisible = TRUE 
            GROUP BY category 
            ORDER BY category
        `);
        
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Get photo categories error:', error);
        res.status(500).json({ error: 'Failed to fetch photo categories' });
    }
});

module.exports = router;
