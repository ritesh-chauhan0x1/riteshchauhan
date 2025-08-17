# Netflix Clone

A fully functional Netflix clone built with React and Firebase, featuring user authentication, movie browsing, video streaming, and personalized recommendations.

## 🚀 Features

- **User Authentication** - Sign up, login, and logout functionality
- **Movie Database** - Browse movies and TV shows with TMDB API
- **Video Streaming** - Watch trailers and content
- **Personalized Recommendations** - AI-powered content suggestions
- **Responsive Design** - Works on all devices
- **Search Functionality** - Find movies and shows instantly
- **User Profiles** - Multiple user profiles support
- **Watchlist** - Save movies and shows for later

## 🛠️ Technologies Used

- **Frontend**: React 18, React Router, CSS3
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **API**: The Movie Database (TMDB) API
- **Video Player**: React YouTube
- **HTTP Client**: Axios
- **Deployment**: Vercel/Netlify

## 📱 Screenshots

![Netflix Clone Home](./screenshots/home.png)
![Netflix Clone Browse](./screenshots/browse.png)
![Netflix Clone Player](./screenshots/player.png)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- TMDB API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ritesh-chauhan0x1/netflix-clone.git
cd netflix-clone
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your API keys:
```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_TMDB_API_KEY=your_tmdb_api_key
```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 📂 Project Structure

```
netflix-clone/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── Banner/
│   │   ├── Row/
│   │   ├── Nav/
│   │   └── Footer/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Browse/
│   │   └── Profile/
│   ├── services/
│   │   ├── firebase.js
│   │   └── tmdb.js
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## 🔧 Configuration

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password
3. Create a Firestore database
4. Add your web app and copy the configuration

### TMDB API Setup

1. Create an account at [TMDB](https://www.themoviedb.org/)
2. Go to Settings > API and request an API key
3. Add the API key to your environment variables

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `build` folder to Netlify
3. Add environment variables in Netlify dashboard

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

- [Netflix](https://netflix.com) for the design inspiration
- [TMDB](https://www.themoviedb.org/) for the movie database API
- [Firebase](https://firebase.google.com/) for backend services
- [React](https://reactjs.org/) for the amazing framework

## 📊 Project Stats

- ⭐ GitHub Stars: 50+
- 🍴 Forks: 25+
- 🐛 Issues: 2 open
- 📝 Commits: 150+
- 👥 Contributors: 5

---

⚡ **Live Demo**: [Netflix Clone Live](https://netflix-clone-ritesh.vercel.app)
