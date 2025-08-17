import React, { useState } from 'react';
import { X, Edit, Camera, Badge, Crown } from 'lucide-react';

const UserProfile = ({ user, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleSave = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
    console.log('User profile updated:', editedUser);
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatJoinDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">User Profile</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <div className="profile-content">
            {/* Profile Banner */}
            <div className="profile-banner">
              <div className="banner-gradient"></div>
              <div className="profile-avatar-container">
                <div className="profile-avatar">
                  {user.avatar}
                  <div className="avatar-badge">
                    <Camera size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="profile-info">
              <div className="profile-section">
                <div className="section-header">
                  <h3>Profile Information</h3>
                  <button 
                    className="edit-button"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit size={16} />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <div className="profile-fields">
                  <div className="profile-field">
                    <label>Username</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="profile-input"
                      />
                    ) : (
                      <div className="profile-value">
                        {user.username}
                        <Badge className="profile-badge" size={16} />
                      </div>
                    )}
                  </div>

                  <div className="profile-field">
                    <label>Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="profile-input"
                      />
                    ) : (
                      <div className="profile-value">{user.email}</div>
                    )}
                  </div>

                  <div className="profile-field">
                    <label>Status</label>
                    {isEditing ? (
                      <select
                        value={editedUser.status || 'online'}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="profile-select"
                      >
                        <option value="online">Online</option>
                        <option value="idle">Idle</option>
                        <option value="dnd">Do Not Disturb</option>
                        <option value="offline">Offline</option>
                      </select>
                    ) : (
                      <div className="profile-value">
                        <div className={`status-indicator ${user.status || 'online'}`}></div>
                        {(user.status || 'online').charAt(0).toUpperCase() + (user.status || 'online').slice(1)}
                      </div>
                    )}
                  </div>

                  <div className="profile-field">
                    <label>About Me</label>
                    {isEditing ? (
                      <textarea
                        value={editedUser.bio || ''}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us about yourself..."
                        className="profile-textarea"
                        rows={3}
                      />
                    ) : (
                      <div className="profile-value">
                        {user.bio || 'No bio set yet.'}
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="profile-actions">
                    <button className="save-button" onClick={handleSave}>
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {/* Account Info */}
              <div className="profile-section">
                <h3>Account Information</h3>
                <div className="profile-fields">
                  <div className="profile-field">
                    <label>Member Since</label>
                    <div className="profile-value">
                      {formatJoinDate(user.joinedAt)}
                    </div>
                  </div>

                  <div className="profile-field">
                    <label>User ID</label>
                    <div className="profile-value">{user.id}</div>
                  </div>
                </div>
              </div>

              {/* Badges & Achievements */}
              <div className="profile-section">
                <h3>Badges</h3>
                <div className="badges-container">
                  <div className="badge-item">
                    <Crown size={24} className="badge-icon" />
                    <span>Early Supporter</span>
                  </div>
                  <div className="badge-item">
                    <Badge size={24} className="badge-icon" />
                    <span>Verified User</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
