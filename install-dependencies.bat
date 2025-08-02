@echo off
echo ======================================
echo Portfolio Setup - Node.js Installation
echo ======================================

echo.
echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js is already installed
    node --version
    npm --version
) else (
    echo ❌ Node.js is not installed
    echo.
    echo Please install Node.js first:
    echo 1. Go to https://nodejs.org/
    echo 2. Download and install the LTS version
    echo 3. Run this script again after installation
    echo.
    pause
    exit /b 1
)

echo.
echo Installing npm dependencies...
npm install

echo.
echo Setting up database...
npm run setup-db

echo.
echo Starting server...
echo Backend will run on http://localhost:3000
echo Frontend will connect automatically
npm run dev

pause
