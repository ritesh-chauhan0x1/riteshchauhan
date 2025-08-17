# Simple script to add MIT License to GitHub repositories
# Author: Ritesh Chauhan

$GitHubUsername = "ritesh-chauhan0x1"
$LicenseFile = "c:\Users\rites\Desktop\MIT_LICENSE.txt"
$WorkDir = "c:\Users\rites\Desktop\temp-repos"

Write-Host "Adding MIT License to all repositories..." -ForegroundColor Green

if (-not (Test-Path $LicenseFile)) {
    Write-Host "License file not found!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $WorkDir)) {
    New-Item -ItemType Directory -Path $WorkDir -Force | Out-Null
}

# Get repositories from GitHub API
$uri = "https://api.github.com/users/$GitHubUsername/repos?per_page=100"
$repos = Invoke-RestMethod -Uri $uri -Method Get

Write-Host "Found $($repos.Count) repositories" -ForegroundColor Green

Set-Location $WorkDir

$success = 0
$skipped = 0
$failed = 0

foreach ($repo in $repos) {
    $name = $repo.name
    $url = $repo.clone_url
    $path = Join-Path $WorkDir $name
    
    Write-Host "Processing: $name" -ForegroundColor Cyan
    
    try {
        if (Test-Path $path) {
            Set-Location $path
            git pull origin main 2>$null
        } else {
            git clone $url $path 2>$null
            Set-Location $path
        }
        
        if (Test-Path "LICENSE*") {
            Write-Host "  Already has license, skipping" -ForegroundColor Yellow
            $skipped++
            continue
        }
        
        Copy-Item $LicenseFile "LICENSE" -Force
        git add LICENSE
        git commit -m "Add MIT License"
        git push origin HEAD 2>$null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Successfully added license" -ForegroundColor Green
            $success++
        } else {
            Write-Host "  Failed to push" -ForegroundColor Red
            $failed++
        }
    } catch {
        Write-Host "  Error occurred" -ForegroundColor Red
        $failed++
    }
}

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "Success: $success" -ForegroundColor Green
Write-Host "Skipped: $skipped" -ForegroundColor Yellow
Write-Host "Failed: $failed" -ForegroundColor Red
