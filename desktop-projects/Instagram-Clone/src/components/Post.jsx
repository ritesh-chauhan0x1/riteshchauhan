import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, SmileIcon } from 'lucide-react';
import './Post.css';

const Post = ({ 
  post, 
  currentUser, 
  onLike, 
  onSave, 
  onComment, 
  onShare 
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const commentInputRef = useRef(null);

  const handleLike = () => {
    onLike(post.id);
  };

  const handleSave = () => {
    onSave(post.id);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  const focusCommentInput = () => {
    setShowComments(true);
    setTimeout(() => commentInputRef.current?.focus(), 100);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;
    return `${Math.floor(diffInHours / 168)}w`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="post">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-user">
          <div className="user-avatar">
            {post.user.avatar || post.user.username.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="username">
              {post.user.username}
              {post.user.is_verified && <span className="verified">✓</span>}
            </span>
            {post.location && <span className="location">{post.location}</span>}
          </div>
        </div>
        <button className="post-options">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Images */}
      <div className="post-images">
        {post.images.length > 1 && (
          <>
            <button className="nav-button prev" onClick={prevImage}>‹</button>
            <button className="nav-button next" onClick={nextImage}>›</button>
            <div className="image-indicators">
              {post.images.map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          </>
        )}
        <img
          src={post.images[currentImageIndex]}
          alt="Post content"
          className="post-image"
          onDoubleClick={handleLike}
        />
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <div className="action-buttons">
          <button 
            className={`action-btn ${post.is_liked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <Heart size={24} fill={post.is_liked ? '#ff3040' : 'none'} />
          </button>
          <button className="action-btn" onClick={focusCommentInput}>
            <MessageCircle size={24} />
          </button>
          <button className="action-btn" onClick={() => onShare(post)}>
            <Send size={24} />
          </button>
        </div>
        <button 
          className={`save-btn ${post.is_saved ? 'saved' : ''}`}
          onClick={handleSave}
        >
          <Bookmark size={24} fill={post.is_saved ? '#262626' : 'none'} />
        </button>
      </div>

      {/* Post Stats */}
      <div className="post-stats">
        {post.likes_count > 0 && (
          <div className="likes">
            <strong>{post.likes_count.toLocaleString()} likes</strong>
          </div>
        )}
      </div>

      {/* Post Caption */}
      {post.caption && (
        <div className="post-caption">
          <span className="username">{post.user.username}</span>{' '}
          <span className="caption-text">{post.caption}</span>
        </div>
      )}

      {/* Comments Preview */}
      {post.comments_count > 0 && !showComments && (
        <button 
          className="view-comments"
          onClick={() => setShowComments(true)}
        >
          View all {post.comments_count} comments
        </button>
      )}

      {/* Recent Comments */}
      {post.comments && post.comments.length > 0 && !showComments && (
        <div className="recent-comments">
          {post.comments.slice(0, 2).map(comment => (
            <div key={comment.id} className="comment">
              <span className="username">{comment.user.username}</span>{' '}
              <span className="comment-text">{comment.content}</span>
            </div>
          ))}
        </div>
      )}

      {/* All Comments */}
      {showComments && (
        <div className="all-comments">
          {post.comments?.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-user">
                <div className="user-avatar small">
                  {comment.user.avatar || comment.user.username.charAt(0).toUpperCase()}
                </div>
                <div className="comment-content">
                  <span className="username">{comment.user.username}</span>{' '}
                  <span className="comment-text">{comment.content}</span>
                </div>
              </div>
              <div className="comment-actions">
                <span className="comment-time">{formatTimestamp(comment.timestamp)}</span>
                <button className="reply-btn">Reply</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Timestamp */}
      <div className="post-time">
        {formatTimestamp(post.timestamp)}
      </div>

      {/* Add Comment */}
      <div className="add-comment">
        <form onSubmit={handleComment}>
          <SmileIcon size={20} className="emoji-btn" />
          <input
            ref={commentInputRef}
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="comment-input"
          />
          {commentText.trim() && (
            <button type="submit" className="post-comment-btn">
              Post
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Post;
