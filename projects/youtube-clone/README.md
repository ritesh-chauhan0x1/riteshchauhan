# YouTube Clone

A complete YouTube replica featuring video uploads, real-time comments, likes, subscriptions, and advanced search functionality built with React and Node.js.

## 🚀 Features

### 🎬 Video Management
- **Video Upload** - Upload videos with metadata and thumbnails
- **Video Streaming** - Smooth video playback with quality options
- **Video Processing** - Automatic thumbnail generation and compression
- **Progress Tracking** - Resume watching from where you left off

### 👥 User Interaction
- **User Channels** - Create and customize personal channels
- **Subscriptions** - Subscribe to channels and get notifications
- **Real-time Comments** - Live comment system with replies
- **Likes & Dislikes** - Engagement tracking and analytics
- **Playlists** - Create and manage video playlists

### 🔍 Discovery
- **Advanced Search** - Search videos, channels, and playlists
- **Recommendations** - AI-powered content suggestions
- **Trending** - Discover what's popular right now
- **Categories** - Browse by genre and topic
- **Related Videos** - Find similar content

### 📱 Modern Features
- **Responsive Design** - Perfect on all devices
- **Dark/Light Theme** - Toggle between themes
- **Offline Support** - PWA capabilities
- **Real-time Notifications** - Stay updated with subscriptions
- **Analytics Dashboard** - Channel performance insights

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern React with hooks and context
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **React Player** - Video playback component
- **Socket.io Client** - Real-time features

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database for storing data
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time communication
- **Multer** - File upload handling
- **JWT** - Authentication tokens

### Additional Services
- **Cloudinary** - Video and image hosting
- **FFmpeg** - Video processing
- **Nodemailer** - Email notifications
- **Bull Queue** - Background job processing

## 📱 Screenshots

![YouTube Clone Home](./screenshots/home.png)
![YouTube Clone Video Player](./screenshots/player.png)
![YouTube Clone Channel](./screenshots/channel.png)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for video hosting)
- FFmpeg (for video processing)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/ritesh-chauhan0x1/youtube-clone.git
cd youtube-clone
```

2. **Install dependencies**:
```bash
# Install client dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

3. **Environment Setup**:
```bash
# Copy environment files
cp .env.example .env
cp server/.env.example server/.env
```

4. **Configure environment variables**:

**Client (.env)**:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

**Server (server/.env)**:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/youtube-clone
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# YouTube API (Optional for importing data)
YOUTUBE_API_KEY=your_youtube_api_key
```

5. **Start the application**:
```bash
# Development mode (both client and server)
npm run dev

# Or start separately
npm run server  # Backend on http://localhost:5000
npm start       # Frontend on http://localhost:3000
```

## 📂 Project Structure

```
youtube-clone/
├── public/                 # Static files
├── src/                   # Frontend source code
│   ├── components/        # Reusable components
│   │   ├── Header/       # Navigation header
│   │   ├── Sidebar/      # Navigation sidebar
│   │   ├── VideoCard/    # Video preview cards
│   │   ├── VideoPlayer/  # Video player component
│   │   ├── Comments/     # Comment system
│   │   └── ...
│   ├── pages/            # Main pages
│   │   ├── Home/         # Homepage with trending
│   │   ├── Watch/        # Video watch page
│   │   ├── Channel/      # Channel pages
│   │   ├── Search/       # Search results
│   │   ├── Upload/       # Video upload
│   │   └── ...
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   ├── styles/           # Global styles
│   ├── App.js            # Main app component
│   └── index.js          # Entry point
├── server/               # Backend source code
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic
│   ├── utils/            # Server utilities
│   ├── uploads/          # Temporary file storage
│   └── index.js          # Server entry point
├── package.json          # Project dependencies
└── README.md            # Project documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get specific video
- `POST /api/videos` - Upload new video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video
- `POST /api/videos/:id/like` - Like/unlike video
- `GET /api/videos/:id/comments` - Get video comments
- `POST /api/videos/:id/comments` - Add comment

### Channels
- `GET /api/channels/:id` - Get channel info
- `POST /api/channels/:id/subscribe` - Subscribe/unsubscribe
- `GET /api/channels/:id/videos` - Get channel videos
- `PUT /api/channels/:id` - Update channel

### Search
- `GET /api/search` - Search videos and channels
- `GET /api/trending` - Get trending videos
- `GET /api/recommendations` - Get recommended videos

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. **Build the project**:
```bash
npm run build
```

2. **Deploy to Vercel**:
```bash
npm i -g vercel
vercel --prod
```

3. **Deploy to Netlify**:
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=build
```

### Backend (Heroku/Railway)

1. **Prepare for deployment**:
```bash
cd server
```

2. **Deploy to Heroku**:
```bash
heroku create youtube-clone-api
heroku config:set NODE_ENV=production
git subtree push --prefix server heroku main
```

3. **Deploy to Railway**:
```bash
railway login
railway init
railway up
```

### Database (MongoDB Atlas)

1. Create a MongoDB Atlas cluster
2. Add connection string to environment variables
3. Whitelist deployment server IPs

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Ritesh Chauhan**
- GitHub: [@ritesh-chauhan0x1](https://github.com/ritesh-chauhan0x1)
- LinkedIn: [ritesh-chauhan](https://linkedin.com/in/ritesh-chauhan)
- Email: ritesh.chauhan.dev@gmail.com

## 🙏 Acknowledgments

- [YouTube](https://youtube.com) for the design inspiration
- [React](https://reactjs.org/) for the amazing framework
- [Node.js](https://nodejs.org/) for the server runtime
- [MongoDB](https://mongodb.com/) for the database
- [Cloudinary](https://cloudinary.com/) for media hosting

## 📊 Project Stats

- ⭐ Features: 20+ core features
- 📱 Pages: 15+ unique pages
- 🔧 API Endpoints: 25+ RESTful endpoints
- 📝 Components: 30+ reusable components
- 🎨 Responsive: Mobile, tablet, desktop
- ⚡ Real-time: Socket.io integration

---

⚡ **Live Demo**: [YouTube Clone Live](https://youtube-clone-ritesh.vercel.app)
🔗 **API Demo**: [API Documentation](https://youtube-clone-api.herokuapp.com/api-docs)
