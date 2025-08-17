# 🎬 Netflix Clone - Full Stack Streaming Platform

A feature-rich Netflix clone built with React.js frontend and Python Flask backend, offering a complete streaming platform experience with movie browsing, user authentication, personalized recommendations, and real-time features.

![Netflix Clone](https://img.shields.io/badge/Netflix-Clone-E50914?style=for-the-badge&logo=netflix&logoColor=white)
![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Python](https://img.shields.io/badge/Python-Flask-3776AB?style=for-the-badge&logo=python&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

## 🌟 Live Demo

🔗 **[View Live Demo](https://netflix-clone-ritesh.vercel.app)**

## � Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## ✨ Features

### 🎯 Core Features
- **🔐 User Authentication** - JWT-based secure login/register system
- **🎬 Movie & TV Show Catalog** - Comprehensive content library with detailed information
- **🔍 Advanced Search** - Search movies and shows by title, genre, cast, or director
- **⭐ Rating System** - User ratings and reviews with IMDb integration
- **📱 Responsive Design** - Seamless experience across all devices
- **🌙 Dark Theme** - Netflix-inspired dark UI design

### 🚀 Advanced Features
- **🤖 AI Recommendations** - Personalized content suggestions based on viewing history
- **📺 Multiple Profiles** - Family-friendly profile management
- **💾 My List** - Personal watchlist functionality
- **📊 Watch History** - Track viewing progress and resume watching
- **🎭 Genre Categories** - Browse content by categories and moods
- **🔴 Real-time Updates** - Live notifications for new content

### 🎥 Video Features
- **▶️ Video Player** - Custom HTML5 video player with controls
- **🎬 Trailers** - Movie and TV show trailers with autoplay
- **📈 Progress Tracking** - Resume watching from where you left off
- **🔊 Audio Controls** - Volume control and mute functionality
- **⚡ Fast Loading** - Optimized video streaming and buffering

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - Modern React with Hooks and Context API
- **React Router v6** - Client-side routing and navigation
- **CSS3 & SCSS** - Styled components with animations
- **Axios** - HTTP client for API requests
- **React Query** - Data fetching and caching
- **Framer Motion** - Smooth animations and transitions

### Backend
- **Python 3.11** - Modern Python with type hints
- **Flask 2.3** - Lightweight web framework
- **SQLite** - Embedded database for development
- **SQLAlchemy** - Database ORM and migrations
- **JWT** - JSON Web Tokens for authentication
- **WebSocket** - Real-time communication
- **Bcrypt** - Password hashing and security

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality checks
- **Prettier** - Code formatting
- **Postman** - API testing and documentation

## 📱 Screenshots

### Homepage
![Netflix Homepage](./screenshots/homepage.png)

### Movie Details
![Movie Details](./screenshots/movie-details.png)

### Search Results
![Search Results](./screenshots/search.png)

### User Profile
![User Profile](./screenshots/profile.png)

## 🚀 Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.11 or higher)
- **Git**

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/ritesh-chauhan0x1/Netflix-Clone.git

# Navigate to project directory
cd Netflix-Clone

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv netflix_env

# Activate virtual environment
# Windows:
netflix_env\Scripts\activate
# macOS/Linux:
source netflix_env/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Initialize database
python app.py
```

### Environment Variables

Create `.env` file in the root directory:

```env
# Frontend
VITE_API_BASE_URL=http://localhost:5003
VITE_TMDB_API_KEY=your_tmdb_api_key

# Backend
SECRET_KEY=your_secret_key_here
DATABASE_URL=sqlite:///netflix.db
JWT_SECRET_KEY=your_jwt_secret
FLASK_ENV=development
```

### Running the Application

```bash
# Start backend server (Terminal 1)
cd backend
python app.py

# Start frontend server (Terminal 2)
npm run dev
```

Application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5003

## 📋 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/profile` | Get user profile |

### Content Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/content/movies` | Get movies list |
| GET | `/api/content/shows` | Get TV shows list |
| GET | `/api/content/movie/:id` | Get movie details |
| GET | `/api/content/show/:id` | Get TV show details |
| GET | `/api/content/search` | Search content |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/watchlist` | Get user watchlist |
| POST | `/api/user/watchlist` | Add to watchlist |
| DELETE | `/api/user/watchlist/:id` | Remove from watchlist |
| GET | `/api/user/recommendations` | Get recommendations |

### Example API Request

```javascript
// Get movies
const response = await fetch('/api/content/movies?genre=action&page=1');
const movies = await response.json();

// Add to watchlist
await fetch('/api/user/watchlist', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    content_type: 'movie',
    content_id: 123
  })
});
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    subscription_plan TEXT DEFAULT 'basic',
    profile_image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Movies Table
```sql
CREATE TABLE movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    genre TEXT,
    release_year INTEGER,
    duration INTEGER,
    rating TEXT,
    thumbnail TEXT,
    video_url TEXT,
    imdb_rating REAL,
    featured BOOLEAN DEFAULT FALSE
);
```

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd backend
python -m pytest

# Run E2E tests
npm run test:e2e
```

## � Build & Deployment

### Frontend Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
npm run build && netlify deploy --prod --dir=dist
```

### Backend Deployment

```bash
# Install production dependencies
pip install -r requirements.txt

# Set environment variables
export FLASK_ENV=production

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5003 app:app
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Style

- Follow **ESLint** and **Prettier** configurations
- Use **conventional commits** for commit messages
- Add **tests** for new features
- Update **documentation** as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Netflix** - Design inspiration
- **TMDB API** - Movie and TV show data
- **React Team** - Amazing frontend framework
- **Flask Team** - Excellent Python web framework

## 👤 Author

**Ritesh Chauhan**
- 🌐 **Portfolio**: [riteshchauhan.dev](https://riteshchauhan.dev)
- 💼 **LinkedIn**: [ritesh-chauhan-79818a374](https://www.linkedin.com/in/ritesh-chauhan-79818a374/)
- 🐱 **GitHub**: [@ritesh-chauhan0x1](https://github.com/ritesh-chauhan0x1)
- 📧 **Email**: riteshchauhan0x1@gmail.com

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/ritesh-chauhan0x1/Netflix-Clone?style=social)
![GitHub forks](https://img.shields.io/github/forks/ritesh-chauhan0x1/Netflix-Clone?style=social)
![GitHub issues](https://img.shields.io/github/issues/ritesh-chauhan0x1/Netflix-Clone)
![GitHub license](https://img.shields.io/github/license/ritesh-chauhan0x1/Netflix-Clone)

---

⭐ **Star this repository if you found it helpful!**

💡 **Found a bug or have a suggestion?** [Open an issue](https://github.com/ritesh-chauhan0x1/Netflix-Clone/issues)

🚀 **Want to contribute?** Check out our [contributing guidelines](CONTRIBUTING.md)
