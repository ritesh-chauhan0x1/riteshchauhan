# Simple GitHub Repository Creation Script
$ErrorActionPreference = "Continue"

Write-Host "🚀 Creating GitHub Repositories for All Projects" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor White

# Project definitions
$projects = @(
    @{name="netflix-clone"; desc="Netflix Clone - React & Firebase streaming app"},
    @{name="youtube-clone"; desc="YouTube Clone - Video sharing platform"},
    @{name="instagram-clone"; desc="Instagram Clone - Social media app"},
    @{name="whatsapp-clone"; desc="WhatsApp Clone - Real-time messaging"},
    @{name="discord-clone"; desc="Discord Clone - Gaming communication"},
    @{name="spotify-clone"; desc="Spotify Clone - Music streaming"},
    @{name="ecommerce-platform"; desc="E-commerce Platform - Shopping solution"},
    @{name="task-manager"; desc="Task Manager - Team collaboration"},
    @{name="blog-platform"; desc="Blog Platform - Content management"},
    @{name="chat-app"; desc="Chat App - Real-time messaging"},
    @{name="weather-dashboard"; desc="Weather Dashboard - Weather application"},
    @{name="recipe-finder"; desc="Recipe Finder - Culinary discovery"},
    @{name="quiz-platform"; desc="Quiz Platform - Educational tool"},
    @{name="portfolio-website"; desc="Portfolio Website - Professional showcase"}
)

$username = "ritesh-chauhan0x1"
$count = 0

foreach ($project in $projects) {
    $count++
    Write-Host "`n[$count/$($projects.Count)] Processing: $($project.name)" -ForegroundColor Yellow
    
    $projectPath = "projects\$($project.name)"
    
    # Check if project exists
    if (Test-Path $projectPath) {
        Set-Location $projectPath
        
        # Initialize git if needed
        if (!(Test-Path ".git")) {
            Write-Host "   📁 Initializing Git..." -ForegroundColor Blue
            git init | Out-Null
            git add . | Out-Null
            git commit -m "Initial commit for $($project.name)" | Out-Null
        }
        
        # Add remote if not exists
        $remoteUrl = "https://github.com/$username/$($project.name).git"
        $currentRemote = git remote get-url origin 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "   🔗 Adding remote origin..." -ForegroundColor Blue
            git remote add origin $remoteUrl | Out-Null
        }
        
        Write-Host "   ✅ Ready for GitHub: https://github.com/$username/$($project.name)" -ForegroundColor Green
        
        Set-Location "..\..\"
    } else {
        Write-Host "   ⚠️ Project directory not found: $projectPath" -ForegroundColor Red
        Write-Host "   💡 Create the project first, then run this script" -ForegroundColor Yellow
    }
}

Write-Host "`n🎉 Project setup completed!" -ForegroundColor Green
Write-Host "`n📋 Manual GitHub Repository Creation:" -ForegroundColor Cyan
Write-Host "1. Go to https://github.com/new" -ForegroundColor White
Write-Host "2. Create repository with project name" -ForegroundColor White
Write-Host "3. Make it public" -ForegroundColor White
Write-Host "4. Don't initialize with README" -ForegroundColor White
Write-Host "5. Copy the repository URL" -ForegroundColor White

Write-Host "`n🚀 After creating GitHub repositories:" -ForegroundColor Magenta
foreach ($project in $projects) {
    Write-Host "cd projects\$($project.name) && git push -u origin main" -ForegroundColor White
}

Write-Host "`n🔗 GitHub Profile: https://github.com/$username" -ForegroundColor Blue
