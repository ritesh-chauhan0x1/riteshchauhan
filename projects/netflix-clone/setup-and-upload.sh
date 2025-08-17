#!/bin/bash

# Netflix Clone Project Setup and GitHub Upload Script
# This script creates the complete project structure and uploads to GitHub

PROJECT_NAME="netflix-clone"
GITHUB_USERNAME="ritesh-chauhan0x1"
PROJECT_DIR="projects/$PROJECT_NAME"

echo "🚀 Setting up Netflix Clone project..."

# Navigate to project directory
cd "$PROJECT_DIR"

# Initialize git repository
echo "📁 Initializing Git repository..."
git init

# Create .gitignore file
cat > .gitignore << EOL
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

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Firebase
.firebase/
firebase-debug.log

# Miscellaneous
.eslintcache
.cache/
EOL

# Create .env.example file
cat > .env.example << EOL
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# TMDB API Configuration
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
EOL

# Create deployment scripts
mkdir -p scripts

cat > scripts/deploy.sh << EOL
#!/bin/bash
echo "🚀 Building and deploying Netflix Clone..."

# Build the project
npm run build

# Deploy to Vercel (if vercel CLI is installed)
if command -v vercel &> /dev/null; then
    echo "📦 Deploying to Vercel..."
    vercel --prod
else
    echo "⚠️ Vercel CLI not found. Please install it: npm i -g vercel"
fi

# Deploy to Netlify (if netlify CLI is installed)
if command -v netlify &> /dev/null; then
    echo "📦 Deploying to Netlify..."
    netlify deploy --prod --dir=build
else
    echo "⚠️ Netlify CLI not found. Please install it: npm i -g netlify-cli"
fi

echo "✅ Deployment script completed!"
EOL

chmod +x scripts/deploy.sh

# Create development setup script
cat > scripts/setup.sh << EOL
#!/bin/bash
echo "🔧 Setting up Netflix Clone development environment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment example
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file. Please add your API keys."
else
    echo "⚠️ .env file already exists."
fi

echo "✅ Setup completed! Please configure your .env file with API keys."
echo "🚀 Run 'npm start' to start the development server."
EOL

chmod +x scripts/setup.sh

# Create LICENSE file
cat > LICENSE << EOL
MIT License

Copyright (c) 2025 Ritesh Chauhan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOL

# Stage all files
echo "📋 Staging files for commit..."
git add .

# Initial commit
echo "💾 Creating initial commit..."
git commit -m "🎬 Initial commit: Netflix Clone with React and Firebase

✨ Features:
- User authentication with Firebase
- Movie browsing with TMDB API
- Responsive design
- Video streaming
- Watchlist functionality
- Search and recommendations

🛠️ Tech Stack:
- React 18
- Firebase (Auth, Firestore, Storage)
- TMDB API
- React Router
- CSS3 with modern features

🚀 Ready for deployment to Vercel/Netlify"

# Create GitHub repository and push
echo "🌐 Creating GitHub repository..."

# Check if GitHub CLI is installed
if command -v gh &> /dev/null; then
    echo "📡 Creating GitHub repository using GitHub CLI..."
    gh repo create $GITHUB_USERNAME/$PROJECT_NAME --public --source=. --remote=origin --push
    
    echo "✅ Repository created and pushed to GitHub!"
    echo "🔗 Repository URL: https://github.com/$GITHUB_USERNAME/$PROJECT_NAME"
else
    echo "⚠️ GitHub CLI not found. Creating remote manually..."
    git remote add origin https://github.com/$GITHUB_USERNAME/$PROJECT_NAME.git
    
    echo "📤 Please create the repository on GitHub first, then run:"
    echo "git push -u origin main"
fi

echo ""
echo "🎉 Netflix Clone project setup completed!"
echo ""
echo "📁 Project location: $(pwd)"
echo "🔗 GitHub: https://github.com/$GITHUB_USERNAME/$PROJECT_NAME"
echo ""
echo "🚀 Next steps:"
echo "1. Configure your .env file with API keys"
echo "2. Run 'npm install' to install dependencies"
echo "3. Run 'npm start' to start development server"
echo "4. Deploy using 'npm run build' and host on Vercel/Netlify"
echo ""
echo "📚 Documentation: Check README.md for detailed setup instructions"
EOL
