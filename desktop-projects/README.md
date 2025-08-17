# Social Media Clone Applications

This repository contains three comprehensive social media clone applications built with modern React and Flask technologies.

## 🚀 Projects Overview

### 1. Discord Clone
**Port: 5007** | A complete gaming communication platform with voice channels and server management

**Features:**
- Real-time messaging with Socket.IO
- Voice channels with WebRTC integration
- Server management and channel creation
- User authentication and profiles
- Role-based permissions
- Emoji reactions and file sharing
- Direct messaging system

**Tech Stack:**
- Frontend: React 18, Socket.IO Client, Lucide React Icons
- Backend: Python Flask, SQLite, Socket.IO, JWT Authentication
- Real-time: WebSocket connections for instant messaging

### 2. WhatsApp Clone
**Port: 5008** | A real-time messaging application with end-to-end encryption simulation

**Features:**
- Individual and group chat messaging
- Real-time message delivery and status tracking
- User presence indicators (online/offline)
- Story functionality with 24-hour expiry
- Media sharing capabilities
- Message encryption simulation
- Chat search and filtering

**Tech Stack:**
- Frontend: React 18, Socket.IO Client, Modern CSS
- Backend: Python Flask, SQLite, Socket.IO, JWT Authentication
- Real-time: WebSocket for instant messaging and status updates

### 3. Instagram Clone
**Port: 5009** | A comprehensive social media platform with photo sharing and social interactions

**Features:**
- Photo and video post sharing
- Stories with 24-hour expiry
- Real-time likes, comments, and interactions
- User profiles and following system
- Explore page and post discovery
- Direct messaging system
- Notification system
- Post saving and archiving

**Tech Stack:**
- Frontend: React 18, Socket.IO Client, Advanced CSS Animations
- Backend: Python Flask, SQLite, Socket.IO, JWT Authentication
- Real-time: WebSocket for social interactions and notifications

## 📁 Project Structure

```
desktop-projects/
├── Discord-Clone/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── MainContent.jsx
│   │   │   ├── UserPanel.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── VoiceChannel.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   └── ServerSettings.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── App.jsx
│   │   └── App.css
│   ├── backend/
│   │   └── app.py
│   ├── package.json
│   └── README.md
├── WhatsApp-Clone/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   └── [additional components]
│   │   ├── App.jsx
│   │   └── App.css
│   ├── backend/
│   │   └── app.py
│   ├── package.json
│   └── README.md
└── Instagram-Clone/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── Post.jsx
    │   │   ├── CreatePost.jsx
    │   │   ├── Stories.jsx
    │   │   └── [additional components]
    │   ├── App.jsx
    │   └── App.css
    ├── backend/
    │   └── app.py
    ├── package.json
    └── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- Python 3.8+
- Git

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ritesh-chauhan0x1/social-media-clones.git
   cd social-media-clones
   ```

2. **Set up each project:**

   **Discord Clone:**
   ```bash
   cd Discord-Clone
   npm install
   cd backend
   pip install -r requirements.txt
   python app.py
   # In another terminal
   cd .. && npm run dev
   ```

   **WhatsApp Clone:**
   ```bash
   cd WhatsApp-Clone
   npm install
   cd backend
   pip install -r requirements.txt
   python app.py
   # In another terminal
   cd .. && npm run dev
   ```

   **Instagram Clone:**
   ```bash
   cd Instagram-Clone
   npm install
   cd backend
   pip install -r requirements.txt
   python app.py
   # In another terminal
   cd .. && npm run dev
   ```

3. **Access the applications:**
   - Discord Clone: http://localhost:3000 (Backend: http://localhost:5007)
   - WhatsApp Clone: http://localhost:3001 (Backend: http://localhost:5008)
   - Instagram Clone: http://localhost:3002 (Backend: http://localhost:5009)

## 🗄️ Database Schema

### Discord Clone Database
- **users**: User accounts and authentication
- **servers**: Discord servers/guilds
- **channels**: Text and voice channels
- **messages**: Chat messages
- **server_members**: Server membership
- **voice_sessions**: Active voice connections

