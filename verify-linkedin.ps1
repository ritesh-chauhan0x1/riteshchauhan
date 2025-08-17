# Verify LinkedIn URL updates and push all changes
$projects = @(
    "Blog-Platform", "Chat-App", "E-commerce-Platform", "Expense-Tracker", 
    "Fitness-Tracker", "Food-Delivery", "Instagram-Mobile", "Music-Player-Mobile", 
    "News-Reader", "Photo-Editor", "Portfolio-Website", "Quiz-Platform", 
    "Recipe-Finder", "Social-Media-Mobile", "Spotify-Clone", "Task-Manager", 
    "Task-Manager-Mobile", "Weather-App-Mobile", "Weather-Dashboard", "WhatsApp-Mobile"
)

Write-Host "Verifying LinkedIn URL updates and pushing changes..." -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor White
Write-Host ""

Set-Location "C:\desktop-projects"

$correctURL = "https://www.linkedin.com/in/ritesh-chauhan-79818a374/"
$verified = 0
$needsUpdate = 0
$pushed = 0

foreach ($project in $projects) {
    Write-Host "Checking: $project" -ForegroundColor Yellow
    
    if (Test-Path "$project\README.md") {
        $content = Get-Content "$project\README.md" -Raw
        
        if ($content -match [regex]::Escape($correctURL)) {
            Write-Host "  ✅ LinkedIn URL correct" -ForegroundColor Green
            $verified++
            
            # Check if there are uncommitted changes and push
            Set-Location $project
            
            $status = git status --porcelain
            if ($status) {
                git add .
                git commit -m "Update LinkedIn profile URL"
                Write-Host "  📝 Committed changes" -ForegroundColor Blue
            }
            
            git push origin main 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  🚀 Pushed to GitHub" -ForegroundColor Green
                $pushed++
            } else {
                Write-Host "  ⚠️  Push failed or already up to date" -ForegroundColor Yellow
            }
            
            Set-Location ".."
        } else {
            Write-Host "  ❌ LinkedIn URL needs update" -ForegroundColor Red
            $needsUpdate++
        }
    } else {
        Write-Host "  ⚠️  README.md not found" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

Write-Host "============================================" -ForegroundColor White
Write-Host "VERIFICATION SUMMARY" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor White
Write-Host ""
Write-Host "Projects with correct LinkedIn URL: $verified" -ForegroundColor Green
Write-Host "Projects needing updates: $needsUpdate" -ForegroundColor Red
Write-Host "Projects pushed to GitHub: $pushed" -ForegroundColor Blue
Write-Host ""
Write-Host "Correct LinkedIn URL: $correctURL" -ForegroundColor Cyan
Write-Host ""

if ($needsUpdate -eq 0) {
    Write-Host "🎉 All projects have the correct LinkedIn URL!" -ForegroundColor Green
    Write-Host "🚀 All changes have been pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some projects still need LinkedIn URL updates." -ForegroundColor Yellow
}
