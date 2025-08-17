import React, { useState, useEffect, useRef } from 'react';
import { Hash, Volume2, Users, Bell, Pin, Search, AtSign, Gift, Send, Plus, Smile } from 'lucide-react';
import { format } from 'date-fns';

const MainContent = ({ user, currentServer, currentChannel, socket }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sample messages for demo
  const sampleMessages = [
    {
      id: '1',
      author: { username: 'Discord Bot', avatar: 'DB' },
      content: 'Welcome to the Discord Clone! 🎉',
      timestamp: new Date(Date.now() - 3600000),
      type: 'system'
    },
    {
      id: '2',
      author: { username: 'John Doe', avatar: 'JD' },
      content: 'Hey everyone! This Discord clone looks amazing!',
      timestamp: new Date(Date.now() - 2400000)
    },
    {
      id: '3',
      author: { username: 'Jane Smith', avatar: 'JS' },
      content: 'I agree! The real-time features work perfectly.',
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: '4',
      author: { username: 'Mike Johnson', avatar: 'MJ' },
      content: 'Who wants to join a voice channel for gaming? 🎮',
      timestamp: new Date(Date.now() - 1200000)
    },
    {
      id: '5',
      author: { username: 'Sarah Wilson', avatar: 'SW' },
      content: 'The UI design is spot on! Great work on the styling.',
      timestamp: new Date(Date.now() - 600000)
    }
  ];

  useEffect(() => {
    if (currentChannel) {
      // Load sample messages for demo
      setMessages(sampleMessages);
      
      // Set sample online users
      setOnlineUsers([
        { id: '1', username: 'John Doe', status: 'online', activity: 'Playing Valorant' },
        { id: '2', username: 'Jane Smith', status: 'idle', activity: 'Away' },
        { id: '3', username: 'Mike Johnson', status: 'dnd', activity: 'In a meeting' },
        { id: '4', username: 'Sarah Wilson', status: 'online', activity: 'Listening to Spotify' },
        { id: '5', username: user.username, status: 'online', activity: 'Using Discord Clone' }
      ]);
    }
  }, [currentChannel, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !currentChannel) return;

    // Socket event listeners
    socket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('user-typing', (data) => {
      if (data.userId !== user.id) {
        setTypingUsers(prev => {
          const filtered = prev.filter(u => u.userId !== data.userId);
          return [...filtered, data];
        });
        
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
        }, 3000);
      }
    });

    socket.on('users-online', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off('new-message');
      socket.off('user-typing');
      socket.off('users-online');
    };
  }, [socket, currentChannel, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChannel) return;

    const message = {
      id: Date.now().toString(),
      author: { username: user.username, avatar: user.username.slice(0, 2).toUpperCase() },
      content: newMessage,
      timestamp: new Date(),
      channelId: currentChannel.id
    };

    // Add to local messages immediately
    setMessages(prev => [...prev, message]);

    // Emit to socket
    if (socket) {
      socket.emit('send-message', message);
    }

    setNewMessage('');
    setIsTyping(false);
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      if (socket) {
        socket.emit('typing-start', { 
          userId: user.id, 
          username: user.username, 
          channelId: currentChannel?.id 
        });
      }
    } else if (isTyping && e.target.value.length === 0) {
      setIsTyping(false);
      if (socket) {
        socket.emit('typing-stop', { 
          userId: user.id, 
          channelId: currentChannel?.id 
        });
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    
    if (messageDate.toDateString() === now.toDateString()) {
      return format(messageDate, 'HH:mm');
    } else {
      return format(messageDate, 'MM/dd/yyyy HH:mm');
    }
  };

  const groupMessages = (messages) => {
    const groups = [];
    let currentGroup = null;

    messages.forEach(message => {
      const shouldGroup = currentGroup && 
        currentGroup.author.username === message.author.username &&
        (new Date(message.timestamp) - new Date(currentGroup.timestamp)) < 300000; // 5 minutes

      if (shouldGroup) {
        currentGroup.messages.push(message);
      } else {
        currentGroup = {
          ...message,
          messages: [message]
        };
        groups.push(currentGroup);
      }
    });

    return groups;
  };

  if (!currentChannel) {
    return (
      <div className="main-content">
        <div className="no-channel">
          <h2>Welcome to Discord Clone!</h2>
          <p>Select a channel to start chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="chat-header">
        {currentChannel.type === 'text' ? (
          <Hash className="chat-header-icon" />
        ) : (
          <Volume2 className="chat-header-icon" />
        )}
        <div className="chat-header-info">
          <div className="chat-header-name">{currentChannel.name}</div>
          {currentChannel.topic && (
            <div className="chat-header-topic">{currentChannel.topic}</div>
          )}
        </div>
        <div className="chat-actions">
          <Bell className="chat-action" />
          <Pin className="chat-action" />
          <Users className="chat-action" />
          <Search className="chat-action" />
          <AtSign className="chat-action" />
        </div>
      </div>

      {currentChannel.type === 'text' ? (
        <>
          <div className="messages-container">
            {groupMessages(messages).map(group => (
              <div key={group.id} className="message-group">
                <div className="message-header">
                  <div className="message-avatar">
                    {group.author.avatar}
                  </div>
                  <span className="message-author">{group.author.username}</span>
                  <span className="message-timestamp">
                    {formatTimestamp(group.timestamp)}
                  </span>
                </div>
                {group.messages.map(message => (
                  <div key={message.id} className="message-content">
                    {message.content}
                  </div>
                ))}
              </div>
            ))}
            
            {typingUsers.length > 0 && (
              <div className="typing-indicator">
                <div className="typing-users">
                  {typingUsers.map(user => user.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="message-input-container">
            <form onSubmit={handleSendMessage}>
              <div className="message-input-wrapper">
                <Plus className="message-action" size={24} />
                <input
                  ref={inputRef}
                  type="text"
                  className="message-input"
                  placeholder={`Message #${currentChannel.name}`}
                  value={newMessage}
                  onChange={handleInputChange}
                />
                <div className="message-actions">
                  <Gift className="message-action" size={24} />
                  <Smile className="message-action" size={24} />
                </div>
              </div>
            </form>
          </div>
        </>
      ) : (
        <div className="voice-channel-content">
          <div className="voice-channel-info">
            <Volume2 size={48} />
            <h2>{currentChannel.name}</h2>
            <p>Voice channel - Click to join</p>
          </div>
          
          <div className="voice-participants">
            <h3>Participants ({onlineUsers.length})</h3>
            <div className="participants-list">
              {onlineUsers.map(user => (
                <div key={user.id} className="participant">
                  <div className="participant-avatar">
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="participant-name">{user.username}</span>
                  <div className="participant-controls">
                    <Volume2 size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Online Users Sidebar */}
      <div className="members-sidebar">
        <div className="members-header">
          <span>Members — {onlineUsers.length}</span>
        </div>
        <div className="members-list">
          {onlineUsers.map(member => (
            <div key={member.id} className="member-item">
              <div className="member-avatar">
                <div className="avatar-image">
                  {member.username.slice(0, 2).toUpperCase()}
                </div>
                <div className={`member-status ${member.status}`}></div>
              </div>
              <div className="member-info">
                <div className="member-name">{member.username}</div>
                {member.activity && (
                  <div className="member-activity">{member.activity}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
