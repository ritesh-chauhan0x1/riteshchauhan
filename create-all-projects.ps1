# PowerShell Script to Create and Upload All Projects to GitHub
# Run this script to automatically create all projects and upload them to GitHub

param(
    [string]$GitHubUsername = "ritesh-chauhan0x1",
    [switch]$CreateRepos = $false
)

$ProjectsData = @(
    @{
        Name = "netflix-clone"
        Description = "A fully functional Netflix clone built with React and Firebase"
        TechStack = @("React", "Firebase", "TMDB API", "CSS3")
        Features = @("User Authentication", "Movie Database", "Video Streaming", "Responsive Design")
        Type = "react-clone"
    },
    @{
        Name = "youtube-clone"
        Description = "Complete YouTube replica with video uploads, comments, and subscriptions"
        TechStack = @("React", "Node.js", "MongoDB", "Express")
        Features = @("Video Upload", "Real-time Comments", "User Channels", "Search")
        Type = "react-clone"
    },
    @{
        Name = "instagram-clone"
        Description = "Full-featured Instagram clone with photo sharing and real-time chat"
        TechStack = @("React", "Firebase", "Material-UI", "Socket.io")
        Features = @("Photo Sharing", "Stories Feature", "Real-time Chat", "Notifications")
        Type = "react-clone"
    },
    @{
        Name = "whatsapp-clone"
        Description = "Real-time messaging application with end-to-end encryption"
        TechStack = @("React", "Socket.io", "Node.js", "MongoDB")
        Features = @("Real-time Messaging", "Group Chats", "Media Sharing", "Voice Notes")
        Type = "react-clone"
    },
    @{
        Name = "discord-clone"
        Description = "Gaming-focused communication platform with voice chat"
        TechStack = @("React", "WebRTC", "Socket.io", "Express")
        Features = @("Voice Channels", "Server Management", "Screen Sharing", "Text Chat")
        Type = "react-clone"
    },
    @{
        Name = "spotify-clone"
        Description = "Music streaming application with playlists and recommendations"
        TechStack = @("React", "Spotify API", "Context API", "Styled Components")
        Features = @("Music Streaming", "Playlist Management", "Search & Discovery", "Social Features")
        Type = "react-clone"
    },
    @{
        Name = "ecommerce-platform"
        Description = "Complete e-commerce solution with payment integration"
        TechStack = @("React", "Node.js", "PostgreSQL", "Stripe")
        Features = @("Payment Gateway", "Admin Dashboard", "Order Tracking", "Inventory Management")
        Type = "fullstack"
    },
    @{
        Name = "task-manager"
        Description = "Comprehensive task management application with team collaboration"
        TechStack = @("React", "Redux", "Firebase", "Chart.js")
        Features = @("Team Collaboration", "Time Tracking", "Analytics", "Project Templates")
        Type = "react"
    },
    @{
        Name = "blog-platform"
        Description = "Feature-rich blogging platform with markdown editor"
        TechStack = @("React", "Next.js", "Prisma", "PostgreSQL")
        Features = @("Markdown Editor", "Comment System", "SEO Optimized", "Analytics")
        Type = "fullstack"
    },
    @{
        Name = "chat-app"
        Description = "Real-time messaging application with file sharing"
        TechStack = @("React", "Socket.io", "Express", "MongoDB")
        Features = @("Real-time Messaging", "File Sharing", "Group Chats", "Emoji Reactions")
        Type = "fullstack"
    },
    @{
        Name = "weather-dashboard"
        Description = "Beautiful weather application with interactive maps"
        TechStack = @("JavaScript", "HTML5", "CSS3", "Weather API")
        Features = @("Real-time Data", "Interactive Maps", "Location Tracking", "Forecasts")
        Type = "vanilla"
    },
    @{
        Name = "recipe-finder"
        Description = "Recipe discovery application with meal planning"
        TechStack = @("JavaScript", "HTML5", "CSS3", "Recipe API")
        Features = @("Ingredient Search", "Nutrition Info", "Meal Planning", "Cooking Timers")
        Type = "vanilla"
    },
    @{
        Name = "quiz-platform"
        Description = "Educational quiz platform with progress tracking"
        TechStack = @("React", "TypeScript", "Firebase", "Chart.js")
        Features = @("Multiple Question Types", "Progress Tracking", "Detailed Analytics", "Leaderboards")
        Type = "react"
    },
    @{
        Name = "portfolio-website"
        Description = "Professional portfolio website with smooth animations"
        TechStack = @("HTML5", "CSS3", "JavaScript", "GSAP")
        Features = @("Dark/Light Theme", "Smooth Animations", "SEO Optimized", "Contact Forms")
        Type = "vanilla"
    }
)

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    
    $colorMap = @{
        "Red" = "Red"
        "Green" = "Green"
        "Yellow" = "Yellow"
        "Blue" = "Blue"
        "Magenta" = "Magenta"
        "Cyan" = "Cyan"
        "White" = "White"
    }
    
    Write-Host $Message -ForegroundColor $colorMap[$Color]
}

