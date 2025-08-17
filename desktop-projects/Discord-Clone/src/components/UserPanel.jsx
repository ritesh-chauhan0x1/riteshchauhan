import React, { useState } from 'react';
import { Mic, MicOff, Headphones, HeadphonesIcon, Settings, PhoneOff } from 'lucide-react';

const UserPanel = ({ 
  user, 
  onLogout, 
  onShowProfile, 
  onShowSettings, 
  inVoiceChannel, 
  onJoinVoice, 
  onLeaveVoice, 
  isConnected 
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [userStatus, setUserStatus] = useState('online');

  const handleMicToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleHeadphonesToggle = () => {
    setIsDeafened(!isDeafened);
    if (!isDeafened) {
      setIsMuted(true); // Deafening also mutes
    }
  };

  const handleStatusChange = (status) => {
    setUserStatus(status);
  };

  const getUserInitials = () => {
    return user.username.slice(0, 2).toUpperCase();
  };

  const getStatusColor = () => {
    switch (userStatus) {
      case 'online': return '#3ba55d';
      case 'idle': return '#faa81a';
      case 'dnd': return '#ed4245';
      case 'offline': return '#747f8d';
      default: return '#3ba55d';
    }
  };

  return (
    <div className="user-panel">
      <div className="user-info" onClick={onShowProfile}>
        <div className="user-avatar">
          {getUserInitials()}
          <div 
            className={`user-status ${userStatus}`}
            style={{ backgroundColor: getStatusColor() }}
          ></div>
        </div>
        <div className="user-details">
          <div className="user-name">{user.username}</div>
          <div className="user-activity">
            {inVoiceChannel ? 'In voice channel' : 'Using Discord Clone'}
          </div>
        </div>
      </div>

      <div className="user-controls">
        <button 
          className={`user-control ${isMuted ? 'muted' : ''}`}
          onClick={handleMicToggle}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <button 
          className={`user-control ${isDeafened ? 'deafened' : ''}`}
          onClick={handleHeadphonesToggle}
          title={isDeafened ? 'Undeafen' : 'Deafen'}
        >
          {isDeafened ? <HeadphonesIcon size={20} /> : <Headphones size={20} />}
        </button>

        <button 
          className="user-control"
          onClick={onShowSettings}
          title="User Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Connection status indicator */}
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>

      {/* Voice channel disconnect button */}
      {inVoiceChannel && (
        <button 
          className="user-control disconnect"
          onClick={onLeaveVoice}
          title="Leave Voice Channel"
        >
          <PhoneOff size={20} />
        </button>
      )}
    </div>
  );
};

export default UserPanel;
