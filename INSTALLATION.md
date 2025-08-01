# 🚀 Complete Installation Guide for Ritesh's Portfolio Backend

## Prerequisites Installation

### Step 1: Install Node.js
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (recommended)
3. Run the installer and follow the setup wizard
4. **Important**: Make sure to check "Add to PATH" during installation
5. Restart your terminal/PowerShell after installation

**Verify Installation:**
```powershell
node --version
npm --version
```

### Step 2: Install MySQL
1. Go to [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
2. Download **MySQL Community Server**
3. Run the installer and choose "Developer Default"
4. Set a root password (remember this for later)
5. Complete the installation

**Verify Installation:**
```powershell
mysql --version
```

### Step 3: Install Git (if not already installed)
1. Go to [git-scm.com](https://git-scm.com/)
2. Download and install Git for Windows
3. Use default settings during installation

## Backend Setup Process

### Step 1: Navigate to Project Directory
```powershell
cd "C:\Users\rites\riteshchauhan"
```

### Step 2: Install Dependencies
```powershell
npm install
```

### Step 3: Configure Environment
1. Open the `.env` file in a text editor
2. Update the database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_ROOT_PASSWORD
DB_NAME=portfolio_db
JWT_SECRET=your-super-secret-jwt-key-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password
PORT=3000
NODE_ENV=development
```

### Step 4: Setup Database
```powershell
npm run setup-db
```

### Step 5: Start the Server
```powershell
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

## Alternative: Using Automated Setup Script

After installing Node.js and MySQL, run:
```powershell
.\setup.bat
```

## Verification Steps

### 1. Check Server is Running
- Open browser and go to: `http://localhost:3000`
- You should see the API status message

### 2. Test API Endpoints
```powershell
# Test projects endpoint
curl http://localhost:3000/api/projects

# Test profile endpoint  
curl http://localhost:3000/api/profile
```

### 3. Check Database
```powershell
mysql -u root -p
```
Then in MySQL:
```sql
USE portfolio_db;
SHOW TABLES;
```

## Common Installation Issues

### Issue 1: "npm not recognized"
**Solution**: Node.js not installed or not added to PATH
- Reinstall Node.js and ensure "Add to PATH" is checked
- Restart terminal after installation

### Issue 2: "mysql not recognized"  
**Solution**: MySQL not installed or not added to PATH
- Reinstall MySQL and choose "Add to PATH" option
- Restart terminal after installation

### Issue 3: Database connection failed
**Solution**: Check MySQL service and credentials
- Start MySQL service: `net start mysql`
- Verify credentials in `.env` file
- Test connection: `mysql -u root -p`

### Issue 4: Port already in use
**Solution**: Change port or kill existing process
- Change PORT in `.env` file to 3001 or another port
- Kill existing process: `taskkill /f /im node.exe`

## Development Workflow

### 1. Starting Development
```powershell
# Start with auto-reload
npm run dev
```

### 2. Making Changes
- Edit files in the project
- Server automatically restarts (in dev mode)
- Check console for any errors

### 3. Testing Changes
- Test API endpoints in browser or Postman
- Check database for data changes
- Verify file uploads work

### 4. Production Deployment
```powershell
# Set environment to production
# Update .env: NODE_ENV=production
npm start
```

## File Structure Overview

```
C:\Users\rites\riteshchauhan\
├── server.js              # Main server application
├── package.json           # Dependencies and scripts
├── .env                   # Environment configuration
├── README.md              # This documentation
├── setup.bat              # Windows setup script
├── setup.sh               # Linux/Mac setup script
├── api-client.js          # Frontend integration
├── database/
│   └── setup.js          # Database schema and setup
├── routes/
│   ├── projects.js       # Projects API endpoints
│   ├── memories.js       # Memories API endpoints
│   └── photos.js         # Photos API endpoints
└── uploads/              # File storage (created automatically)
    ├── photos/
    ├── projects/
    └── memories/
```

## Next Steps After Setup

1. **Update Frontend**: Connect your existing HTML/CSS/JS to the new backend
2. **Test Features**: Try uploading projects, photos, and memories
3. **Customize**: Modify the database schema or API endpoints as needed
4. **Deploy**: Consider hosting on services like Heroku, Vercel, or DigitalOcean

## Support and Resources

- **Node.js Documentation**: [nodejs.org/docs](https://nodejs.org/docs)
- **MySQL Documentation**: [dev.mysql.com/doc](https://dev.mysql.com/doc)
- **Express.js Guide**: [expressjs.com](https://expressjs.com)

---

**Need Help?** Check the console output for error messages and refer to the troubleshooting section above.
