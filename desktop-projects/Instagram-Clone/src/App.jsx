import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Stories from './components/Stories';
import ProfilePage from './components/ProfilePage';
import ExplorePage from './components/ExplorePage';
import MessagesPage from './components/MessagesPage';
import LoginForm from './components/LoginForm';
import PostModal from './components/PostModal';
import CreatePostModal from './components/CreatePostModal';
import NotificationsModal from './components/NotificationsModal';
import { AuthProvider } from './contexts/AuthContext';
import { PostProvider } from './contexts/PostContext';
import './App.css';

// Initialize socket connection
const socket = io('http://localhost:5009', {
  transports: ['websocket']
});

function App() {
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('instagramUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      socket.emit('user-online', parsedUser);
    }

    // Socket event listeners
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to Instagram server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from Instagram server');
    });

    socket.on('new-post', (post) => {
      setPosts(prev => [post, ...prev]);
    });

    socket.on('post-liked', ({ postId, userId, username }) => {
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: [...post.likes, { userId, username }],
              likesCount: post.likesCount + 1 
            }
          : post
      ));
    });

    socket.on('post-unliked', ({ postId, userId }) => {
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: post.likes.filter(like => like.userId !== userId),
              likesCount: post.likesCount - 1 
            }
          : post
      ));
    });

    socket.on('new-comment', ({ postId, comment }) => {
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              comments: [...post.comments, comment],
              commentsCount: post.commentsCount + 1 
            }
          : post
      ));
    });

    socket.on('new-notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new-post');
      socket.off('post-liked');
      socket.off('post-unliked');
      socket.off('new-comment');
      socket.off('new-notification');
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('instagramUser', JSON.stringify(userData));
    socket.emit('user-online', userData);
    
    // Load sample data
    loadSampleData();
  };

  const handleLogout = () => {
    if (user) {
      socket.emit('user-offline', user);
    }
    setUser(null);
    localStorage.removeItem('instagramUser');
    setPosts([]);
    setStories([]);
    setNotifications([]);
  };

  const loadSampleData = () => {
    // Sample posts
    const samplePosts = [
      {
        id: '1',
        user: {
          id: 'john-doe',
          username: 'johndoe',
          fullName: 'John Doe',
          avatar: 'JD',
          isVerified: false
        },
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop'
        ],
        caption: 'Beautiful sunset view from the mountains! 🌅 #nature #sunset #mountains',
        location: 'Rocky Mountains, Colorado',
        timestamp: new Date(Date.now() - 7200000),
        likes: [
          { userId: 'jane-smith', username: 'janesmith' },
          { userId: 'mike-johnson', username: 'mikej' }
        ],
        likesCount: 2,
        comments: [
          {
            id: '1',
            user: { username: 'janesmith', avatar: 'JS' },
            text: 'Absolutely stunning! 😍',
            timestamp: new Date(Date.now() - 3600000)
          }
        ],
        commentsCount: 1,
        isLiked: false,
        isSaved: false
      },
      {
        id: '2',
        user: {
          id: 'jane-smith',
          username: 'janesmith',
          fullName: 'Jane Smith',
          avatar: 'JS',
          isVerified: true
        },
        images: [
          'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&h=600&fit=crop'
        ],
        caption: 'Delicious coffee and pastries at my favorite café ☕️ #coffee #foodie #morning',
        location: 'Downtown Coffee House',
        timestamp: new Date(Date.now() - 14400000),
        likes: [
          { userId: 'john-doe', username: 'johndoe' },
          { userId: 'mike-johnson', username: 'mikej' },
          { userId: 'sarah-wilson', username: 'sarahw' }
        ],
        likesCount: 3,
        comments: [
          {
            id: '2',
            user: { username: 'mikej', avatar: 'MJ' },
            text: 'That looks amazing! What café is this?',
            timestamp: new Date(Date.now() - 10800000)
          },
          {
            id: '3',
            user: { username: 'janesmith', avatar: 'JS' },
            text: '@mikej It\'s Downtown Coffee House on 5th street!',
            timestamp: new Date(Date.now() - 9000000)
          }
        ],
        commentsCount: 2,
        isLiked: false,
        isSaved: true
      }
    ];

    // Sample stories
    const sampleStories = [
      {
        id: '1',
        user: {
          username: 'johndoe',
          avatar: 'JD'
        },
        hasUnwatched: true,
        isOwn: false
      },
      {
        id: '2',
        user: {
          username: 'janesmith',
          avatar: 'JS'
        },
        hasUnwatched: true,
        isOwn: false
      },
      {
        id: '3',
        user: {
          username: 'mikej',
          avatar: 'MJ'
        },
        hasUnwatched: false,
        isOwn: false
      }
    ];

    // Sample notifications
    const sampleNotifications = [
      {
        id: '1',
        type: 'like',
        user: { username: 'johndoe', avatar: 'JD' },
        text: 'liked your photo.',
        timestamp: new Date(Date.now() - 1800000),
        isRead: false
      },
      {
        id: '2',
        type: 'comment',
        user: { username: 'janesmith', avatar: 'JS' },
        text: 'commented on your photo.',
        timestamp: new Date(Date.now() - 3600000),
        isRead: false
      },
      {
        id: '3',
        type: 'follow',
        user: { username: 'mikej', avatar: 'MJ' },
        text: 'started following you.',
        timestamp: new Date(Date.now() - 7200000),
        isRead: true
      }
    ];

    setPosts(samplePosts);
    setStories(sampleStories);
    setNotifications(sampleNotifications);
  };

  const handleLikePost = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isCurrentlyLiked = post.isLiked;
    
    // Update local state immediately
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { 
            ...p, 
            isLiked: !isCurrentlyLiked,
            likesCount: isCurrentlyLiked ? p.likesCount - 1 : p.likesCount + 1,
            likes: isCurrentlyLiked 
              ? p.likes.filter(like => like.userId !== user.id)
              : [...p.likes, { userId: user.id, username: user.username }]
          }
        : p
    ));

    // Emit to socket
    if (socket) {
      if (isCurrentlyLiked) {
        socket.emit('unlike-post', { postId, userId: user.id });
      } else {
        socket.emit('like-post', { postId, userId: user.id, username: user.username });
      }
    }
  };

  const handleSavePost = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const handleCommentPost = (postId, commentText) => {
    if (!commentText.trim()) return;

    const comment = {
      id: Date.now().toString(),
      user: { username: user.username, avatar: user.username.slice(0, 2).toUpperCase() },
      text: commentText,
      timestamp: new Date()
    };

    // Update local state
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            comments: [...post.comments, comment],
            commentsCount: post.commentsCount + 1 
          }
        : post
    ));

    // Emit to socket
    if (socket) {
      socket.emit('add-comment', { postId, comment });
    }
  };

  const handleCreatePost = (postData) => {
    const newPost = {
      id: Date.now().toString(),
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName || user.username,
        avatar: user.username.slice(0, 2).toUpperCase(),
        isVerified: user.isVerified || false
      },
      images: postData.images,
      caption: postData.caption,
      location: postData.location,
      timestamp: new Date(),
      likes: [],
      likesCount: 0,
      comments: [],
      commentsCount: 0,
      isLiked: false,
      isSaved: false
    };

    setPosts(prev => [newPost, ...prev]);
    
    if (socket) {
      socket.emit('create-post', newPost);
    }
    
    setShowCreatePost(false);
  };

  if (!user) {
    return (
      <AuthProvider value={{ user, setUser }}>
        <div className="app">
          <LoginForm onLogin={handleLogin} />
        </div>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider value={{ user, setUser }}>
      <PostProvider value={{ posts, setPosts }}>
        <Router>
          <div className="app">
            <Navbar 
              user={user}
              onCreatePost={() => setShowCreatePost(true)}
              onShowNotifications={() => setShowNotifications(true)}
              onLogout={handleLogout}
              notificationsCount={notifications.filter(n => !n.isRead).length}
              onViewChange={setCurrentView}
              currentView={currentView}
            />
            
            <div className="app-container">
              <Sidebar 
                user={user}
                onCreatePost={() => setShowCreatePost(true)}
                onShowNotifications={() => setShowNotifications(true)}
                onViewChange={setCurrentView}
                currentView={currentView}
              />
              
              <main className="main-content">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <div className="home-content">
                        <div className="feed-container">
                          <Stories stories={stories} user={user} />
                          <Feed 
                            posts={posts}
                            user={user}
                            onLike={handleLikePost}
                            onSave={handleSavePost}
                            onComment={handleCommentPost}
                            onPostClick={setSelectedPost}
                          />
                        </div>
                        <div className="suggestions-sidebar">
                          {/* Suggestions component would go here */}
                        </div>
                      </div>
                    } 
                  />
                  <Route 
                    path="/explore" 
                    element={
                      <ExplorePage 
                        posts={posts}
                        onPostClick={setSelectedPost}
                      />
                    } 
                  />
                  <Route 
                    path="/messages" 
                    element={
                      <MessagesPage 
                        user={user}
                        socket={socket}
                      />
                    } 
                  />
                  <Route 
                    path="/profile/:username" 
                    element={
                      <ProfilePage 
                        user={user}
                        posts={posts}
                        onPostClick={setSelectedPost}
                      />
                    } 
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>

            {/* Modals */}
            {selectedPost && (
              <PostModal 
                post={selectedPost}
                user={user}
                onClose={() => setSelectedPost(null)}
                onLike={handleLikePost}
                onSave={handleSavePost}
                onComment={handleCommentPost}
              />
            )}

            {showCreatePost && (
              <CreatePostModal 
                user={user}
                onClose={() => setShowCreatePost(false)}
                onCreatePost={handleCreatePost}
              />
            )}

            {showNotifications && (
              <NotificationsModal 
                notifications={notifications}
                onClose={() => setShowNotifications(false)}
                onMarkAsRead={(notificationId) => {
                  setNotifications(prev => 
                    prev.map(n => 
                      n.id === notificationId ? { ...n, isRead: true } : n
                    )
                  );
                }}
              />
            )}

            {/* Connection Status */}
            <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? 'Connected' : 'Connecting...'}
            </div>
          </div>
        </Router>
      </PostProvider>
    </AuthProvider>
  );
}

export default App;
