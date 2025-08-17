# Update LinkedIn URL in all project README files
# New LinkedIn URL: https://www.linkedin.com/in/ritesh-chauhan-79818a374/

$projects = @(
    "Blog-Platform", "Chat-App", "E-commerce-Platform", "Expense-Tracker", 
    "Fitness-Tracker", "Food-Delivery", "Instagram-Mobile", "Music-Player-Mobile", 
    "News-Reader", "Photo-Editor", "Portfolio-Website", "Quiz-Platform", 
    "Recipe-Finder", "Social-Media-Mobile", "Spotify-Clone", "Task-Manager", 
    "Task-Manager-Mobile", "Weather-App-Mobile", "Weather-Dashboard", "WhatsApp-Mobile"
)

$oldLinkedInURL = "https://linkedin.com/in/ritesh-chauhan"
$newLinkedInURL = "https://www.linkedin.com/in/ritesh-chauhan-79818a374/"

Write-Host "Updating LinkedIn URLs in all project README files..." -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor White
Write-Host ""

Set-Location "C:\desktop-projects"

$updated = 0
$failed = 0

foreach ($project in $projects) {
    Write-Host "Processing: $project" -ForegroundColor Yellow
    
    $readmePath = "$project\README.md"
    
    if (Test-Path $readmePath) {
        try {
            # Read the content
            $content = Get-Content $readmePath -Raw
            
            # Replace the LinkedIn URL
            $updatedContent = $content -replace [regex]::Escape($oldLinkedInURL), $newLinkedInURL
            
            # Write back to file
            Set-Content $readmePath -Value $updatedContent -NoNewline
            
            Write-Host "  ✅ README.md updated successfully" -ForegroundColor Green
            $updated++
            
            # Git add and commit the change
            Set-Location $project
            git add README.md
            git commit -m "Update LinkedIn profile URL"
            git push origin main
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ Changes pushed to GitHub" -ForegroundColor Green
            } else {
                Write-Host "  ⚠️  Push failed - check authentication" -ForegroundColor Yellow
            }
            
            Set-Location ".."
        }
        catch {
            Write-Host "  ❌ Failed to update: $($_.Exception.Message)" -ForegroundColor Red
            $failed++
        }
    } else {
        Write-Host "  ⚠️  README.md not found" -ForegroundColor Yellow
        $failed++
    }
    
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor White
Write-Host "UPDATE SUMMARY" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor White
Write-Host ""
Write-Host "Successfully updated: $updated projects" -ForegroundColor Green
Write-Host "Failed updates: $failed projects" -ForegroundColor Red
Write-Host ""
Write-Host "New LinkedIn URL: $newLinkedInURL" -ForegroundColor Blue
Write-Host ""
Write-Host "All projects updated and pushed to GitHub!" -ForegroundColor Green
