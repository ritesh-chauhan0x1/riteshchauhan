# Individual GitHub Repository Creator and Uploader
# This script creates separate repositories for each project and uploads them

param(
    [string]$GitHubUsername = "ritesh-chauhan0x1"
)

# Project definitions with descriptions
$projects = @(
    @{name="Netflix-Clone"; desc="Netflix streaming platform clone with React and Firebase"; type="web"},
    @{name="YouTube-Clone"; desc="Video sharing platform with uploads, comments, and subscriptions"; type="web"},
    @{name="Instagram-Clone"; desc="Social media app with stories, posts, and real-time chat"; type="web"},
    @{name="WhatsApp-Clone"; desc="Real-time messaging application with group chats"; type="web"},
    @{name="Discord-Clone"; desc="Gaming communication platform with voice channels"; type="web"},
    @{name="Spotify-Clone"; desc="Music streaming app with playlists and recommendations"; type="web"},
    @{name="E-commerce-Platform"; desc="Full-stack shopping solution with payment integration"; type="web"},
    @{name="Task-Manager"; desc="Team collaboration and productivity application"; type="web"},
    @{name="Blog-Platform"; desc="Content management system with markdown editor"; type="web"},
    @{name="Chat-App"; desc="Real-time messaging with file sharing capabilities"; type="web"},
    @{name="Weather-Dashboard"; desc="Beautiful weather application with interactive maps"; type="web"},
    @{name="Recipe-Finder"; desc="Culinary discovery app with meal planning features"; type="web"},
    @{name="Quiz-Platform"; desc="Educational tool with analytics and progress tracking"; type="web"},
    @{name="Portfolio-Website"; desc="Professional portfolio with smooth animations"; type="web"},
    @{name="WhatsApp-Mobile"; desc="React Native messaging app for mobile devices"; type="mobile"},
    @{name="Instagram-Mobile"; desc="Cross-platform social media mobile application"; type="mobile"},
    @{name="Task-Manager-Mobile"; desc="Flutter productivity app for task management"; type="mobile"},
    @{name="Weather-App-Mobile"; desc="Native weather application for mobile platforms"; type="mobile"},
    @{name="Music-Player-Mobile"; desc="Ionic audio streaming app for mobile"; type="mobile"},
    @{name="Fitness-Tracker"; desc="Health monitoring application with activity tracking"; type="mobile"},
    @{name="Food-Delivery"; desc="E-commerce mobile app for food ordering"; type="mobile"},
    @{name="Social-Media-Mobile"; desc="Community platform for mobile devices"; type="mobile"},
    @{name="News-Reader"; desc="Content aggregation app with offline reading"; type="mobile"},
    @{name="Photo-Editor"; desc="Image manipulation tool with filters and effects"; type="mobile"},
    @{name="Expense-Tracker"; desc="Financial management app for expense tracking"; type="mobile"}
)

function Write-ColorMessage {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Test-GitHubCLI {
    try {
        $null = gh --version
        return $true
    } catch {
        return $false
    }
}

function Create-IndividualRepository {
    param(
        [hashtable]$Project,
        [string]$Username
    )
    
    $projectPath = "C:\desktop-projects\$($Project.name)"
    
    Write-ColorMessage "`n🚀 Processing: $($Project.name)" "Cyan"
    Write-ColorMessage "   📝 Description: $($Project.desc)" "Gray"
    
    # Check if project directory exists
    if (!(Test-Path $projectPath)) {
        Write-ColorMessage "   ❌ Project directory not found: $projectPath" "Red"
        return $false
    }
    
    # Navigate to project directory
    Set-Location $projectPath
    
    # Initialize git if not already done
    if (!(Test-Path ".git")) {
        Write-ColorMessage "   📁 Initializing Git repository..." "Yellow"
        git init | Out-Null
        git add . | Out-Null
        git commit -m "🚀 Initial commit: $($Project.name)

✨ $($Project.desc)

🛠️ Tech Stack: $($Project.type) application
📱 Features: Complete source code with documentation
🔗 Ready for deployment" | Out-Null
    }
    
    # Check if GitHub CLI is available
    if (Test-GitHubCLI) {
        Write-ColorMessage "   🌐 Creating GitHub repository with GitHub CLI..." "Blue"
        
        try {
            # Create repository using GitHub CLI
            $result = gh repo create "$Username/$($Project.name)" --public --description "$($Project.desc)" --source=. --remote=origin --push 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-ColorMessage "   ✅ Repository created and uploaded: https://github.com/$Username/$($Project.name)" "Green"
                return $true
            } else {
                Write-ColorMessage "   ⚠️ Repository might already exist or there was an issue: $result" "Yellow"
                
                # Try to add remote and push manually
                $remoteExists = git remote get-url origin 2>$null
                if ($LASTEXITCODE -ne 0) {
                    git remote add origin "https://github.com/$Username/$($Project.name).git" | Out-Null
                }
                
                git branch -M main | Out-Null
                git push -u origin main 2>$null
                
                if ($LASTEXITCODE -eq 0) {
                    Write-ColorMessage "   ✅ Code pushed to existing repository" "Green"
                    return $true
                } else {
                    Write-ColorMessage "   ❌ Failed to push code" "Red"
                    return $false
                }
            }
        } catch {
            Write-ColorMessage "   ❌ Error: $($_.Exception.Message)" "Red"
            return $false
        }
    } else {
        Write-ColorMessage "   ⚠️ GitHub CLI not available. Setting up for manual creation..." "Yellow"
        
        # Add remote if it doesn't exist
        $remoteExists = git remote get-url origin 2>$null
        if ($LASTEXITCODE -ne 0) {
            git remote add origin "https://github.com/$Username/$($Project.name).git" | Out-Null
            Write-ColorMessage "   🔗 Remote added: https://github.com/$Username/$($Project.name).git" "Blue"
        }
        
        Write-ColorMessage "   📋 Manual steps required:" "Cyan"
        Write-ColorMessage "      1. Create repository at: https://github.com/new" "White"
        Write-ColorMessage "      2. Repository name: $($Project.name)" "White"
        Write-ColorMessage "      3. Description: $($Project.desc)" "White"
        Write-ColorMessage "      4. Make it PUBLIC" "White"
        Write-ColorMessage "      5. Run: git push -u origin main" "White"
        
        return $false
    }
}

