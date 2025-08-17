# Simple Upload Script for Individual Repositories
# Run this AFTER creating all GitHub repositories

$projects = @(
    "Blog-Platform", "Chat-App", "E-commerce-Platform", "Expense-Tracker", 
    "Fitness-Tracker", "Food-Delivery", "Instagram-Mobile", "Music-Player-Mobile", 
    "News-Reader", "Photo-Editor", "Portfolio-Website", "Quiz-Platform", 
    "Recipe-Finder", "Social-Media-Mobile", "Spotify-Clone", "Task-Manager", 
    "Task-Manager-Mobile", "Weather-App-Mobile", "Weather-Dashboard", "WhatsApp-Mobile"
)

Write-Host "Individual Repository Upload Script" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor White
Write-Host ""

Write-Host "IMPORTANT: Make sure you've created ALL GitHub repositories first!" -ForegroundColor Yellow
Write-Host "Create repositories at: https://github.com/new" -ForegroundColor Cyan
Write-Host ""

$continue = Read-Host "Have you created all GitHub repositories? (y/n)"
if ($continue -ne "y") {
    Write-Host "Please create repositories first, then run this script again." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Uploading projects to individual repositories..." -ForegroundColor Magenta
Write-Host ""

Set-Location "C:\desktop-projects"

$successful = 0
$failed = 0

foreach ($project in $projects) {
    Write-Host "Uploading: $project" -ForegroundColor Cyan
    
    if (Test-Path $project) {
        Set-Location $project
        
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   SUCCESS: $project uploaded!" -ForegroundColor Green
            $successful++
        } else {
            Write-Host "   FAILED: $project upload failed" -ForegroundColor Red
            Write-Host "   Make sure repository exists: https://github.com/ritesh-chauhan0x1/$project" -ForegroundColor Yellow
            $failed++
        }
        
        Set-Location ".."
    } else {
        Write-Host "   WARNING: Project directory not found: $project" -ForegroundColor Yellow
        $failed++
    }
    
    Write-Host ""
}

Write-Host "=================================================" -ForegroundColor White
Write-Host "UPLOAD SUMMARY" -ForegroundColor Magenta
Write-Host "=================================================" -ForegroundColor White
Write-Host ""
Write-Host "Successful uploads: $successful" -ForegroundColor Green
Write-Host "Failed uploads: $failed" -ForegroundColor Red
Write-Host ""
Write-Host "Your GitHub Profile: https://github.com/ritesh-chauhan0x1" -ForegroundColor Blue
Write-Host "Repositories: https://github.com/ritesh-chauhan0x1?tab=repositories" -ForegroundColor Blue
Write-Host ""

if ($successful -gt 0) {
    Write-Host "Upload process completed! Check your GitHub profile." -ForegroundColor Green
} else {
    Write-Host "Make sure to create GitHub repositories first at https://github.com/new" -ForegroundColor Yellow
}
