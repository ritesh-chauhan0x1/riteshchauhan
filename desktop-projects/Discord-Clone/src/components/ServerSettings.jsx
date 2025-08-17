import React, { useState } from 'react';
import { X, Settings, Users, Shield, Hash, Trash2, Edit, Plus } from 'lucide-react';

const ServerSettings = ({ server, user, onClose, socket }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [serverData, setServerData] = useState({ ...server });
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState('text');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Settings },
    { id: 'channels', name: 'Channels', icon: Hash },
    { id: 'members', name: 'Members', icon: Users },
    { id: 'roles', name: 'Roles', icon: Shield }
  ];

  const handleServerUpdate = (field, value) => {
    setServerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveServer = () => {
    // In a real app, this would save to backend
    console.log('Server updated:', serverData);
    if (socket) {
      socket.emit('update-server', serverData);
    }
  };

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;

    const newChannel = {
      id: Date.now().toString(),
      name: newChannelName.toLowerCase().replace(/\s+/g, '-'),
      type: newChannelType,
      topic: newChannelType === 'text' ? 'New channel topic' : ''
    };

    setServerData(prev => ({
      ...prev,
      channels: [...prev.channels, newChannel]
    }));

    setNewChannelName('');
    
    if (socket) {
      socket.emit('create-channel', { serverId: server.id, channel: newChannel });
    }
  };

  const handleDeleteChannel = (channelId) => {
    setServerData(prev => ({
      ...prev,
      channels: prev.channels.filter(c => c.id !== channelId)
    }));

    if (socket) {
      socket.emit('delete-channel', { serverId: server.id, channelId });
    }
  };

  const renderOverview = () => (
    <div className="settings-section">
      <h3>Server Overview</h3>
      
      <div className="settings-group">
        <label>Server Name</label>
        <input
          type="text"
          value={serverData.name}
          onChange={(e) => handleServerUpdate('name', e.target.value)}
          className="settings-input"
        />
      </div>

      <div className="settings-group">
        <label>Server Description</label>
        <textarea
          value={serverData.description || ''}
          onChange={(e) => handleServerUpdate('description', e.target.value)}
          placeholder="Tell people what your server is about..."
          className="settings-textarea"
          rows={4}
        />
      </div>

      <div className="settings-group">
        <label>Server Icon</label>
        <div className="server-icon-upload">
          <div className="current-icon">
            {serverData.icon || serverData.name.slice(0, 2).toUpperCase()}
          </div>
          <button className="upload-button">Upload Image</button>
        </div>
      </div>

      <div className="settings-actions">
        <button className="save-button" onClick={handleSaveServer}>
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderChannels = () => (
    <div className="settings-section">
      <h3>Channel Management</h3>
      
      <div className="create-channel">
        <h4>Create New Channel</h4>
        <div className="channel-form">
          <input
            type="text"
            placeholder="Channel name"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            className="settings-input"
          />
          <select
            value={newChannelType}
            onChange={(e) => setNewChannelType(e.target.value)}
            className="settings-select"
          >
            <option value="text">Text Channel</option>
            <option value="voice">Voice Channel</option>
          </select>
          <button className="create-button" onClick={handleCreateChannel}>
            <Plus size={16} />
            Create
          </button>
        </div>
      </div>

      <div className="channels-list">
        <h4>Existing Channels</h4>
        {serverData.channels.map(channel => (
          <div key={channel.id} className="channel-item">
            <div className="channel-info">
              {channel.type === 'text' ? <Hash size={20} /> : <Users size={20} />}
              <span className="channel-name">{channel.name}</span>
              <span className="channel-type">({channel.type})</span>
            </div>
            <div className="channel-actions">
              <button className="edit-channel">
                <Edit size={16} />
              </button>
              <button 
                className="delete-channel"
                onClick={() => handleDeleteChannel(channel.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMembers = () => (
    <div className="settings-section">
      <h3>Server Members</h3>
      
      <div className="members-stats">
        <div className="stat">
          <span className="stat-number">24</span>
          <span className="stat-label">Total Members</span>
        </div>
        <div className="stat">
          <span className="stat-number">8</span>
          <span className="stat-label">Online</span>
        </div>
      </div>

      <div className="members-list">
        {/* Sample members */}
        <div className="member-item">
          <div className="member-avatar">JD</div>
          <div className="member-info">
            <span className="member-name">John Doe</span>
            <span className="member-role">Administrator</span>
          </div>
          <div className="member-actions">
            <button className="kick-button">Kick</button>
            <button className="ban-button">Ban</button>
          </div>
        </div>
        
        <div className="member-item">
          <div className="member-avatar">JS</div>
          <div className="member-info">
            <span className="member-name">Jane Smith</span>
            <span className="member-role">Moderator</span>
          </div>
          <div className="member-actions">
            <button className="kick-button">Kick</button>
            <button className="ban-button">Ban</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoles = () => (
    <div className="settings-section">
      <h3>Server Roles</h3>
      
      <div className="create-role">
        <button className="create-button">
          <Plus size={16} />
          Create Role
        </button>
      </div>

      <div className="roles-list">
        <div className="role-item">
          <div className="role-info">
            <div className="role-color admin"></div>
            <span className="role-name">Administrator</span>
            <span className="role-members">1 member</span>
          </div>
          <div className="role-actions">
            <button className="edit-role">
              <Edit size={16} />
            </button>
            <button className="delete-role">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <div className="role-item">
          <div className="role-info">
            <div className="role-color moderator"></div>
            <span className="role-name">Moderator</span>
            <span className="role-members">3 members</span>
          </div>
          <div className="role-actions">
            <button className="edit-role">
              <Edit size={16} />
            </button>
            <button className="delete-role">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <div className="role-item">
          <div className="role-info">
            <div className="role-color member"></div>
            <span className="role-name">@everyone</span>
            <span className="role-members">24 members</span>
          </div>
          <div className="role-actions">
            <button className="edit-role">
              <Edit size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Server Settings</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-sidebar">
            <nav className="settings-nav">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon size={20} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="settings-main">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'channels' && renderChannels()}
            {activeTab === 'members' && renderMembers()}
            {activeTab === 'roles' && renderRoles()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerSettings;
