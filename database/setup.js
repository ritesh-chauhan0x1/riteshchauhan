const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
    multipleStatements: true
};

async function setupDatabase() {
    let connection;
    
    try {
        console.log('🔄 Connecting to MySQL server...');
        connection = await mysql.createConnection(dbConfig);
        
        // Create database if it doesn't exist
        const dbName = process.env.DB_NAME || 'portfolio_db';
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        console.log(`✅ Database '${dbName}' created/verified successfully`);
        
        // Use the database
        await connection.execute(`USE ${dbName}`);
        
        // Create tables
        await createTables(connection);
        
        // Insert default data
        await insertDefaultData(connection);
        
        console.log('🎉 Database setup completed successfully!');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

async function createTables(connection) {
    console.log('🔧 Creating database tables...');
    
    // Profile table
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS profile (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL DEFAULT 'Ritesh Chauhan',
            title VARCHAR(200) NOT NULL DEFAULT 'Full Stack Developer & CSE Student',
            bio TEXT,
            location VARCHAR(100) DEFAULT 'Birgunj, Nepal',
            education VARCHAR(200) DEFAULT '4th Year B.Tech CSE at KIIT',
            email VARCHAR(100) DEFAULT '22054368@kiit.ac.in',
            phone VARCHAR(20) DEFAULT '+919337940768',
            profilePhoto VARCHAR(500),
            resumeUrl VARCHAR(500),
            about TEXT,
            yearsInTech INT DEFAULT 4,
            totalProjects INT DEFAULT 50,
            leetcodeProblems INT DEFAULT 100,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    
    // Projects table
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS projects (
            id INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(200) NOT NULL,
            description TEXT NOT NULL,
            technologies JSON,
            liveUrl VARCHAR(500),
            githubUrl VARCHAR(500),
            imageUrl VARCHAR(500),
            isFeatured BOOLEAN DEFAULT FALSE,
            category VARCHAR(50) DEFAULT 'web',
            status VARCHAR(20) DEFAULT 'completed',
            sortOrder INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    
    // Skills table
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS skills (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            level INT NOT NULL CHECK (level >= 0 AND level <= 100),
            category VARCHAR(50) NOT NULL,
            icon VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    
    // Social Links table
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS social_links (
            id INT PRIMARY KEY AUTO_INCREMENT,
            platform VARCHAR(50) NOT NULL,
            url VARCHAR(500) NOT NULL,
            icon VARCHAR(100),
            isActive BOOLEAN DEFAULT TRUE,
            sortOrder INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    
    // Photos table
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS photos (
            id INT PRIMARY KEY AUTO_INCREMENT,
            filename VARCHAR(200) NOT NULL,
            originalName VARCHAR(200),
            caption TEXT,
            url VARCHAR(500) NOT NULL,
            category VARCHAR(50) DEFAULT 'gallery',
            isVisible BOOLEAN DEFAULT TRUE,
            sortOrder INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    
    // Memories table
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS memories (
            id INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            videoUrl VARCHAR(500) NOT NULL,
            category ENUM('childhood', 'hostel', 'school') NOT NULL,
            thumbnail VARCHAR(500),
            isVisible BOOLEAN DEFAULT TRUE,
            sortOrder INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    
    // Contact Messages table
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            subject VARCHAR(200),
            message TEXT NOT NULL,
            isRead BOOLEAN DEFAULT FALSE,
            replied BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    // Education table
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS education (
            id INT PRIMARY KEY AUTO_INCREMENT,
            institution VARCHAR(200) NOT NULL,
            degree VARCHAR(200) NOT NULL,
            field VARCHAR(200),
            startYear INT,
            endYear INT,
            grade VARCHAR(50),
            description TEXT,
            isVisible BOOLEAN DEFAULT TRUE,
            sortOrder INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    
    // Hobbies table
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS hobbies (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            icon VARCHAR(100),
            isVisible BOOLEAN DEFAULT TRUE,
            sortOrder INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    
    // Achievements table
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS achievements (
            id INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            year INT,
            category VARCHAR(100),
            icon VARCHAR(100),
            isVisible BOOLEAN DEFAULT TRUE,
            sortOrder INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    
    console.log('✅ All tables created successfully');
}

async function insertDefaultData(connection) {
    console.log('📝 Inserting default data...');
    
    // Insert default profile
    await connection.execute(`
        INSERT IGNORE INTO profile (id, name, title, bio, about) VALUES (
            1,
            'Ritesh Chauhan',
            'Full Stack Developer & CSE Student',
            '🎓 4th Year B.Tech CSE Student at KIIT University | 🇳🇵 Born in Birgunj, Nepal\\nPassionate about creating innovative digital solutions and bringing ideas to life through code.',
            'Hello! I\\'m Ritesh, a passionate Computer Science Engineering student from Nepal, currently pursuing my B.Tech at KIIT University. Born and raised in the vibrant city of Birgunj, I discovered my love for technology and programming during my early college years.'
        )
    `);
    
    // Insert default social links
    const socialLinks = [
        ['instagram', 'https://instagram.com/riteshchauhan_15', 'fab fa-instagram'],
        ['facebook', 'https://facebook.com/riteshchauhan_15', 'fab fa-facebook'],
        ['github', 'https://github.com/ritesh-chauhan0x1', 'fab fa-github'],
        ['leetcode', 'https://leetcode.com/u/riteshchauhn_15', 'fas fa-code'],
        ['whatsapp', 'https://wa.me/+919337940768', 'fab fa-whatsapp'],
        ['gmail', '22054368@kiit.ac.in', 'far fa-envelope']
    ];
    
    for (let i = 0; i < socialLinks.length; i++) {
        await connection.execute(`
            INSERT IGNORE INTO social_links (platform, url, icon, sortOrder) VALUES (?, ?, ?, ?)
        `, [...socialLinks[i], i]);
    }
    
    // Insert default skills
    const skills = [
        ['JavaScript (ES6+)', 90, 'frontend', '🟨'],
        ['React.js', 85, 'frontend', '⚛️'],
        ['Node.js', 80, 'backend', '🟢'],
        ['Python', 75, 'backend', '🐍'],
        ['MySQL', 70, 'database', '🗄️'],
        ['MongoDB', 75, 'database', '🍃'],
        ['HTML5', 95, 'frontend', '🧡'],
        ['CSS3', 90, 'frontend', '💙'],
        ['Express.js', 80, 'backend', '🚀'],
        ['Git & GitHub', 85, 'tools', '📚']
    ];
    
    for (const [name, level, category, icon] of skills) {
        await connection.execute(`
            INSERT IGNORE INTO skills (name, level, category, icon) VALUES (?, ?, ?, ?)
        `, [name, level, category, icon]);
    }
    
    // Insert default education
    const education = [
        ['KIIT University', 'B.Tech Computer Science Engineering', 'Computer Science', 2021, 2025, '8.5 CGPA', 'Currently pursuing Bachelor of Technology in Computer Science Engineering with focus on Full Stack Development, Data Structures & Algorithms, and Software Engineering.', true, 1],
        ['Maharshi Vidya Mandir', 'Higher Secondary', 'Science (PCM)', 2019, 2021, '85%', 'Completed higher secondary education with Physics, Chemistry, and Mathematics. Developed strong analytical and problem-solving skills.', true, 2]
    ];
    
    for (const edu of education) {
        await connection.execute(`
            INSERT IGNORE INTO education (institution, degree, field, startYear, endYear, grade, description, isVisible, sortOrder) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, edu);
    }
    
    // Insert default hobbies
    const hobbies = [
        ['Gaming', 'Love playing strategic and adventure games', '🎮'],
        ['Coding', 'Building cool projects and learning new technologies', '💻'],
        ['Music', 'Listening to various genres, especially while coding', '🎵'],
        ['Reading', 'Tech blogs, documentation, and programming books', '📚'],
        ['Photography', 'Capturing moments and beautiful landscapes', '📸']
    ];
    
    for (let i = 0; i < hobbies.length; i++) {
        await connection.execute(`
            INSERT IGNORE INTO hobbies (name, description, icon, sortOrder) VALUES (?, ?, ?, ?)
        `, [...hobbies[i], i]);
    }
    
    // Insert default achievements
    const achievements = [
        ['100+ LeetCode Problems', 'Solved over 100 coding problems on LeetCode platform', 2024, 'Coding', '🏆'],
        ['50+ GitHub Projects', 'Created and maintained 50+ projects on GitHub', 2024, 'Development', '🚀'],
        ['KIIT Tech Fest Participation', 'Participated in various hackathons and coding competitions', 2023, 'Competition', '🥇'],
        ['Full Stack Certification', 'Completed comprehensive full stack development course', 2023, 'Education', '📜']
    ];
    
    for (let i = 0; i < achievements.length; i++) {
        await connection.execute(`
            INSERT IGNORE INTO achievements (title, description, year, category, icon, sortOrder) VALUES (?, ?, ?, ?, ?, ?)
        `, [...achievements[i], i]);
    }
    
    console.log('✅ Default data inserted successfully');
}

// Run setup if this file is executed directly
if (require.main === module) {
    setupDatabase()
        .then(() => {
            console.log('🎉 Database setup completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Database setup failed:', error);
            process.exit(1);
        });
}

module.exports = { setupDatabase };
