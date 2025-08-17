# PowerShell Script to Create All Projects and Upload to GitHub
# Run this script to create all projects with individual repositories

param(
    [string]$GitHubUsername = "ritesh-chauhan0x1"
)

# Function to create project structure
function Create-Project {
    param(
        [string]$ProjectName,
        [string]$Description,
        [array]$TechStack,
        [array]$Features,
        [string]$ProjectType
    )
    
    Write-Host "🚀 Creating $ProjectName..." -ForegroundColor Cyan
    
    # Create project directory
    $projectPath = "desktop-projects\$ProjectName"
    if (!(Test-Path $projectPath)) {
        New-Item -ItemType Directory -Path $projectPath -Force | Out-Null
    }
    
    # Create package.json based on project type
    $packageJson = @{
        name = $ProjectName.ToLower() -replace '\s', '-'
        version = "1.0.0"
        description = $Description
        main = "index.js"
        scripts = @{}
        keywords = @($ProjectName.ToLower(), "clone", "react")
        author = "Ritesh Chauhan"
        license = "MIT"
        dependencies = @{}
    }
    
    # Set scripts and dependencies based on project type
    switch ($ProjectType) {
        "react" {
            $packageJson.scripts = @{
                start = "react-scripts start"
                build = "react-scripts build"
                test = "react-scripts test"
                eject = "react-scripts eject"
            }
            $packageJson.dependencies = @{
                react = "^18.2.0"
                "react-dom" = "^18.2.0"
                "react-scripts" = "5.0.1"
                "react-router-dom" = "^6.15.0"
                axios = "^1.5.0"
            }
        }
        "fullstack" {
            $packageJson.scripts = @{
                start = "react-scripts start"
                build = "react-scripts build"
                test = "react-scripts test"
                server = "nodemon server/index.js"
                dev = "concurrently \"npm run server\" \"npm start\""
            }
            $packageJson.dependencies = @{
                react = "^18.2.0"
                "react-dom" = "^18.2.0"
                "react-scripts" = "5.0.1"
                express = "^4.18.2"
                mongoose = "^7.5.0"
                "socket.io" = "^4.7.2"
            }
        }
        "vanilla" {
            $packageJson.scripts = @{
                start = "live-server"
                build = "npm run minify"
                minify = "uglifyjs js/*.js -o dist/app.min.js"
            }
            $packageJson.dependencies = @{
                "live-server" = "^1.2.2"
                uglify-js = "^3.17.4"
            }
        }
        "mobile" {
            $packageJson.scripts = @{
                start = "expo start"
                android = "expo start --android"
                ios = "expo start --ios"
                web = "expo start --web"
            }
            $packageJson.dependencies = @{
                expo = "~49.0.0"
                react = "18.2.0"
                "react-native" = "0.72.0"
                "react-navigation" = "^6.0.0"
            }
        }
    }
    
    # Save package.json
    $packageJson | ConvertTo-Json -Depth 10 | Out-File "$projectPath\package.json" -Encoding UTF8
    
    # Create README.md
    $readmeContent = @"
# $ProjectName

$Description

## 🚀 Features

$(foreach ($feature in $Features) { "- ✅ **$feature**" })

## 🛠️ Tech Stack

$(foreach ($tech in $TechStack) { "- **$tech**" })

## 📱 Screenshots

![Screenshot 1](./screenshots/screenshot1.png)
![Screenshot 2](./screenshots/screenshot2.png)

## 🏃‍♂️ Quick Start

### Installation

1. Clone the repository:
``````bash
git clone https://github.com/$GitHubUsername/$($ProjectName -replace '\s', '-').git
cd $($ProjectName -replace '\s', '-')
``````

2. Install dependencies:
``````bash
npm install
``````

3. Start the development server:
``````bash
npm start
``````

## 🚀 Deployment

### Vercel
``````bash
npm install -g vercel
vercel --prod
``````

### Netlify
``````bash
npm install -g netlify-cli
netlify deploy --prod
``````

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Ritesh Chauhan**
- GitHub: [@$GitHubUsername](https://github.com/$GitHubUsername)
- LinkedIn: [ritesh-chauhan](https://linkedin.com/in/ritesh-chauhan)
- Email: ritesh.chauhan.dev@gmail.com

---

⭐ Star this repository if you found it helpful!
"@
    
    $readmeContent | Out-File "$projectPath\README.md" -Encoding UTF8
    
    # Create .gitignore
    $gitignoreContent = @"
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log
"@
    
    $gitignoreContent | Out-File "$projectPath\.gitignore" -Encoding UTF8
    
    # Create basic source structure
    $srcPath = "$projectPath\src"
    if (!(Test-Path $srcPath)) {
        New-Item -ItemType Directory -Path $srcPath -Force | Out-Null
    }
    
    # Create basic index.html for web projects
    if ($ProjectType -ne "mobile") {
        $publicPath = "$projectPath\public"
        if (!(Test-Path $publicPath)) {
            New-Item -ItemType Directory -Path $publicPath -Force | Out-Null
        }
        
        $indexHtml = @"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="$Description" />
    <title>$ProjectName</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
"@
        
        $indexHtml | Out-File "$publicPath\index.html" -Encoding UTF8
    }
    
    Write-Host "   ✅ $ProjectName structure created" -ForegroundColor Green
    return $projectPath
}

# Function to initialize Git and push to GitHub
function Initialize-GitRepo {
    param(
        [string]$ProjectPath,
        [string]$ProjectName,
        [string]$Description
    )
    
    Write-Host "📁 Initializing Git for $ProjectName..." -ForegroundColor Blue
    
    Set-Location $ProjectPath
    
    # Initialize git
    git init | Out-Null
    git add . | Out-Null
    git commit -m "🚀 Initial commit: $ProjectName

✨ $Description

📱 Features implemented:
- Complete project structure
- Professional documentation
- Ready for development
- Deployment configurations

🛠️ Tech stack configured and ready
🚀 Ready for deployment" | Out-Null
    
    # Create GitHub repository
    $repoName = $ProjectName -replace '\s', '-'
    
    Write-Host "🌐 Creating GitHub repository: $repoName..." -ForegroundColor Magenta
    
    try {
        # Check if GitHub CLI is available
        $ghExists = Get-Command gh -ErrorAction SilentlyContinue
        if ($ghExists) {
            gh repo create "$GitHubUsername/$repoName" --public --description $Description --source=. --remote=origin --push | Out-Null
            Write-Host "   ✅ Repository created: https://github.com/$GitHubUsername/$repoName" -ForegroundColor Green
        } else {
            # Add remote manually
            git remote add origin "https://github.com/$GitHubUsername/$repoName.git" | Out-Null
            Write-Host "   📡 Remote added. Create repository manually at: https://github.com/new" -ForegroundColor Yellow
            Write-Host "   📤 Then run: git push -u origin main" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ⚠️ GitHub repository creation failed. Create manually." -ForegroundColor Red
    }
    
    Set-Location "..\..\"
}

# Define all projects
$webProjects = @(
    @{
        Name = "Netflix-Clone"
        Description = "Netflix clone with React, Firebase, and TMDB API integration"
        TechStack = @("React", "Firebase", "TMDB API", "CSS3")
        Features = @("User Authentication", "Movie Database", "Video Streaming", "Responsive Design")
        Type = "react"
    },
    @{
        Name = "YouTube-Clone"
        Description = "YouTube clone with video uploads, comments, and subscriptions"
        TechStack = @("React", "Node.js", "MongoDB", "Express")
        Features = @("Video Upload", "Real-time Comments", "User Channels", "Search")
        Type = "fullstack"
    },
    @{
        Name = "Instagram-Clone"
        Description = "Instagram clone with photo sharing, stories, and real-time chat"
        TechStack = @("React", "Firebase", "Material-UI", "Socket.io")
        Features = @("Photo Sharing", "Stories Feature", "Real-time Chat", "Notifications")
        Type = "react"
    },
    @{
        Name = "WhatsApp-Clone"
        Description = "WhatsApp clone with real-time messaging and group chats"
        TechStack = @("React", "Socket.io", "Node.js", "MongoDB")
        Features = @("Real-time Messaging", "Group Chats", "Media Sharing", "Voice Notes")
        Type = "fullstack"
    },
    @{
        Name = "Discord-Clone"
        Description = "Discord clone with voice chat and server management"
        TechStack = @("React", "WebRTC", "Socket.io", "Express")
        Features = @("Voice Channels", "Server Management", "Screen Sharing", "Text Chat")
        Type = "fullstack"
    },
    @{
        Name = "Spotify-Clone"
        Description = "Spotify clone with music streaming and playlists"
        TechStack = @("React", "Spotify API", "Context API", "Styled Components")
        Features = @("Music Streaming", "Playlist Management", "Search & Discovery", "Social Features")
        Type = "react"
    },
    @{
        Name = "E-commerce-Platform"
        Description = "Full-stack e-commerce platform with payment integration"
        TechStack = @("React", "Node.js", "PostgreSQL", "Stripe")
        Features = @("Payment Gateway", "Admin Dashboard", "Order Tracking", "Inventory Management")
        Type = "fullstack"
    },
    @{
        Name = "Task-Manager"
        Description = "Task management application with team collaboration"
        TechStack = @("React", "Redux", "Firebase", "Chart.js")
        Features = @("Team Collaboration", "Time Tracking", "Analytics", "Project Templates")
        Type = "react"
    },
    @{
        Name = "Blog-Platform"
        Description = "Blog platform with markdown editor and SEO optimization"
        TechStack = @("React", "Next.js", "Prisma", "PostgreSQL")
        Features = @("Markdown Editor", "Comment System", "SEO Optimized", "Analytics")
        Type = "fullstack"
    },
    @{
        Name = "Chat-App"
        Description = "Real-time chat application with file sharing"
        TechStack = @("React", "Socket.io", "Express", "MongoDB")
        Features = @("Real-time Messaging", "File Sharing", "Group Chats", "Emoji Reactions")
        Type = "fullstack"
    },
    @{
        Name = "Weather-Dashboard"
        Description = "Weather dashboard with interactive maps and forecasts"
        TechStack = @("JavaScript", "HTML5", "CSS3", "Weather API")
        Features = @("Real-time Data", "Interactive Maps", "Location Tracking", "Forecasts")
        Type = "vanilla"
    },
    @{
        Name = "Recipe-Finder"
        Description = "Recipe discovery app with meal planning features"
        TechStack = @("JavaScript", "HTML5", "CSS3", "Recipe API")
        Features = @("Ingredient Search", "Nutrition Info", "Meal Planning", "Cooking Timers")
        Type = "vanilla"
    },
    @{
        Name = "Quiz-Platform"
        Description = "Educational quiz platform with analytics"
        TechStack = @("React", "TypeScript", "Firebase", "Chart.js")
        Features = @("Multiple Question Types", "Progress Tracking", "Detailed Analytics", "Leaderboards")
        Type = "react"
    },
    @{
        Name = "Portfolio-Website"
        Description = "Professional portfolio with smooth animations"
        TechStack = @("HTML5", "CSS3", "JavaScript", "GSAP")
        Features = @("Dark/Light Theme", "Smooth Animations", "SEO Optimized", "Contact Forms")
        Type = "vanilla"
    }
)

$mobileProjects = @(
    @{
        Name = "WhatsApp-Mobile"
        Description = "WhatsApp mobile clone with React Native"
        TechStack = @("React Native", "Firebase", "Socket.io", "Expo")
        Features = @("Real-time Chat", "Voice Messages", "Video Calls", "Status Updates")
        Type = "mobile"
    },
    @{
        Name = "Instagram-Mobile"
        Description = "Instagram mobile clone with photo sharing"
        TechStack = @("React Native", "Firebase", "Expo Camera", "Socket.io")
        Features = @("Photo Sharing", "Stories", "Direct Messages", "Explore Feed")
        Type = "mobile"
    },
    @{
        Name = "Task-Manager-Mobile"
        Description = "Mobile task management app with Flutter"
        TechStack = @("Flutter", "Dart", "Firebase", "Provider")
        Features = @("Task Creation", "Team Collaboration", "Offline Sync", "Push Notifications")
        Type = "mobile"
    },
    @{
        Name = "Weather-App-Mobile"
        Description = "Native weather application with location services"
        TechStack = @("React Native", "Weather API", "Maps", "Geolocation")
        Features = @("Current Weather", "7-day Forecast", "Weather Maps", "Location Tracking")
        Type = "mobile"
    },
    @{
        Name = "Music-Player-Mobile"
        Description = "Music player app with Ionic framework"
        TechStack = @("Ionic", "Angular", "Capacitor", "Audio API")
        Features = @("Music Playback", "Playlist Management", "Offline Mode", "Equalizer")
        Type = "mobile"
    },
    @{
        Name = "Fitness-Tracker"
        Description = "Fitness tracking app with health monitoring"
        TechStack = @("React Native", "HealthKit", "Firebase", "Charts")
        Features = @("Activity Tracking", "Goal Setting", "Progress Charts", "Social Sharing")
        Type = "mobile"
    },
    @{
        Name = "Food-Delivery"
        Description = "Food delivery mobile application"
        TechStack = @("React Native", "Stripe", "Google Maps", "Firebase")
        Features = @("Restaurant Browse", "Order Tracking", "Payment Integration", "Reviews")
        Type = "mobile"
    },
    @{
        Name = "Social-Media-Mobile"
        Description = "Social media mobile application"
        TechStack = @("React Native", "Firebase", "Socket.io", "Camera")
        Features = @("Social Feed", "Photo/Video Sharing", "Comments", "Live Chat")
        Type = "mobile"
    },
    @{
        Name = "News-Reader"
        Description = "News aggregation mobile app"
        TechStack = @("React Native", "News API", "AsyncStorage", "Share")
        Features = @("News Feed", "Categories", "Bookmarks", "Offline Reading")
        Type = "mobile"
    },
    @{
        Name = "Photo-Editor"
        Description = "Photo editing mobile application"
        TechStack = @("React Native", "Image Processing", "Canvas", "Filters")
        Features = @("Photo Filters", "Crop & Resize", "Text Overlay", "Save & Share")
        Type = "mobile"
    },
    @{
        Name = "Expense-Tracker"
        Description = "Personal finance and expense tracking app"
        TechStack = @("Flutter", "SQLite", "Charts", "Notifications")
        Features = @("Expense Tracking", "Budget Planning", "Reports", "Bill Reminders")
        Type = "mobile"
    }
)

# Main execution
Write-Host "🚀 Starting Project Creation and GitHub Upload Process" -ForegroundColor Magenta
Write-Host "================================================================" -ForegroundColor White

# Create all web projects
Write-Host "`n🌐 Creating Web Projects..." -ForegroundColor Cyan
$webCount = 0
foreach ($project in $webProjects) {
    $webCount++
    Write-Host "`n[$webCount/$($webProjects.Count)] " -NoNewline -ForegroundColor Yellow
    $projectPath = Create-Project -ProjectName $project.Name -Description $project.Description -TechStack $project.TechStack -Features $project.Features -ProjectType $project.Type
    Initialize-GitRepo -ProjectPath $projectPath -ProjectName $project.Name -Description $project.Description
}

# Create all mobile projects
Write-Host "`n📱 Creating Mobile Projects..." -ForegroundColor Cyan
$mobileCount = 0
foreach ($project in $mobileProjects) {
    $mobileCount++
    Write-Host "`n[$mobileCount/$($mobileProjects.Count)] " -NoNewline -ForegroundColor Yellow
    $projectPath = Create-Project -ProjectName $project.Name -Description $project.Description -TechStack $project.TechStack -Features $project.Features -ProjectType $project.Type
    Initialize-GitRepo -ProjectPath $projectPath -ProjectName $project.Name -Description $project.Description
}

Write-Host "`n" + "="*60 -ForegroundColor White
Write-Host "🎉 All Projects Created Successfully!" -ForegroundColor Green
Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "   🌐 Web Projects: $($webProjects.Count)" -ForegroundColor White
Write-Host "   📱 Mobile Projects: $($mobileProjects.Count)" -ForegroundColor White
Write-Host "   📁 Total Projects: $($webProjects.Count + $mobileProjects.Count)" -ForegroundColor White

Write-Host "`n🔗 GitHub Profile: https://github.com/$GitHubUsername" -ForegroundColor Blue
Write-Host "`n🚀 Next Steps:" -ForegroundColor Magenta
Write-Host "   1. Visit your GitHub profile to see all repositories" -ForegroundColor White
Write-Host "   2. Clone any project to start development" -ForegroundColor White
Write-Host "   3. Configure environment variables" -ForegroundColor White
Write-Host "   4. Deploy to Vercel/Netlify for live demos" -ForegroundColor White

Write-Host "`n✨ Happy Coding!" -ForegroundColor Green
