import React, { useState, useRef } from 'react';
import { X, Upload, MapPin, Smile } from 'lucide-react';
import './CreatePost.css';

const CreatePost = ({ user, onCreatePost, onClose }) => {
  const [step, setStep] = useState(1); // 1: select files, 2: edit, 3: share
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedFiles(files);
    
    // Create previews
    const newPreviews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        if (newPreviews.length === files.length) {
          setPreviews(newPreviews);
          setStep(2);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePost = async () => {
    if (selectedFiles.length === 0) return;

    setIsPosting(true);
    
    try {
      // In a real app, you would upload files to a server first
      // For demo purposes, we'll use the preview URLs
      const imageUrls = previews;
      
      await onCreatePost({
        caption,
        location,
        image_urls: imageUrls
      });
      
      // Reset form
      setSelectedFiles([]);
      setPreviews([]);
      setCaption('');
      setLocation('');
      setStep(1);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    
    if (newFiles.length === 0) {
      setStep(1);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const goNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  return (
    <div className="create-post-overlay">
      <div className="create-post-modal">
        <div className="modal-header">
          <button className="back-btn" onClick={step > 1 ? goBack : onClose}>
            {step > 1 ? '←' : <X size={24} />}
          </button>
          <h2>
            {step === 1 && 'Create new post'}
            {step === 2 && 'Edit'}
            {step === 3 && 'Share'}
          </h2>
          {step === 2 && (
            <button className="next-btn" onClick={goNext}>
              Next
            </button>
          )}
          {step === 3 && (
            <button 
              className="share-btn" 
              onClick={handlePost}
              disabled={isPosting}
            >
              {isPosting ? 'Sharing...' : 'Share'}
            </button>
          )}
        </div>

        <div className="modal-content">
          {step === 1 && (
            <div className="file-select">
              <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                <Upload size={48} />
                <h3>Drag photos and videos here</h3>
                <button className="select-btn">Select from computer</button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {step === 2 && (
            <div className="edit-step">
              <div className="image-preview">
                {previews.map((preview, index) => (
                  <div key={index} className="preview-item">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    {selectedFiles.length > 1 && (
                      <button 
                        className="remove-btn"
                        onClick={() => removeFile(index)}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="share-step">
              <div className="post-preview">
                <div className="preview-images">
                  {previews.map((preview, index) => (
                    <img key={index} src={preview} alt={`Post ${index + 1}`} />
                  ))}
                </div>
              </div>
              
              <div className="post-details">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.avatar || user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="username">{user.username}</span>
                </div>

                <div className="form-group">
                  <textarea
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="caption-input"
                    rows={4}
                    maxLength={2200}
                  />
                  <div className="char-count">{caption.length}/2,200</div>
                </div>

                <div className="form-group">
                  <div className="location-input">
                    <MapPin size={16} />
                    <input
                      type="text"
                      placeholder="Add location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="post-options">
                  <div className="option">
                    <span>Also post to Facebook</span>
                    <input type="checkbox" />
                  </div>
                  <div className="option">
                    <span>Also post to Twitter</span>
                    <input type="checkbox" />
                  </div>
                  <div className="option">
                    <span>Also post to Tumblr</span>
                    <input type="checkbox" />
                  </div>
                </div>

                <div className="advanced-settings">
                  <div className="setting">
                    <span>Turn off commenting</span>
                    <input type="checkbox" />
                  </div>
                  <div className="setting">
                    <span>Hide like and view counts</span>
                    <input type="checkbox" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
