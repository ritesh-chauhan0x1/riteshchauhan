@echo off
echo ==========================================
echo 🚀 Ritesh Chauhan's Portfolio Backend
echo ==========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

:: Check if npm packages are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
    echo.
)

:: Check if .env file exists
if not exist ".env" (
    echo ⚠️  Creating .env file from template...
    copy ".env.example" ".env"
    echo.
    echo 📝 Please edit .env file with your database credentials
    echo.
)

:: Start the server
echo 🌟 Starting Portfolio Backend Server...
echo.
echo 📡 Server will be available at: http://localhost:3000
echo 🎯 Admin Panel: http://localhost:3000/admin
echo 📊 API Endpoints: http://localhost:3000/api
echo.
echo Press Ctrl+C to stop the server
echo ==========================================
echo.

node server.js
