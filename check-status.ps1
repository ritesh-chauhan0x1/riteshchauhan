# 🚀 Portfolio Status Checker (PowerShell Version)
# Run this to verify all systems are working properly

Write-Host "`n🔍 Portfolio System Status Check`n" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Yellow

# Check if required files exist
$requiredFiles = @(
    'index.html',
    'styles.css', 
    'script.js',
    'server.js',
    'cloud-storage.js',
    'backend-service.js',
    'start-server.bat',
    'package.json'
)

Write-Host "📁 File Structure Check:" -ForegroundColor Green
foreach ($file in $requiredFiles) {
    $exists = Test-Path $file
    $status = if ($exists) { "✅" } else { "❌" }
    Write-Host "   $status $file" -ForegroundColor $(if ($exists) { "Green" } else { "Red" })
}

# Check if .env file exists
Write-Host "`n⚙️  Configuration Check:" -ForegroundColor Green
$envExists = Test-Path ".env"
$envStatus = if ($envExists) { "✅" } else { "⚠️ " }
$envMessage = if ($envExists) { "exists" } else { "needs to be created" }
Write-Host "   $envStatus .env file $envMessage" -ForegroundColor $(if ($envExists) { "Green" } else { "Yellow" })

if (-not $envExists) {
    Write-Host "      💡 Copy .env.example to .env and configure database settings" -ForegroundColor Cyan
}

# Check uploads directory
Write-Host "`n📂 Storage Check:" -ForegroundColor Green
$uploadsExists = Test-Path "uploads"
$uploadsStatus = if ($uploadsExists) { "✅" } else { "⚠️ " }
$uploadsMessage = if ($uploadsExists) { "exists" } else { "will be created automatically" }
Write-Host "   $uploadsStatus uploads directory $uploadsMessage" -ForegroundColor $(if ($uploadsExists) { "Green" } else { "Yellow" })

# Check Node.js installation
Write-Host "`n🟢 Runtime Check:" -ForegroundColor Green
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "   ✅ Node.js version: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Node.js not found - Download from https://nodejs.org/" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Node.js not installed - Download from https://nodejs.org/" -ForegroundColor Red
}

# Check MySQL
Write-Host "`n🗄️  Database Check:" -ForegroundColor Green
try {
    $mysqlCheck = mysql --version 2>$null
    if ($mysqlCheck) {
        Write-Host "   ✅ MySQL is available" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  MySQL not found in PATH - Make sure it's installed" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  MySQL status unknown - Make sure it's installed and running" -ForegroundColor Yellow
}

Write-Host "`n🎯 Quick Start Commands:" -ForegroundColor Cyan
Write-Host "   1. npm install              # Install dependencies" -ForegroundColor White
Write-Host "   2. Copy .env.example to .env and configure" -ForegroundColor White
Write-Host "   3. Double-click start-server.bat  # Easy startup" -ForegroundColor White
Write-Host "   4. OR run: npm start        # Manual startup" -ForegroundColor White
Write-Host "   5. Open http://localhost:3000 in browser" -ForegroundColor White

Write-Host "`n🆘 If you see issues:" -ForegroundColor Yellow
Write-Host "   • Install Node.js from https://nodejs.org/" -ForegroundColor White
Write-Host "   • Install MySQL from https://www.mysql.com/" -ForegroundColor White
Write-Host "   • Check SETUP_COMPLETE.md for detailed instructions" -ForegroundColor White
Write-Host "   • Make sure port 3000 is available" -ForegroundColor White
Write-Host "   • Check browser console (F12) for errors" -ForegroundColor White

Write-Host "`n✨ Enhanced Features Implemented:" -ForegroundColor Magenta
Write-Host "   🎨 Projects section fixed and enhanced" -ForegroundColor Green
Write-Host "   🚫 Blue effects completely removed" -ForegroundColor Green
Write-Host "   📸 Photo upload with cloud storage integration" -ForegroundColor Green
Write-Host "   🔗 Backend-frontend seamless integration" -ForegroundColor Green
Write-Host "   📱 Responsive admin panel" -ForegroundColor Green
Write-Host "   ☁️  Google Drive integration ready" -ForegroundColor Green
Write-Host "   🔄 Offline mode with localStorage fallback" -ForegroundColor Green
Write-Host "   🛡️  Enhanced error handling and retry logic" -ForegroundColor Green
Write-Host "   📊 Real-time connection status indicators" -ForegroundColor Green

Write-Host "`n🎉 Your portfolio is ready to shine!" -ForegroundColor Green
Write-Host "💡 Next: Run 'start-server.bat' to launch everything!" -ForegroundColor Cyan
Write-Host ""
