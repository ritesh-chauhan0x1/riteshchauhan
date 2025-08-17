import React, { useState, useEffect } from 'react';
import { Hash, Volume2, VolumeX, Settings, UserPlus, ChevronDown, ChevronRight } from 'lucide-react';

const Sidebar = ({ user, currentServer, onServerSelect, onChannelSelect, socket }) => {
  const [servers, setServers] = useState([
    {
      id: 'home',
      name: 'Direct Messages',
      icon: 'DM',
      channels: [
        { id: 'friends', name: 'Friends', type: 'text' },
        { id: 'online', name: 'Online', type: 'text' }
      ]
    },
    {
      id: 'discord-server',
      name: 'Discord Clone Server',
      icon: 'DC',
      channels: [
        { id: 'general', name: 'general', type: 'text', topic: 'General discussion' },
        { id: 'random', name: 'random', type: 'text', topic: 'Random conversations' },
        { id: 'memes', name: 'memes', type: 'text', topic: 'Share your best memes' },
        { id: 'general-voice', name: 'General', type: 'voice' },
        { id: 'gaming', name: 'Gaming', type: 'voice' },
        { id: 'music', name: 'Music', type: 'voice' }
      ]
    },
    {
      id: 'gaming-server',
      name: 'Gaming Hub',
      icon: 'GH',
      channels: [
        { id: 'announcements', name: 'announcements', type: 'text' },
        { id: 'looking-for-group', name: 'looking-for-group', type: 'text' },
        { id: 'game-discussion', name: 'game-discussion', type: 'text' },
        { id: 'lobby-1', name: 'Lobby 1', type: 'voice' },
        { id: 'lobby-2', name: 'Lobby 2', type: 'voice' }
      ]
    }
  ]);

  const [selectedServer, setSelectedServer] = useState('discord-server');
  const [collapsedCategories, setCollapsedCategories] = useState({});

  useEffect(() => {
    if (servers.length > 0 && !currentServer) {
      const defaultServer = servers.find(s => s.id === 'discord-server') || servers[0];
      onServerSelect(defaultServer);
      setSelectedServer(defaultServer.id);
    }
  }, [servers, currentServer, onServerSelect]);

  const handleServerClick = (server) => {
    setSelectedServer(server.id);
    onServerSelect(server);
  };

  const handleChannelClick = (channel) => {
    onChannelSelect(channel);
  };

  const toggleCategory = (category) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getChannelsByType = (channels, type) => {
    return channels.filter(channel => channel.type === type);
  };

  const renderChannels = (channels, type, categoryName) => {
    const filteredChannels = getChannelsByType(channels, type);
    if (filteredChannels.length === 0) return null;

    const isCollapsed = collapsedCategories[categoryName];

    return (
      <div className="channel-category">
        <div 
          className={`category-header ${isCollapsed ? 'collapsed' : ''}`}
          onClick={() => toggleCategory(categoryName)}
        >
          {isCollapsed ? <ChevronRight className="category-arrow" /> : <ChevronDown className="category-arrow" />}
          <span>{categoryName}</span>
        </div>
        {!isCollapsed && (
          <div className="channel-list-items">
            {filteredChannels.map(channel => (
              <div 
                key={channel.id}
                className={`channel-item ${currentServer?.channels?.find(c => c.id === channel.id) === channel ? 'active' : ''}`}
                onClick={() => handleChannelClick(channel)}
              >
                {channel.type === 'text' ? (
                  <Hash className="channel-icon" size={20} />
                ) : (
                  <Volume2 className="channel-icon" size={20} />
                )}
                <span className="channel-name">{channel.name}</span>
                <div className="channel-actions">
                  {channel.type === 'text' && (
                    <>
                      <UserPlus className="channel-action" size={16} />
                      <Settings className="channel-action" size={16} />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sidebar">
      <div className="server-list">
        {servers.map(server => (
          <div 
            key={server.id}
            className={`server-icon ${selectedServer === server.id ? 'active' : ''}`}
            onClick={() => handleServerClick(server)}
            title={server.name}
          >
            {server.icon}
          </div>
        ))}
        <div className="server-divider"></div>
        <div className="server-icon" title="Add a Server">
          +
        </div>
      </div>

      {currentServer && (
        <div className="channel-sidebar">
          <div className="server-header">
            <span className="server-name">{currentServer.name}</span>
            <ChevronDown className="server-dropdown" />
          </div>
          
          <div className="channel-list">
            {renderChannels(currentServer.channels, 'text', 'Text Channels')}
            {renderChannels(currentServer.channels, 'voice', 'Voice Channels')}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