### WhatsApp Clone Database
- **users**: User profiles and status
- **chats**: Chat conversations
- **chat_participants**: Chat membership
- **messages**: Chat messages
- **message_status**: Delivery and read status
- **stories**: User stories
- **story_views**: Story view tracking

### Instagram Clone Database
- **users**: User profiles and social data
- **posts**: Photo/video posts
- **likes**: Post likes
- **comments**: Post comments
- **follows**: User following relationships
- **stories**: User stories
- **story_views**: Story view analytics
- **messages**: Direct messages
- **notifications**: User notifications
- **saved_posts**: Saved post collections

## 🚀 Features Implemented

### Common Features (All Projects)
- ✅ User authentication (register/login)
- ✅ Real-time messaging with Socket.IO
- ✅ Responsive design for mobile/desktop
- ✅ SQLite database with comprehensive schemas
- ✅ JWT token-based authentication
- ✅ Error handling and validation
- ✅ Modern React component architecture

### Discord-Specific Features
- ✅ Server creation and management
- ✅ Voice channel integration
- ✅ Channel permissions and roles
- ✅ Emoji reactions
- ✅ File sharing capabilities
- ✅ User status indicators

### WhatsApp-Specific Features
- ✅ Group chat creation
- ✅ Message status tracking (sent/delivered/read)
- ✅ User presence indicators
- ✅ Story functionality
- ✅ Chat search and filtering
- ✅ Media message support

### Instagram-Specific Features
- ✅ Photo/video post creation
- ✅ Like and comment system
- ✅ Story creation and viewing
- ✅ User profile management
- ✅ Following/followers system
- ✅ Post saving functionality
- ✅ Notification system
- ✅ Explore and discovery features

## 🎨 UI/UX Features

### Modern Design Elements
- **Discord**: Dark theme with gaming-focused UI
- **WhatsApp**: Clean green theme with familiar messaging interface
- **Instagram**: Photo-centric design with gradient accents

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interactions
- Adaptive layouts

### Interactive Elements
- Smooth animations and transitions
- Real-time updates without page refresh
- Drag and drop functionality
- Keyboard navigation support

## 🔧 Development

### Available Scripts

Each project includes:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `python app.py` - Start backend server

### Environment Variables

Create `.env` files in each project:

```env
# Frontend (.env)
VITE_API_URL=http://localhost:5007
VITE_SOCKET_URL=http://localhost:5007

# Backend (.env)
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///app.db
FLASK_ENV=development
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Real-time messaging
- [ ] File uploads and media sharing
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility
- [ ] Socket.IO connections
- [ ] Database operations

### Automated Testing (Future Implementation)
- Unit tests with Jest
- Integration tests with Cypress
- API testing with pytest
- Performance testing

## 🚀 Deployment

### Production Setup

1. **Frontend Deployment:**
   ```bash
   npm run build
   # Deploy dist/ folder to hosting service
   ```

2. **Backend Deployment:**
   ```bash
   # Install production dependencies
   pip install -r requirements.txt
   # Set production environment variables
   export FLASK_ENV=production
   # Run with production server
   gunicorn app:app
   ```

### Deployment Platforms
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, Railway, DigitalOcean
- **Database**: PostgreSQL, MongoDB Atlas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style and patterns
- Add comprehensive comments for complex logic
- Test new features thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements

### Planned Features
- [ ] Video calling integration
- [ ] Advanced search functionality
- [ ] Content moderation tools
- [ ] Analytics dashboard
- [ ] Mobile app development
- [ ] Advanced security features
- [ ] Multi-language support
- [ ] Advanced notification system

### Performance Optimizations
- [ ] Image optimization and compression
- [ ] Lazy loading implementation
- [ ] Caching strategies
- [ ] Database query optimization
- [ ] CDN integration

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact: [your-email@example.com]
- Documentation: [Project Wiki]

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Flask community for the lightweight backend solution
- Socket.IO for real-time communication
- Lucide React for beautiful icons
- Open source community for inspiration

---

**Built with ❤️ by [Ritesh Chauhan](https://github.com/ritesh-chauhan0x1)**

*Last Updated: January 2025*
