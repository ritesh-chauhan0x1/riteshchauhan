import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import UserPanel from './components/UserPanel';
import LoginForm from './components/LoginForm';
import VoiceChannel from './components/VoiceChannel';
import UserProfile from './components/UserProfile';
import ServerSettings from './components/ServerSettings';
import { UserProvider } from './contexts/UserContext';
import { ServerProvider } from './contexts/ServerContext';
import './App.css';

// Initialize socket connection
const socket = io('http://localhost:5007', {
  transports: ['websocket']
});

function App() {
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentServer, setCurrentServer] = useState(null);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [inVoiceChannel, setInVoiceChannel] = useState(false);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('discordUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      socket.emit('user-online', parsedUser);
    }

    // Socket event listeners
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to Discord server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from Discord server');
    });

    socket.on('user-joined', (userData) => {
      console.log('User joined:', userData.username);
    });

    socket.on('user-left', (userData) => {
      console.log('User left:', userData.username);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('user-joined');
      socket.off('user-left');
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('discordUser', JSON.stringify(userData));
    socket.emit('user-online', userData);
  };

  const handleLogout = () => {
    if (user) {
      socket.emit('user-offline', user);
    }
    setUser(null);
    localStorage.removeItem('discordUser');
    setCurrentServer(null);
    setCurrentChannel(null);
    setInVoiceChannel(false);
  };

  const handleServerSelect = (server) => {
    setCurrentServer(server);
    setCurrentChannel(server.channels[0]); // Select first channel by default
  };

  const handleChannelSelect = (channel) => {
    setCurrentChannel(channel);
    if (channel.type === 'voice') {
      setInVoiceChannel(true);
    }
  };

  const handleJoinVoice = (channelId) => {
    setInVoiceChannel(true);
    socket.emit('join-voice-channel', { userId: user.id, channelId });
  };

  const handleLeaveVoice = () => {
    setInVoiceChannel(false);
    socket.emit('leave-voice-channel', { userId: user.id });
  };

  if (!user) {
    return (
      <div className="app">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <UserProvider value={{ user, setUser }}>
      <ServerProvider value={{ currentServer, setCurrentServer, currentChannel, setCurrentChannel }}>
        <Router>
          <div className="app">
            <div className="app-container">
              <Sidebar 
                user={user}
                currentServer={currentServer}
                onServerSelect={handleServerSelect}
                onChannelSelect={handleChannelSelect}
                socket={socket}
              />
              
              <main className="main-content">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <MainContent 
                        user={user}
                        currentServer={currentServer}
                        currentChannel={currentChannel}
                        socket={socket}
                      />
                    } 
                  />
                  <Route 
                    path="/channels/:serverId/:channelId" 
                    element={
                      <MainContent 
                        user={user}
                        currentServer={currentServer}
                        currentChannel={currentChannel}
                        socket={socket}
                      />
                    } 
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <UserPanel 
                user={user}
                onLogout={handleLogout}
                onShowProfile={() => setShowProfile(true)}
                onShowSettings={() => setShowSettings(true)}
                inVoiceChannel={inVoiceChannel}
                onJoinVoice={handleJoinVoice}
                onLeaveVoice={handleLeaveVoice}
                isConnected={isConnected}
              />
            </div>

            {/* Voice Channel Component */}
            {inVoiceChannel && (
              <VoiceChannel 
                user={user}
                currentChannel={currentChannel}
                onLeave={handleLeaveVoice}
                socket={socket}
              />
            )}

            {/* User Profile Modal */}
            {showProfile && (
              <UserProfile 
                user={user}
                onClose={() => setShowProfile(false)}
              />
            )}

            {/* Server Settings Modal */}
            {showSettings && currentServer && (
              <ServerSettings 
                server={currentServer}
                user={user}
                onClose={() => setShowSettings(false)}
                socket={socket}
              />
            )}
          </div>
        </Router>
      </ServerProvider>
    </UserProvider>
  );
}

export default App;