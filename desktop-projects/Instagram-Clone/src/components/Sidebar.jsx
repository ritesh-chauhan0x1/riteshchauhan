import React from 'react';
import { Home, Search, PlusSquare, Heart, MessageCircle, User, Menu, Settings, BookmarkIcon, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ 
  activeView, 
  setActiveView, 
  user, 
  onLogout, 
  notifications = [],
  showMore = false,
  setShowMore 
}) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'create', label: 'Create', icon: PlusSquare },
    { id: 'notifications', label: 'Notifications', icon: Heart },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const moreItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'saved', label: 'Saved', icon: BookmarkIcon },
    { id: 'logout', label: 'Log out', icon: LogOut, action: onLogout }
  ];

  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Instagram</h1>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <Icon size={24} />
              <span>{item.label}</span>
              {item.id === 'notifications' && unreadNotifications > 0 && (
                <span className="notification-badge">{unreadNotifications}</span>
              )}
            </button>
          );
        })}

        <button 
          className="sidebar-item"
          onClick={() => setShowMore(!showMore)}
        >
          <Menu size={24} />
          <span>More</span>
        </button>
      </nav>

      {showMore && (
        <div className="sidebar-more">
          {moreItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className="sidebar-item"
                onClick={item.action || (() => setActiveView(item.id))}
              >
                <Icon size={24} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {user && (
        <div className="sidebar-profile">
          <div className="sidebar-user">
            <div className="user-avatar">
              {user.avatar || user.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="username">{user.username}</span>
              <span className="full-name">{user.full_name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
