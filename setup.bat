@echo off
REM Portfolio Backend Setup Script for Windows
echo 🚀 Setting up Ritesh's Portfolio Backend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MySQL is installed
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL is not installed. Please install MySQL first.
    echo Download from: https://dev.mysql.com/downloads/
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Check if .env file exists
if not exist ".env" (
    echo ⚙️ Environment file not found. Please configure .env file.
    echo Copy .env.example to .env and update the values.
    pause
    exit /b 1
)

REM Setup database
echo 🗄️ Setting up database...
node database/setup.js

if %errorlevel% equ 0 (
    echo ✅ Database setup completed successfully!
) else (
    echo ❌ Database setup failed. Please check your MySQL configuration.
    pause
    exit /b 1
)

REM Create uploads directory
echo 📁 Creating uploads directories...
if not exist "uploads" mkdir uploads
if not exist "uploads\photos" mkdir uploads\photos
if not exist "uploads\projects" mkdir uploads\projects
if not exist "uploads\memories" mkdir uploads\memories
if not exist "uploads\memories\childhood" mkdir uploads\memories\childhood
if not exist "uploads\memories\hostel" mkdir uploads\memories\hostel
if not exist "uploads\memories\school" mkdir uploads\memories\school

echo 🎉 Backend setup completed successfully!
echo.
echo 📝 Next steps:
echo 1. Update .env file with your MySQL credentials
echo 2. Run 'npm start' to start the server
echo 3. Server will be available at http://localhost:3000
echo.
echo 🔧 Available commands:
echo - npm start      : Start production server
echo - npm run dev    : Start development server with auto-reload
echo - npm run setup-db : Re-run database setup
pause