# Main execution
Write-ColorMessage "🎯 Individual GitHub Repository Creator" "Magenta"
Write-ColorMessage "=======================================" "White"
Write-ColorMessage ""

Write-ColorMessage "👤 GitHub Username: $GitHubUsername" "Cyan"
Write-ColorMessage "📁 Projects Location: C:\desktop-projects\" "Cyan"
Write-ColorMessage ""

# Check if GitHub CLI is available
if (Test-GitHubCLI) {
    Write-ColorMessage "✅ GitHub CLI detected - Automatic repository creation enabled" "Green"
    
    # Check authentication
    try {
        gh auth status | Out-Null
        Write-ColorMessage "✅ GitHub authentication confirmed" "Green"
    } catch {
        Write-ColorMessage "🔐 GitHub authentication required..." "Yellow"
        gh auth login
    }
} else {
    Write-ColorMessage "⚠️ GitHub CLI not found - Manual repository creation required" "Yellow"
    Write-ColorMessage "💡 Install GitHub CLI: winget install GitHub.cli" "Cyan"
}

Write-ColorMessage ""
Write-ColorMessage "🚀 Processing $($projects.Count) projects..." "Magenta"

$successful = 0
$failed = 0
$failedProjects = @()

foreach ($project in $projects) {
    $result = Create-IndividualRepository -Project $project -Username $GitHubUsername
    
    if ($result) {
        $successful++
    } else {
        $failed++
        $failedProjects += $project.name
    }
    
    # Return to base directory
    Set-Location "C:\Users\rites\Desktop\Dockerfile\riteshchauhan"
}

# Summary
Write-ColorMessage ""
Write-ColorMessage "=" * 50 "White"
Write-ColorMessage "📊 UPLOAD SUMMARY" "Magenta"
Write-ColorMessage "=" * 50 "White"
Write-ColorMessage ""
Write-ColorMessage "✅ Successful uploads: $successful" "Green"
Write-ColorMessage "❌ Failed uploads: $failed" "Red"
Write-ColorMessage ""

if ($failedProjects.Count -gt 0) {
    Write-ColorMessage "⚠️ Projects requiring manual setup:" "Yellow"
    foreach ($project in $failedProjects) {
        Write-ColorMessage "   • $project" "White"
    }
    Write-ColorMessage ""
    Write-ColorMessage "📋 For manual projects:" "Cyan"
    Write-ColorMessage "   1. Go to https://github.com/new" "White"
    Write-ColorMessage "   2. Create repository with project name" "White"
    Write-ColorMessage "   3. Navigate to project folder" "White"
    Write-ColorMessage "   4. Run: git push -u origin main" "White"
}

Write-ColorMessage ""
Write-ColorMessage "🔗 Your GitHub Profile: https://github.com/$GitHubUsername" "Blue"
Write-ColorMessage "📊 Repositories: https://github.com/$GitHubUsername?tab=repositories" "Blue"
Write-ColorMessage ""
Write-ColorMessage "🎉 Repository creation process completed!" "Green"
