const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const UnifiedStorage = require('./storage/unified-storage');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Storage System
const fileStorage = new UnifiedStorage();

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS Configuration - Updated for local development
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'file://',
        null // For local file:// protocol
    ],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Database Connection
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Test Database Connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
}

// File Upload Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'uploads');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'profilePhoto' || file.fieldname === 'photos') {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed for photos'), false);
            }
        } else if (file.fieldname === 'videos') {
            if (file.mimetype.startsWith('video/')) {
                cb(null, true);
            } else {
                cb(new Error('Only video files are allowed for videos'), false);
            }
        } else {
            cb(null, true);
        }
    }
});

// JWT Middleware for Authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Validation Middleware
const validateInput = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    };
};

// AUTH ROUTES
// Admin Login
app.post('/api/auth/login', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], validateInput([
    body('username').notEmpty(),
    body('password').notEmpty()
]), async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check credentials against environment variables
        if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                username: username,
                role: 'admin',
                loginTime: new Date().toISOString()
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                username: username,
                role: 'admin'
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Verify Token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
    res.json({
        valid: true,
        user: req.user
    });
});

// PROFILE ROUTES
// Get Profile Data
app.get('/api/profile', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM profile WHERE id = 1');
        const profile = rows[0] || {};
        
        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update Profile Data
app.put('/api/profile', authenticateToken, upload.single('profilePhoto'), [
    body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('title').optional().isLength({ min: 5 }).withMessage('Title must be at least 5 characters')
], validateInput([
    body('name').optional().isLength({ min: 2 }),
    body('email').optional().isEmail(),
    body('title').optional().isLength({ min: 5 })
]), async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        if (req.file) {
            updateData.profilePhoto = `/uploads/${req.file.filename}`;
        }

        // Build dynamic update query
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        
        if (fields.length === 0) {
            return res.status(400).json({ error: 'No data to update' });
        }

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE profile SET ${setClause}, updated_at = NOW() WHERE id = 1`;

        await pool.execute(query, values);

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Import route modules
const projectsRouter = require('./routes/projects');
const memoriesRouter = require('./routes/memories');
const photosRouter = require('./routes/photos');

// Use route modules
app.use('/api/projects', projectsRouter);
app.use('/api/memories', memoriesRouter);
app.use('/api/photos', photosRouter);

// SKILLS ROUTES
app.get('/api/skills', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM skills ORDER BY category, level DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Get skills error:', error);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});

app.post('/api/skills', authenticateToken, [
    body('name').notEmpty().withMessage('Skill name is required'),
    body('level').isInt({ min: 0, max: 100 }).withMessage('Level must be between 0 and 100'),
    body('category').notEmpty().withMessage('Category is required')
], validateInput([
    body('name').notEmpty(),
    body('level').isInt({ min: 0, max: 100 }),
    body('category').notEmpty()
]), async (req, res) => {
    try {
        const { name, level, category, icon } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO skills (name, level, category, icon) VALUES (?, ?, ?, ?)',
            [name, level, category, icon || null]
        );
        res.status(201).json({ success: true, message: 'Skill added successfully', id: result.insertId });
    } catch (error) {
        console.error('Add skill error:', error);
        res.status(500).json({ error: 'Failed to add skill' });
    }
});

// CONTACT ROUTES
app.post('/api/contact', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').notEmpty().withMessage('Message is required')
], validateInput([
    body('name').notEmpty(),
    body('email').isEmail(),
    body('message').notEmpty()
]), async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        await pool.execute(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject || 'Portfolio Contact', message]
        );
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large' });
        }
    }
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;

// Start Server
if (require.main === module) {
    testConnection();
    
    app.listen(PORT, () => {
        console.log(`🚀 Portfolio Backend Server running on port ${PORT}`);
        console.log(`📱 API Base URL: http://localhost:${PORT}/api`);
        console.log(`🔒 Environment: ${process.env.NODE_ENV}`);
    });
}
