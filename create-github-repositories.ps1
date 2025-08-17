# GitHub Repository Creator
# This script will help you create all 25 repositories systematically

$projects = @(
    @{name="Netflix-Clone"; desc="Netflix streaming platform clone with React and Firebase"},
    @{name="YouTube-Clone"; desc="Video sharing platform with uploads, comments, and subscriptions"},
    @{name="Instagram-Clone"; desc="Social media app with stories, posts, and real-time chat"},
    @{name="WhatsApp-Clone"; desc="Real-time messaging application with group chats"},
    @{name="Discord-Clone"; desc="Gaming communication platform with voice channels"},
    @{name="Spotify-Clone"; desc="Music streaming app with playlists and recommendations"},
    @{name="E-commerce-Platform"; desc="Full-stack shopping solution with payment integration"},
    @{name="Task-Manager"; desc="Team collaboration and productivity application"},
    @{name="Blog-Platform"; desc="Content management system with markdown editor"},
    @{name="Chat-App"; desc="Real-time messaging with file sharing capabilities"},
    @{name="Weather-Dashboard"; desc="Beautiful weather application with interactive maps"},
    @{name="Recipe-Finder"; desc="Culinary discovery app with meal planning features"},
    @{name="Quiz-Platform"; desc="Educational tool with analytics and progress tracking"},
    @{name="Portfolio-Website"; desc="Professional portfolio with smooth animations"},
    @{name="WhatsApp-Mobile"; desc="React Native messaging app for mobile devices"},
    @{name="Instagram-Mobile"; desc="Cross-platform social media mobile application"},
    @{name="Task-Manager-Mobile"; desc="Flutter productivity app for task management"},
    @{name="Weather-App-Mobile"; desc="Native weather application for mobile platforms"},
    @{name="Music-Player-Mobile"; desc="Ionic audio streaming app for mobile"},
    @{name="Fitness-Tracker"; desc="Health monitoring application with activity tracking"},
    @{name="Food-Delivery"; desc="E-commerce mobile app for food ordering"},
    @{name="Social-Media-Mobile"; desc="Community platform for mobile devices"},
    @{name="News-Reader"; desc="Content aggregation app with offline reading"},
    @{name="Photo-Editor"; desc="Image manipulation tool with filters and effects"},
    @{name="Expense-Tracker"; desc="Financial management app for expense tracking"}
)

Write-Host "🚀 GitHub Repository Creator" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor White
Write-Host ""

Write-Host "📋 Creating 25 repositories for your portfolio:" -ForegroundColor Yellow
Write-Host ""

$count = 0
foreach ($project in $projects) {
    $count++
    Write-Host "[$count/25] $($project.name)" -ForegroundColor Green
}

Write-Host ""
Write-Host "🌐 Let's create these repositories step by step..." -ForegroundColor Cyan
Write-Host ""

foreach ($project in $projects) {
    Write-Host "🔗 Creating: $($project.name)" -ForegroundColor Blue
    Write-Host "   Description: $($project.desc)" -ForegroundColor Gray
    
    # Open GitHub new repository page
    $url = "https://github.com/new"
    Write-Host "   Opening GitHub..." -ForegroundColor Yellow
    Start-Process $url
    
    Write-Host ""
    Write-Host "   📝 Instructions for this repository:" -ForegroundColor Cyan
    Write-Host "   1. Repository name: $($project.name)" -ForegroundColor White
    Write-Host "   2. Description: $($project.desc)" -ForegroundColor White
    Write-Host "   3. Make it PUBLIC ✅" -ForegroundColor White
    Write-Host "   4. DON'T add README (we have our own) ❌" -ForegroundColor White
    Write-Host "   5. DON'T add .gitignore (we have our own) ❌" -ForegroundColor White
    Write-Host "   6. Click 'Create repository' 🚀" -ForegroundColor White
    Write-Host ""
    
    # Wait for user confirmation
    Read-Host "   Press Enter when you've created '$($project.name)' repository"
    Write-Host "   ✅ Repository '$($project.name)' created!" -ForegroundColor Green
    Write-Host "   " + "="*50 -ForegroundColor DarkGray
    Write-Host ""
}

Write-Host "🎉 All repositories created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Next step: Upload your projects" -ForegroundColor Magenta
Write-Host "   Run: .\upload-all-projects.bat" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Your GitHub profile: https://github.com/ritesh-chauhan0x1" -ForegroundColor Blue
Write-Host ""
Write-Host "✨ Happy coding!" -ForegroundColor Yellow
