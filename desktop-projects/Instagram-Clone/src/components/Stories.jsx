import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import './Stories.css';

const Stories = ({ stories = [], currentUser, onClose }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const videoRef = useRef(null);

  const currentStory = stories[currentStoryIndex];
  const currentSegment = currentStory?.segments?.[currentSegmentIndex];
  const SEGMENT_DURATION = 5000; // 5 seconds per segment

  useEffect(() => {
    if (isPlaying && currentSegment) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (SEGMENT_DURATION / 100));
          if (newProgress >= 100) {
            goToNextSegment();
            return 0;
          }
          return newProgress;
        });
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentSegment, currentStoryIndex, currentSegmentIndex]);

  const goToNextSegment = () => {
    if (currentSegmentIndex < currentStory.segments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      goToNextStory();
    }
  };

  const goToPrevSegment = () => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(prev => prev - 1);
      setProgress(0);
    } else {
      goToPrevStory();
    }
  };

  const goToNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentSegmentIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setCurrentSegmentIndex(0);
      setProgress(0);
    }
  };

  const handleSegmentClick = (segmentIndex) => {
    setCurrentSegmentIndex(segmentIndex);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        goToPrevSegment();
        break;
      case 'ArrowRight':
        goToNextSegment();
        break;
      case ' ':
        e.preventDefault();
        togglePlayPause();
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const storyTime = new Date(timestamp);
    const diffInHours = Math.floor((now - storyTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  if (!currentStory || !currentSegment) {
    return null;
  }

  return (
    <div 
      className="stories-viewer"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="stories-container">
        {/* Progress bars */}
        <div className="progress-bars">
          {currentStory.segments.map((_, index) => (
            <div
              key={index}
              className="progress-bar"
              onClick={() => handleSegmentClick(index)}
            >
              <div 
                className="progress-fill"
                style={{
                  width: index < currentSegmentIndex ? '100%' : 
                         index === currentSegmentIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Story header */}
        <div className="story-header">
          <div className="story-user">
            <div className="user-avatar">
              {currentStory.user.avatar || currentStory.user.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="username">{currentStory.user.username}</span>
              <span className="timestamp">{formatTimestamp(currentSegment.timestamp)}</span>
            </div>
          </div>
          <div className="story-controls">
            <button onClick={togglePlayPause} className="control-btn">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            {currentSegment.type === 'video' && (
              <button onClick={toggleMute} className="control-btn">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            )}
            <button onClick={onClose} className="control-btn">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Story content */}
        <div className="story-content">
          {currentSegment.type === 'image' ? (
            <img 
              src={currentSegment.url} 
              alt="Story content"
              className="story-media"
            />
          ) : (
            <video
              ref={videoRef}
              src={currentSegment.url}
              className="story-media"
              autoPlay
              muted={isMuted}
              loop={false}
              onEnded={goToNextSegment}
            />
          )}
          
          {/* Text overlay */}
          {currentSegment.text && (
            <div className="story-text" style={{ color: currentSegment.textColor || 'white' }}>
              {currentSegment.text}
            </div>
          )}

          {/* Music indicator */}
          {currentSegment.music && (
            <div className="music-indicator">
              ♪ {currentSegment.music.title} - {currentSegment.music.artist}
            </div>
          )}
        </div>

        {/* Navigation areas */}
        <div className="nav-area nav-left" onClick={goToPrevSegment} />
        <div className="nav-area nav-right" onClick={goToNextSegment} />

        {/* Navigation arrows */}
        {currentStoryIndex > 0 && (
          <button className="nav-arrow nav-arrow-left" onClick={goToPrevStory}>
            <ChevronLeft size={24} />
          </button>
        )}
        {currentStoryIndex < stories.length - 1 && (
          <button className="nav-arrow nav-arrow-right" onClick={goToNextStory}>
            <ChevronRight size={24} />
          </button>
        )}

        {/* Story reply */}
        <div className="story-reply">
          <input
            type="text"
            placeholder={`Reply to ${currentStory.user.username}...`}
            className="reply-input"
          />
          <button className="reply-send">Send</button>
        </div>

        {/* Viewers count (for own stories) */}
        {currentStory.user.id === currentUser?.id && (
          <div className="story-stats">
            <div className="views-count">
              👁 {currentSegment.views || 0} views
            </div>
          </div>
        )}
      </div>

      {/* Story thumbnails */}
      <div className="story-thumbnails">
        {stories.map((story, index) => (
          <div
            key={story.id}
            className={`story-thumbnail ${index === currentStoryIndex ? 'active' : ''}`}
            onClick={() => {
              setCurrentStoryIndex(index);
              setCurrentSegmentIndex(0);
              setProgress(0);
            }}
          >
            <div className="thumbnail-avatar">
              {story.user.avatar || story.user.username.charAt(0).toUpperCase()}
            </div>
            <span className="thumbnail-username">{story.user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Story ring component for the main feed
export const StoryRing = ({ story, onClick, isViewed = false }) => {
  return (
    <div 
      className={`story-ring ${isViewed ? 'viewed' : ''}`}
      onClick={() => onClick(story)}
    >
      <div className="story-avatar">
        {story.user.avatar || story.user.username.charAt(0).toUpperCase()}
      </div>
      <span className="story-username">{story.user.username}</span>
    </div>
  );
};

export default Stories;