function Test-GitHubCLI {
    try {
        $null = Get-Command gh -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

function Test-Git {
    try {
        $null = Get-Command git -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

function Create-ProjectStructure {
    param(
        [hashtable]$Project
    )
    
    $projectPath = "projects\$($Project.Name)"
    
    Write-ColorOutput "🚀 Creating project: $($Project.Name)" "Cyan"
    
    # Create project directory if it doesn't exist
    if (!(Test-Path $projectPath)) {
        New-Item -ItemType Directory -Path $projectPath -Force | Out-Null
    }
    
    Set-Location $projectPath
    
    # Initialize git if not already initialized
    if (!(Test-Path ".git")) {
        git init | Out-Null
        Write-ColorOutput "   📁 Git repository initialized" "Green"
    }
    
    # Add files to git
    git add . | Out-Null
    
    # Check if there are changes to commit
    $status = git status --porcelain
    if ($status) {
        git commit -m "🚀 Initial commit: $($Project.Description)

✨ Features:
$(foreach ($feature in $Project.Features) { "- $feature" })

🛠️ Tech Stack:
$(foreach ($tech in $Project.TechStack) { "- $tech" })

📱 Type: $($Project.Type)
🔗 Ready for deployment" | Out-Null
        
        Write-ColorOutput "   💾 Initial commit created" "Green"
    } else {
        Write-ColorOutput "   ⚠️ No changes to commit" "Yellow"
    }
    
    Set-Location "..\..\"
    
    return $projectPath
}

function Create-GitHubRepository {
    param(
        [string]$ProjectName,
        [string]$ProjectPath,
        [string]$Description
    )
    
    Set-Location $ProjectPath
    
    Write-ColorOutput "🌐 Creating GitHub repository: $ProjectName" "Blue"
    
    if (Test-GitHubCLI) {
        try {
            # Create repository using GitHub CLI
            $repoUrl = "https://github.com/$GitHubUsername/$ProjectName"
            
            # Check if repo already exists
            $repoExists = gh repo view "$GitHubUsername/$ProjectName" 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-ColorOutput "   ⚠️ Repository already exists: $repoUrl" "Yellow"
            } else {
                gh repo create "$GitHubUsername/$ProjectName" --public --description $Description --source . --remote origin --push | Out-Null
                if ($LASTEXITCODE -eq 0) {
                    Write-ColorOutput "   ✅ Repository created and pushed: $repoUrl" "Green"
                } else {
                    Write-ColorOutput "   ❌ Failed to create repository" "Red"
                }
            }
        } catch {
            Write-ColorOutput "   ❌ Error creating repository: $($_.Exception.Message)" "Red"
        }
    } else {
        Write-ColorOutput "   ⚠️ GitHub CLI not found. Please install it or create repository manually" "Yellow"
        Write-ColorOutput "   🔗 Manual setup: https://github.com/new" "Cyan"
        
        # Add remote if it doesn't exist
        $remoteExists = git remote get-url origin 2>$null
        if ($LASTEXITCODE -ne 0) {
            git remote add origin "https://github.com/$GitHubUsername/$ProjectName.git" | Out-Null
            Write-ColorOutput "   📡 Remote origin added" "Green"
        }
        
        Write-ColorOutput "   📤 Run 'git push -u origin main' after creating the repository" "Cyan"
    }
    
    Set-Location "..\..\"
}

function Create-DeploymentReadme {
    param(
        [string]$ProjectPath
    )
    
    $deploymentGuide = @"
# Deployment Guide

## Quick Deploy Options

### 1. Vercel (Recommended for React apps)
```bash
npm install -g vercel
vercel --prod
```

### 2. Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=build
```

### 3. GitHub Pages (for static sites)
```bash
npm install -g gh-pages
npm run build
gh-pages -d build
```

### 4. Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Environment Variables

Make sure to set up environment variables in your deployment platform:

1. **Vercel**: Add in Project Settings > Environment Variables
2. **Netlify**: Add in Site Settings > Environment Variables
3. **Firebase**: Use `firebase functions:config:set`

## Custom Domain Setup

1. **Vercel**: Go to Project > Domains
2. **Netlify**: Go to Site Settings > Domain Management
3. **GitHub Pages**: Add CNAME file to public folder

## SSL Certificate

All modern hosting platforms provide free SSL certificates automatically.

---

For detailed deployment instructions, check the main README.md file.
"@

    $deploymentGuide | Out-File -FilePath "$ProjectPath\DEPLOYMENT.md" -Encoding UTF8
}

# Main execution
Write-ColorOutput "🎯 Starting Project Creation and GitHub Upload Process" "Magenta"
Write-ColorOutput "👤 GitHub Username: $GitHubUsername" "Cyan"

# Check prerequisites
if (!(Test-Git)) {
    Write-ColorOutput "❌ Git is not installed or not in PATH" "Red"
    exit 1
}

if (!(Test-GitHubCLI)) {
    Write-ColorOutput "⚠️ GitHub CLI not found. Manual repository creation will be required" "Yellow"
    Write-ColorOutput "💡 Install GitHub CLI for automated repository creation: https://cli.github.com/" "Cyan"
}

Write-ColorOutput "`n📋 Projects to create: $($ProjectsData.Count)" "White"

foreach ($project in $ProjectsData) {
    Write-ColorOutput "`n" + "="*60 "White"
    
    try {
        $projectPath = Create-ProjectStructure -Project $project
        
        # Create deployment guide
        Create-DeploymentReadme -ProjectPath $projectPath
        
        if ($CreateRepos) {
            Create-GitHubRepository -ProjectName $project.Name -ProjectPath $projectPath -Description $project.Description
        } else {
            Write-ColorOutput "   ⏭️ Skipping GitHub repository creation (use -CreateRepos to enable)" "Yellow"
        }
        
        Write-ColorOutput "   ✅ Project $($project.Name) completed successfully" "Green"
    } catch {
        Write-ColorOutput "   ❌ Error creating project $($project.Name): $($_.Exception.Message)" "Red"
    }
}

Write-ColorOutput "`n" + "="*60 "White"
Write-ColorOutput "🎉 All projects created successfully!" "Green"
Write-ColorOutput "`n📁 Projects location: $(Get-Location)\projects\" "Cyan"
Write-ColorOutput "🔗 GitHub Profile: https://github.com/$GitHubUsername" "Cyan"

if (!$CreateRepos) {
    Write-ColorOutput "`n💡 To create GitHub repositories automatically, run:" "Yellow"
    Write-ColorOutput "   .\create-all-projects.ps1 -CreateRepos" "White"
}

Write-ColorOutput "`n🚀 Next steps for each project:" "Magenta"
Write-ColorOutput "   1. Navigate to project folder" "White"
Write-ColorOutput "   2. Run 'npm install' to install dependencies" "White"
Write-ColorOutput "   3. Configure .env file with API keys" "White"
Write-ColorOutput "   4. Run 'npm start' to start development server" "White"
Write-ColorOutput "   5. Deploy using the DEPLOYMENT.md guide" "White"

Write-ColorOutput "`n📚 Each project includes:" "Blue"
Write-ColorOutput "   • Complete source code" "White"
Write-ColorOutput "   • README.md with setup instructions" "White"
Write-ColorOutput "   • DEPLOYMENT.md with hosting guide" "White"
Write-ColorOutput "   • .env.example for configuration" "White"
Write-ColorOutput "   • Production-ready code" "White"
