import React, { useState, useEffect } from 'react';
import { Volume2, Mic, MicOff, Headphones, HeadphonesIcon, PhoneOff, Users } from 'lucide-react';

const VoiceChannel = ({ user, currentChannel, onLeave, socket }) => {
  const [participants, setParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    // Simulate voice channel connection
    setConnectionStatus('connecting');
    
    setTimeout(() => {
      setConnectionStatus('connected');
      // Add sample participants
      setParticipants([
        { 
          id: '1', 
          username: 'John Doe', 
          isMuted: false, 
          isDeafened: false, 
          isSpeaking: false 
        },
        { 
          id: '2', 
          username: 'Jane Smith', 
          isMuted: true, 
          isDeafened: false, 
          isSpeaking: false 
        },
        { 
          id: user.id, 
          username: user.username, 
          isMuted: isMuted, 
          isDeafened: isDeafened, 
          isSpeaking: false 
        }
      ]);
    }, 2000);

    // Socket event listeners for voice
    if (socket) {
      socket.on('voice-user-joined', (userData) => {
        setParticipants(prev => [...prev, userData]);
      });

      socket.on('voice-user-left', (userId) => {
        setParticipants(prev => prev.filter(p => p.id !== userId));
      });

      socket.on('voice-user-muted', ({ userId, isMuted }) => {
        setParticipants(prev => 
          prev.map(p => p.id === userId ? { ...p, isMuted } : p)
        );
      });

      socket.on('voice-user-speaking', ({ userId, isSpeaking }) => {
        setParticipants(prev => 
          prev.map(p => p.id === userId ? { ...p, isSpeaking } : p)
        );
      });
    }

    return () => {
      if (socket) {
        socket.off('voice-user-joined');
        socket.off('voice-user-left');
        socket.off('voice-user-muted');
        socket.off('voice-user-speaking');
      }
    };
  }, [user, socket]);

  useEffect(() => {
    // Update user's mute status in participants
    setParticipants(prev => 
      prev.map(p => 
        p.id === user.id 
          ? { ...p, isMuted, isDeafened }
          : p
      )
    );

    // Emit mute status to socket
    if (socket) {
      socket.emit('voice-mute-status', {
        userId: user.id,
        isMuted,
        isDeafened
      });
    }
  }, [isMuted, isDeafened, user.id, socket]);

  const handleMicToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleHeadphonesToggle = () => {
    setIsDeafened(!isDeafened);
    if (!isDeafened) {
      setIsMuted(true);
    }
  };

  const handleLeave = () => {
    if (socket) {
      socket.emit('leave-voice-channel', { userId: user.id });
    }
    onLeave();
  };

  return (
    <div className="voice-channel">
      <div className="voice-info">
        <div className="voice-channel-name">
          <Volume2 size={20} />
          {currentChannel?.name || 'Voice Channel'}
        </div>
        <div className="voice-status">
          Status: {connectionStatus === 'connected' ? 'Connected' : 'Connecting...'}
        </div>
        <div className="voice-participants">
          <Users size={16} />
          {participants.length} participant{participants.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="voice-participants-list">
        {participants.map(participant => (
          <div 
            key={participant.id} 
            className={`voice-participant ${participant.isSpeaking ? 'speaking' : ''}`}
          >
            <div className="participant-avatar">
              {participant.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="participant-info">
              <span className="participant-name">{participant.username}</span>
              <div className="participant-status">
                {participant.isMuted && <MicOff size={14} />}
                {participant.isDeafened && <HeadphonesIcon size={14} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="voice-controls">
        <button 
          className={`voice-control ${isMuted ? 'muted' : ''}`}
          onClick={handleMicToggle}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <button 
          className={`voice-control ${isDeafened ? 'deafened' : ''}`}
          onClick={handleHeadphonesToggle}
          title={isDeafened ? 'Undeafen' : 'Deafen'}
        >
          {isDeafened ? <HeadphonesIcon size={20} /> : <Headphones size={20} />}
        </button>

        <button 
          className="voice-control disconnect"
          onClick={handleLeave}
          title="Leave Voice Channel"
        >
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
};

export default VoiceChannel;
