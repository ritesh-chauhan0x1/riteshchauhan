@echo off
echo 🚀 Ritesh Portfolio Setup Script
echo For: rites.chauhan11@gmail.com
echo.

echo 📋 Checking Node.js installation...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo.
    echo Please install Node.js first:
    echo 1. Go to: https://nodejs.org/
    echo 2. Download and install LTS version
    echo 3. Restart this script
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js found!
node -v

echo.
echo 📦 Installing portfolio dependencies...
npm install

echo.
echo 🔧 Checking environment configuration...
if exist .env (
    echo ✅ Environment file found
) else (
    echo ⚠️ Copying environment template...
    copy .env.example .env
)

echo.
echo 🌟 Your portfolio is configured for:
echo    📧 Email: rites.chauhan11@gmail.com
echo    📁 Google Drive Folder: 1BmMRHyBgvfKGOYOH8mZGUJOb8Lk9Y8Kg
echo    🏠 Local URL: http://localhost:3000

echo.
echo 🔑 NEXT STEPS:
echo 1. Get Google API credentials from: https://console.cloud.google.com/
echo 2. Update .env file with your Client ID and Secret
echo 3. Run: npm start
echo 4. Open: http://localhost:3000
echo.

echo 📚 For detailed instructions, see: COMPLETE_SETUP.md
echo.

echo Ready to start the server? (y/n)
set /p choice=
if /i "%choice%"=="y" (
    echo.
    echo 🚀 Starting portfolio server...
    npm start
) else (
    echo.
    echo 👋 Setup complete! Run 'npm start' when ready.
)

pause
