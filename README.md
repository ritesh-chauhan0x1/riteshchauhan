# Portfolio Backend Setup

A comprehensive backend system for Ritesh Chauhan's portfolio website with authentication, database management, and file upload capabilities.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Windows Setup
```cmd
setup.bat
```

### Linux/Mac Setup
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   # Copy and edit environment file
   cp .env.example .env
   # Update database credentials and JWT secret
   ```

3. **Setup Database**
   ```bash
   npm run setup-db
   ```

4. **Start Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment configuration
├── database/
│   └── setup.js          # Database schema setup
├── routes/
│   ├── projects.js       # Project CRUD operations
│   ├── memories.js       # Memory management
│   └── photos.js         # Photo gallery
├── uploads/              # File storage
│   ├── photos/
│   ├── projects/
│   └── memories/
└── api-client.js         # Frontend integration

```

## 🗄️ Database Schema

### Tables Created:
- **profile** - Personal information and bio
- **projects** - Portfolio projects with images
- **skills** - Technical skills and proficiency
- **social_links** - Social media profiles
- **photos** - Gallery images
- **memories** - Childhood, hostel, school memories
- **contact_messages** - Contact form submissions
- **education** - Educational background
- **hobbies** - Personal interests
- **achievements** - Awards and accomplishments

## 🔐 API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project (Auth required)
- `PUT /api/projects/:id` - Update project (Auth required)
- `DELETE /api/projects/:id` - Delete project (Auth required)

### Memories
- `GET /api/memories` - Get all memories
- `GET /api/memories/:category` - Get memories by category
- `POST /api/memories` - Upload new memory (Auth required)
- `DELETE /api/memories/:id` - Delete memory (Auth required)

### Photos
- `GET /api/photos` - Get all photos
- `POST /api/photos` - Upload new photo (Auth required)
- `DELETE /api/photos/:id` - Delete photo (Auth required)

### Profile
- `GET /api/profile` - Get profile information
- `PUT /api/profile` - Update profile (Auth required)

## 🔧 Configuration

### Environment Variables (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=portfolio_db

# Security
JWT_SECRET=your-super-secret-jwt-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-admin-password

# Server Configuration
PORT=3000
NODE_ENV=production
```

## 📡 Frontend Integration

Use the provided `api-client.js` for seamless frontend integration:

```javascript
// Initialize API client
const api = new PortfolioAPI();

// Get projects
const projects = await api.getProjects();

// Admin operations (after login)
const admin = new AdminSystem(api);
await admin.login(username, password);
await admin.addProject(projectData, imageFile);
```

## 🛡️ Security Features

- JWT-based authentication
- bcrypt password hashing
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation with express-validator
- File upload restrictions

## 📤 File Upload

### Supported Formats:
- **Images**: JPG, JPEG, PNG, GIF (max 10MB)
- **Videos**: MP4, AVI, MOV (max 50MB)

### Storage Structure:
```
uploads/
├── photos/           # Gallery photos
├── projects/         # Project images
└── memories/
    ├── childhood/    # Childhood videos
    ├── hostel/       # Hostel memories
    └── school/       # School memories
```

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify credentials in .env file
   - Ensure database user has proper permissions

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process: `npx kill-port 3000`

3. **File Upload Issues**
   - Check uploads directory permissions
   - Verify file size limits
   - Ensure supported file formats

### Debug Mode:
```bash
DEBUG=* npm run dev
```

## 📝 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run setup-db` - Initialize database schema
- `npm test` - Run tests (when implemented)

## 🔄 Updates and Maintenance

### Adding New Features:
1. Create new route in `routes/` directory
2. Add database table in `database/setup.js`
3. Update API client in `api-client.js`
4. Test with frontend integration

### Database Backup:
```bash
mysqldump -u root -p portfolio_db > backup.sql
```

### Database Restore:
```bash
mysql -u root -p portfolio_db < backup.sql
```

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review server logs: `npm run dev`
- Verify database connectivity
- Check file permissions for uploads directory

---

**Built with ❤️ for Ritesh Chauhan's Portfolio**
