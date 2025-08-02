@echo off
echo ========================================
echo Google Drive Setup for Portfolio
echo ========================================
echo.
echo Setting up Google Drive integration for:
echo Email: rites.chauhan11@gmail.com
echo.

echo Installing Google APIs dependency...
npm install googleapis

echo.
echo =======================================
echo SETUP INSTRUCTIONS
echo =======================================
echo.
echo 1. Create Google Cloud Project:
echo    - Go to: https://console.cloud.google.com/
echo    - Create project: "Ritesh Portfolio Storage"
echo.
echo 2. Enable Google Drive API:
echo    - APIs ^& Services ^> Library
echo    - Search "Google Drive API" ^> Enable
echo.
echo 3. Create OAuth2 Credentials:
echo    - APIs ^& Services ^> Credentials
echo    - Create Credentials ^> OAuth 2.0 Client IDs
echo    - Application type: Web application
echo    - Authorized redirect URIs:
echo      http://localhost:3000/auth/google/callback
echo.
echo 4. Create Portfolio Folder in Google Drive:
echo    - Go to drive.google.com
echo    - Create folder: "Portfolio Assets"
echo    - Copy folder ID from URL
echo.
echo 5. Update .env file with your credentials:
echo    - GOOGLE_CLIENT_ID=your-client-id
echo    - GOOGLE_CLIENT_SECRET=your-client-secret  
echo    - GOOGLE_DRIVE_FOLDER_ID=your-folder-id
echo.
echo 6. Run authentication:
echo    - npm start
echo    - Visit: http://localhost:3000/auth/google
echo    - Complete OAuth flow
echo    - Copy tokens to .env file
echo.
echo =======================================
echo Ready to start? (Y/N)
set /p choice=

if /i "%choice%"=="Y" (
    echo.
    echo Opening Google Cloud Console...
    start https://console.cloud.google.com/
    echo.
    echo Opening Google Drive...
    start https://drive.google.com/
    echo.
    echo Follow the instructions above!
    echo When ready, restart your server with: npm start
) else (
    echo.
    echo Instructions saved above. Run this script again when ready!
)

echo.
pause
