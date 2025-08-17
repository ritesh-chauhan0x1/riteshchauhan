# Manual Individual Repository Setup Script
# This script prepares each project for individual GitHub repository upload

$projects = @(
    "Netflix-Clone", "YouTube-Clone", "Instagram-Clone", "WhatsApp-Clone", 
    "Discord-Clone", "Spotify-Clone", "E-commerce-Platform", "Task-Manager",
    "Blog-Platform", "Chat-App", "Weather-Dashboard", "Recipe-Finder",
    "Quiz-Platform", "Portfolio-Website", "WhatsApp-Mobile", "Instagram-Mobile",
    "Task-Manager-Mobile", "Weather-App-Mobile", "Music-Player-Mobile", 
    "Fitness-Tracker", "Food-Delivery", "Social-Media-Mobile", "News-Reader",
    "Photo-Editor", "Expense-Tracker"
)

$username = "ritesh-chauhan0x1"
$baseDir = "C:\desktop-projects"

Write-Host "🔧 Setting up individual repositories for each project" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor White
Write-Host ""

# Change to projects directory
Set-Location $baseDir

foreach ($project in $projects) {
    Write-Host "📁 Setting up: $project" -ForegroundColor Yellow
    
    if (Test-Path $project) {
        Set-Location $project
        
        # Check if git is initialized
        if (!(Test-Path ".git")) {
            Write-Host "   📋 Initializing Git..." -ForegroundColor Blue
            git init | Out-Null
            git add . | Out-Null
            git commit -m "Initial commit: $project professional application" | Out-Null
        }
        
        # Remove any existing remote
        git remote remove origin 2>$null | Out-Null
        
        # Add new remote for individual repository
        $repoUrl = "https://github.com/$username/$project.git"
        git remote add origin $repoUrl | Out-Null
        
        Write-Host "   ✅ Remote set to: $repoUrl" -ForegroundColor Green
        
        Set-Location ..
    } else {
        Write-Host "   ❌ Project directory not found: $project" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🌐 Now create GitHub repositories manually:" -ForegroundColor Magenta
Write-Host ""

# Generate repository creation instructions
foreach ($project in $projects) {
    Write-Host "🔗 Repository: $project" -ForegroundColor Cyan
    Write-Host "   URL to create: https://github.com/new" -ForegroundColor Gray
    Write-Host "   Name: $project" -ForegroundColor White
    Write-Host "   Visibility: Public" -ForegroundColor White
    Write-Host ""
}

Write-Host "📤 After creating ALL repositories, run these commands:" -ForegroundColor Yellow
Write-Host ""

foreach ($project in $projects) {
    Write-Host "# Upload $project" -ForegroundColor Cyan
    Write-Host "cd `"$baseDir\$project`"" -ForegroundColor White
    Write-Host "git push -u origin main" -ForegroundColor White
    Write-Host ""
}

Write-Host "🎯 Quick upload script:" -ForegroundColor Magenta
Write-Host ""

# Create upload commands file
$uploadScript = @"
# Quick upload all projects to individual repositories
Set-Location '$baseDir'

"@

foreach ($project in $projects) {
    $uploadScript += @"
Write-Host "Uploading $project..." -ForegroundColor Cyan
Set-Location '$project'
git push -u origin main
if (`$LASTEXITCODE -eq 0) {
    Write-Host "✅ $project uploaded successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to upload $project" -ForegroundColor Red
}
Set-Location '..'

"@
}

$uploadScript += @"
Write-Host ""
Write-Host "🎉 Upload process completed!" -ForegroundColor Green
Write-Host "🔗 Check your repositories: https://github.com/$username?tab=repositories" -ForegroundColor Blue
"@

$uploadScript | Out-File -FilePath "upload-all-individual.ps1" -Encoding UTF8

Write-Host "💾 Created 'upload-all-individual.ps1' for easy uploading" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Your GitHub Profile: https://github.com/$username" -ForegroundColor Blue
