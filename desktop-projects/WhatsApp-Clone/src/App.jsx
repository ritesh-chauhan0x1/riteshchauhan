import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ProfilePanel from './components/ProfilePanel';
import LoginForm from './components/LoginForm';
import SettingsModal from './components/SettingsModal';
import StatusModal from './components/StatusModal';
import NewChatModal from './components/NewChatModal';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import './App.css';

// Initialize socket connection
const socket = io('http://localhost:5008', {
  transports: ['websocket']
});

function App() {
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('whatsappUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      socket.emit('user-online', parsedUser);
    }

    // Socket event listeners
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to WhatsApp server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from WhatsApp server');
    });

    socket.on('users-online', (users) => {
      setOnlineUsers(users);
    });

    socket.on('new-message', (message) => {
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat.id === message.chatId) {
            return {
              ...chat,
              messages: [...(chat.messages || []), message],
              lastMessage: message,
              lastMessageTime: message.timestamp,
              unreadCount: chat.id === activeChat?.id ? 0 : (chat.unreadCount || 0) + 1
            };
          }
          return chat;
        });
      });
    });

    socket.on('message-delivered', ({ messageId, chatId }) => {
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: chat.messages?.map(msg => 
                msg.id === messageId 
                  ? { ...msg, status: 'delivered' }
                  : msg
              ) || []
            };
          }
          return chat;
        });
      });
    });

    socket.on('message-read', ({ messageId, chatId }) => {
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: chat.messages?.map(msg => 
                msg.id === messageId 
                  ? { ...msg, status: 'read' }
                  : msg
              ) || []
            };
          }
          return chat;
        });
      });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('users-online');
      socket.off('new-message');
      socket.off('message-delivered');
      socket.off('message-read');
    };
  }, [activeChat]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('whatsappUser', JSON.stringify(userData));
    socket.emit('user-online', userData);
    
    // Load sample chats
    const sampleChats = [
      {
        id: '1',
        name: 'John Doe',
        avatar: 'JD',
        isGroup: false,
        lastMessage: { content: 'Hey! How are you doing?', timestamp: new Date(Date.now() - 300000) },
        lastMessageTime: new Date(Date.now() - 300000),
        unreadCount: 2,
        isOnline: true,
        messages: [
          {
            id: '1',
            content: 'Hey! How are you doing?',
            timestamp: new Date(Date.now() - 300000),
            senderId: 'john-doe',
            senderName: 'John Doe',
            type: 'text',
            status: 'read'
          }
        ]
      },
      {
        id: '2',
        name: 'Work Team',
        avatar: 'WT',
        isGroup: true,
        participants: ['John Doe', 'Jane Smith', 'Mike Johnson'],
        lastMessage: { content: 'Meeting at 3 PM today', timestamp: new Date(Date.now() - 1800000) },
        lastMessageTime: new Date(Date.now() - 1800000),
        unreadCount: 0,
        messages: [
          {
            id: '2',
            content: 'Meeting at 3 PM today',
            timestamp: new Date(Date.now() - 1800000),
            senderId: 'jane-smith',
            senderName: 'Jane Smith',
            type: 'text',
            status: 'delivered'
          }
        ]
      },
      {
        id: '3',
        name: 'Sarah Wilson',
        avatar: 'SW',
        isGroup: false,
        lastMessage: { content: '👍', timestamp: new Date(Date.now() - 3600000) },
        lastMessageTime: new Date(Date.now() - 3600000),
        unreadCount: 0,
        isOnline: false,
        lastSeen: new Date(Date.now() - 1800000),
        messages: [
          {
            id: '3',
            content: '👍',
            timestamp: new Date(Date.now() - 3600000),
            senderId: 'sarah-wilson',
            senderName: 'Sarah Wilson',
            type: 'text',
            status: 'read'
          }
        ]
      }
    ];
    
    setChats(sampleChats);
  };

  const handleLogout = () => {
    if (user) {
      socket.emit('user-offline', user);
    }
    setUser(null);
    localStorage.removeItem('whatsappUser');
    setChats([]);
    setActiveChat(null);
  };

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    // Mark messages as read
    if (chat.unreadCount > 0) {
      setChats(prevChats => 
        prevChats.map(c => 
          c.id === chat.id 
            ? { ...c, unreadCount: 0 }
            : c
        )
      );
      
      // Emit read receipt
      socket.emit('mark-messages-read', { 
        chatId: chat.id, 
        userId: user.id 
      });
    }
  };

  const handleSendMessage = (content, type = 'text') => {
    if (!activeChat || !content.trim()) return;

    const message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      senderId: user.id,
      senderName: user.name,
      type,
      status: 'sent',
      chatId: activeChat.id
    };

    // Update local chat immediately
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === activeChat.id 
          ? {
              ...chat,
              messages: [...(chat.messages || []), message],
              lastMessage: message,
              lastMessageTime: message.timestamp
            }
          : chat
      )
    );

    // Emit to socket
    socket.emit('send-message', message);
  };

  const handleNewChat = (userData) => {
    const newChat = {
      id: Date.now().toString(),
      name: userData.name,
      avatar: userData.name.slice(0, 2).toUpperCase(),
      isGroup: false,
      lastMessage: null,
      lastMessageTime: new Date(),
      unreadCount: 0,
      isOnline: userData.isOnline || false,
      messages: []
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat);
    setShowNewChat(false);
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
      <ChatProvider value={{ chats, setChats, activeChat, setActiveChat }}>
        <Router>
          <div className="app">
            <div className="app-container">
              <Sidebar 
                user={user}
                chats={chats}
                activeChat={activeChat}
                onChatSelect={handleChatSelect}
                onLogout={handleLogout}
                onShowProfile={() => setShowProfile(true)}
                onShowSettings={() => setShowSettings(true)}
                onShowStatus={() => setShowStatus(true)}
                onShowNewChat={() => setShowNewChat(true)}
                isConnected={isConnected}
                socket={socket}
              />
              
              <main className="main-content">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <ChatWindow 
                        user={user}
                        activeChat={activeChat}
                        onSendMessage={handleSendMessage}
                        socket={socket}
                      />
                    } 
                  />
                  <Route 
                    path="/chat/:chatId" 
                    element={
                      <ChatWindow 
                        user={user}
                        activeChat={activeChat}
                        onSendMessage={handleSendMessage}
                        socket={socket}
                      />
                    } 
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>

            {/* Modals */}
            {showProfile && (
              <ProfilePanel 
                user={user}
                onClose={() => setShowProfile(false)}
              />
            )}

            {showSettings && (
              <SettingsModal 
                user={user}
                onClose={() => setShowSettings(false)}
              />
            )}

            {showStatus && (
              <StatusModal 
                user={user}
                onClose={() => setShowStatus(false)}
              />
            )}

            {showNewChat && (
              <NewChatModal 
                user={user}
                onlineUsers={onlineUsers}
                onCreateChat={handleNewChat}
                onClose={() => setShowNewChat(false)}
              />
            )}

            {/* Connection Status */}
            <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? 'Connected' : 'Connecting...'}
            </div>
          </div>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
