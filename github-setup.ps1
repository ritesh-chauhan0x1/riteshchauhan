# Quick GitHub Repository Creation Script
# This script will help you create GitHub repositories for all projects

Write-Host "🚀 GitHub Repository Creation Helper" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor White

$projects = @(
    @{ Name = "netflix-clone"; Desc = "Netflix Clone - React & Firebase streaming app" },
    @{ Name = "youtube-clone"; Desc = "YouTube Clone - Video sharing platform" },
    @{ Name = "instagram-clone"; Desc = "Instagram Clone - Social media app" },
    @{ Name = "whatsapp-clone"; Desc = "WhatsApp Clone - Real-time messaging" },
    @{ Name = "discord-clone"; Desc = "Discord Clone - Gaming communication" },
    @{ Name = "spotify-clone"; Desc = "Spotify Clone - Music streaming" },
    @{ Name = "ecommerce-platform"; Desc = "E-commerce Platform - Full-stack shopping" },
    @{ Name = "task-manager"; Desc = "Task Manager - Team collaboration app" },
    @{ Name = "blog-platform"; Desc = "Blog Platform - Content management" },
    @{ Name = "chat-app"; Desc = "Chat App - Real-time messaging" },
    @{ Name = "weather-dashboard"; Desc = "Weather Dashboard - Beautiful weather app" },
    @{ Name = "recipe-finder"; Desc = "Recipe Finder - Culinary discovery" },
    @{ Name = "quiz-platform"; Desc = "Quiz Platform - Educational tool" },
    @{ Name = "portfolio-website"; Desc = "Portfolio Website - Professional showcase" }
)

Write-Host "`n📋 Projects ready for GitHub:" -ForegroundColor Yellow
foreach ($project in $projects) {
    Write-Host "   • $($project.Name)" -ForegroundColor Green
}

Write-Host "`n🌐 GitHub Repository URLs:" -ForegroundColor Cyan
foreach ($project in $projects) {
    Write-Host "   https://github.com/ritesh-chauhan0x1/$($project.Name)" -ForegroundColor Blue
}

Write-Host "`n📝 Manual Creation Steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com/new" -ForegroundColor White
Write-Host "2. Create repository with project name" -ForegroundColor White
Write-Host "3. Make it public" -ForegroundColor White
Write-Host "4. Don't initialize with README (we have our own)" -ForegroundColor White
Write-Host "5. Click 'Create repository'" -ForegroundColor White

Write-Host "`n🚀 After creating each repository, run:" -ForegroundColor Magenta
foreach ($project in $projects) {
    Write-Host "`nFor $($project.Name):" -ForegroundColor Cyan
    Write-Host "cd projects\$($project.Name)" -ForegroundColor White
    Write-Host "git remote add origin https://github.com/ritesh-chauhan0x1/$($project.Name).git" -ForegroundColor White
    Write-Host "git branch -M main" -ForegroundColor White
    Write-Host "git push -u origin main" -ForegroundColor White
}

Write-Host "`n💡 Pro Tip: Install GitHub CLI for automated creation:" -ForegroundColor Yellow
Write-Host "winget install GitHub.cli" -ForegroundColor White

Write-Host "`n✨ Once GitHub CLI is installed, you can use:" -ForegroundColor Green
foreach ($project in $projects) {
    Write-Host "gh repo create ritesh-chauhan0x1/$($project.Name) --public --source=. --remote=origin --push" -ForegroundColor White
}

# Create a batch file for easy execution
$batchContent = @"
@echo off
echo Creating GitHub repositories...

"@

foreach ($project in $projects) {
    $batchContent += @"
echo.
echo Creating $($project.Name)...
cd /d "projects\$($project.Name)"
gh repo create ritesh-chauhan0x1/$($project.Name) --public --description "$($project.Desc)" --source=. --remote=origin --push
cd /d "..\..\"

"@
}

$batchContent += @"
echo.
echo All repositories created successfully!
pause
"@

$batchContent | Out-File -FilePath "create-github-repos.bat" -Encoding ASCII

Write-Host "`n📁 Created 'create-github-repos.bat' for automated execution" -ForegroundColor Green
Write-Host "   Run this file after installing GitHub CLI" -ForegroundColor White
