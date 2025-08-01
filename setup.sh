#!/bin/bash

# Portfolio Backend Setup Script
echo "🚀 Setting up Ritesh's Portfolio Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    echo "Download from: https://dev.mysql.com/downloads/"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚙️ Environment file not found. Please configure .env file."
    echo "Copy .env.example to .env and update the values."
    exit 1
fi

# Setup database
echo "🗄️ Setting up database..."
node database/setup.js

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed successfully!"
else
    echo "❌ Database setup failed. Please check your MySQL configuration."
    exit 1
fi

# Create uploads directory
echo "📁 Creating uploads directories..."
mkdir -p uploads/photos
mkdir -p uploads/projects
mkdir -p uploads/memories/childhood
mkdir -p uploads/memories/hostel
mkdir -p uploads/memories/school

echo "🎉 Backend setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Update .env file with your MySQL credentials"
echo "2. Run 'npm start' to start the server"
echo "3. Server will be available at http://localhost:3000"
echo ""
echo "🔧 Available commands:"
echo "- npm start      : Start production server"
echo "- npm run dev    : Start development server with auto-reload"
echo "- npm run setup-db : Re-run database setup"
