# YouTube Clone - Python Backend API
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import sqlite3
from datetime import datetime, timedelta
import json
import hashlib
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
import os
import base64
import cv2
import numpy as np
from moviepy.editor import VideoFileClip
import requests

app = Flask(__name__)
app.config["SECRET_KEY"] = "youtube_clone_secret_key_2025"
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Database setup
def init_db():
    conn = sqlite3.connect("youtube.db")
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            channel_name TEXT,
            avatar TEXT,
            banner TEXT,
            description TEXT,
            subscribers_count INTEGER DEFAULT 0,
            videos_count INTEGER DEFAULT 0,
            views_count INTEGER DEFAULT 0,
            verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT NOT NULL,
            description TEXT,
            video_url TEXT NOT NULL,
            thumbnail TEXT,
            duration INTEGER,
            views_count INTEGER DEFAULT 0,
            likes_count INTEGER DEFAULT 0,
            dislikes_count INTEGER DEFAULT 0,
            comments_count INTEGER DEFAULT 0,
            category TEXT,
            tags TEXT,
            privacy TEXT DEFAULT "public",
            upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            video_id INTEGER,
            user_id INTEGER,
            text TEXT NOT NULL,
            likes_count INTEGER DEFAULT 0,
            reply_to INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (video_id) REFERENCES videos (id),
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (reply_to) REFERENCES comments (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            video_id INTEGER,
            type TEXT CHECK(type IN ('like', 'dislike')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (video_id) REFERENCES videos (id),
            UNIQUE(user_id, video_id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subscriber_id INTEGER,
            channel_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (subscriber_id) REFERENCES users (id),
            FOREIGN KEY (channel_id) REFERENCES users (id),
            UNIQUE(subscriber_id, channel_id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS playlists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT NOT NULL,
            description TEXT,
            privacy TEXT DEFAULT "public",
            thumbnail TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS playlist_videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            playlist_id INTEGER,
            video_id INTEGER,
            position INTEGER,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (playlist_id) REFERENCES playlists (id),
            FOREIGN KEY (video_id) REFERENCES videos (id),
            UNIQUE(playlist_id, video_id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS watch_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            video_id INTEGER,
            watch_time INTEGER DEFAULT 0,
            completed BOOLEAN DEFAULT FALSE,
            last_watched TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (video_id) REFERENCES videos (id)
        )
    """)
    
    # Insert sample data
    sample_users = [
        ("ritesh_tech", "ritesh@youtube.com", generate_password_hash("password123"), "Ritesh Tech Channel", "/images/ritesh_avatar.jpg", "/images/ritesh_banner.jpg", "Full Stack Developer sharing coding tutorials", 125000, 45, 2500000, True),
        ("tech_guru", "tech@youtube.com", generate_password_hash("password123"), "Tech Guru", "/images/tech_avatar.jpg", "/images/tech_banner.jpg", "Latest technology reviews and tutorials", 98000, 23, 1800000, False),
        ("coding_academy", "academy@youtube.com", generate_password_hash("password123"), "Coding Academy", "/images/academy_avatar.jpg", "/images/academy_banner.jpg", "Learn programming from basics to advanced", 250000, 67, 5200000, True)
    ]
    
    for user in sample_users:
        cursor.execute("""
            INSERT OR IGNORE INTO users (username, email, password_hash, channel_name, avatar, banner, description, subscribers_count, videos_count, views_count, verified)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, user)
    
    # Sample videos
    sample_videos = [
        (1, "Python Full Course - Learn Python in 12 Hours", "Complete Python programming tutorial covering all concepts from basics to advanced topics.", "/videos/python_course.mp4", "/thumbnails/python_course.jpg", 43200, 285000, 12500, 150, 890, "Education", "python,programming,tutorial,coding", "public"),
        (1, "React JS Crash Course 2025", "Learn React JS from scratch in this comprehensive crash course.", "/videos/react_course.mp4", "/thumbnails/react_course.jpg", 25200, 156000, 8900, 89, 567, "Education", "react,javascript,frontend,web development", "public"),
        (2, "Best Laptops for Programming 2025", "Review of the top 10 laptops perfect for programming and development.", "/videos/laptop_review.mp4", "/thumbnails/laptop_review.jpg", 1260, 45000, 2100, 45, 234, "Technology", "laptop,programming,review,tech", "public"),
        (3, "Data Structures and Algorithms", "Complete guide to DSA concepts with practical examples.", "/videos/dsa_course.mp4", "/thumbnails/dsa_course.jpg", 32400, 198000, 9800, 120, 445, "Education", "data structures,algorithms,coding,interview", "public")
    ]
    
    for video in sample_videos:
        cursor.execute("""
            INSERT OR IGNORE INTO videos (user_id, title, description, video_url, thumbnail, duration, views_count, likes_count, dislikes_count, comments_count, category, tags, privacy)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, video)
    
    conn.commit()
    conn.close()

class VideoProcessor:
    @staticmethod
    def extract_thumbnail(video_path, time_offset=30):
        """Extract thumbnail from video at specified time"""
        try:
            with VideoFileClip(video_path) as video:
                frame = video.get_frame(time_offset)
                # Convert to base64
                cv2_frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
                _, buffer = cv2.imencode('.jpg', cv2_frame)
                thumbnail = base64.b64encode(buffer).decode()
                return f"data:image/jpeg;base64,{thumbnail}"
        except Exception as e:
            return None
    
    @staticmethod
    def get_video_duration(video_path):
        """Get video duration in seconds"""
        try:
            with VideoFileClip(video_path) as video:
                return int(video.duration)
        except Exception as e:
            return 0
    
    @staticmethod
    def generate_video_preview(video_path, intervals=10):
        """Generate video preview images at different intervals"""
        try:
            previews = []
            with VideoFileClip(video_path) as video:
                duration = video.duration
                step = duration / intervals
                
                for i in range(intervals):
                    time_point = i * step
                    frame = video.get_frame(time_point)
                    cv2_frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
                    _, buffer = cv2.imencode('.jpg', cv2_frame)
                    preview = base64.b64encode(buffer).decode()
                    previews.append({
                        "time": time_point,
                        "image": f"data:image/jpeg;base64,{preview}"
                    })
            
            return previews
        except Exception as e:
            return []

class RecommendationSystem:
    @staticmethod
    def get_recommendations(user_id, limit=20):
        """Generate video recommendations based on watch history"""
        conn = sqlite3.connect("youtube.db")
        cursor = conn.cursor()
        
        # Get user's watch history to understand preferences
        cursor.execute("""
            SELECT v.category, v.tags FROM videos v
            JOIN watch_history wh ON v.id = wh.video_id
            WHERE wh.user_id = ?
            ORDER BY wh.last_watched DESC LIMIT 10
        """, (user_id,))
        
        history = cursor.fetchall()
        
        # Extract categories and tags
        categories = []
        tags = []
        
        for category, video_tags in history:
            if category:
                categories.append(category)
            if video_tags:
                tags.extend(video_tags.split(','))
        
        # Get recommendations based on popular categories and tags
        recommendations = []
        
        if categories or tags:
            category_condition = " OR ".join([f"category = '{cat}'" for cat in set(categories)[:3]])
            tag_condition = " OR ".join([f"tags LIKE '%{tag.strip()}%'" for tag in set(tags)[:5]])
            
            where_clause = ""
            if category_condition and tag_condition:
                where_clause = f"WHERE ({category_condition}) OR ({tag_condition})"
            elif category_condition:
                where_clause = f"WHERE {category_condition}"
            elif tag_condition:
                where_clause = f"WHERE {tag_condition}"
            
            if where_clause:
                cursor.execute(f"""
                    SELECT v.id, v.title, v.thumbnail, v.views_count, v.duration, u.channel_name, u.avatar
                    FROM videos v
                    JOIN users u ON v.user_id = u.id
                    {where_clause}
                    ORDER BY v.views_count DESC, v.likes_count DESC
                    LIMIT ?
                """, (limit,))
            else:
                # Fallback to trending videos
                cursor.execute("""
                    SELECT v.id, v.title, v.thumbnail, v.views_count, v.duration, u.channel_name, u.avatar
                    FROM videos v
                    JOIN users u ON v.user_id = u.id
                    ORDER BY v.views_count DESC, v.upload_date DESC
                    LIMIT ?
                """, (limit,))
        else:
            # No history, return trending videos
            cursor.execute("""
                SELECT v.id, v.title, v.thumbnail, v.views_count, v.duration, u.channel_name, u.avatar
                FROM videos v
                JOIN users u ON v.user_id = u.id
                ORDER BY v.views_count DESC, v.upload_date DESC
                LIMIT ?
            """, (limit,))
        
        for row in cursor.fetchall():
            recommendations.append({
                "id": row[0],
                "title": row[1],
                "thumbnail": row[2],
                "views": row[3],
                "duration": row[4],
                "channel": row[5],
                "channel_avatar": row[6]
            })
        
        conn.close()
        return recommendations

# API Routes
@app.route("/api/videos", methods=["GET"])
def get_videos():
    """Get videos with filtering options"""
    category = request.args.get("category")
    search = request.args.get("search")
    user_id = request.args.get("user_id")
    
    conn = sqlite3.connect("youtube.db")
    cursor = conn.cursor()
    
    query = """
        SELECT v.id, v.title, v.description, v.thumbnail, v.duration, v.views_count, 
               v.likes_count, v.upload_date, v.category, u.channel_name, u.avatar, u.verified
        FROM videos v
        JOIN users u ON v.user_id = u.id
        WHERE v.privacy = 'public'
    """
    params = []
    
    if category:
        query += " AND v.category = ?"
        params.append(category)
    
    if search:
        query += " AND (v.title LIKE ? OR v.description LIKE ? OR v.tags LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])
    
    if user_id:
        query += " AND v.user_id = ?"
        params.append(user_id)
    
    query += " ORDER BY v.upload_date DESC"
    
    cursor.execute(query, params)
    videos = []
    
    for row in cursor.fetchall():
        videos.append({
            "id": row[0],
            "title": row[1],
            "description": row[2],
            "thumbnail": row[3],
            "duration": row[4],
            "views": row[5],
            "likes": row[6],
            "upload_date": row[7],
            "category": row[8],
            "channel": {
                "name": row[9],
                "avatar": row[10],
                "verified": bool(row[11])
            }
        })
    
    conn.close()
    return jsonify(videos)

@app.route("/api/videos/<int:video_id>", methods=["GET"])
def get_video(video_id):
    """Get single video details"""
    conn = sqlite3.connect("youtube.db")
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT v.*, u.channel_name, u.avatar, u.verified, u.subscribers_count
        FROM videos v
        JOIN users u ON v.user_id = u.id
        WHERE v.id = ?
    """, (video_id,))
    
    video = cursor.fetchone()
    if not video:
        return jsonify({"error": "Video not found"}), 404
    
    # Increment view count
    cursor.execute("UPDATE videos SET views_count = views_count + 1 WHERE id = ?", (video_id,))
    conn.commit()
    
    video_data = {
        "id": video[0],
        "title": video[2],
        "description": video[3],
        "video_url": video[4],
        "thumbnail": video[5],
        "duration": video[6],
        "views": video[7] + 1,
        "likes": video[8],
        "dislikes": video[9],
        "comments_count": video[10],
        "category": video[11],
        "tags": video[12].split(',') if video[12] else [],
        "upload_date": video[14],
        "channel": {
            "name": video[15],
            "avatar": video[16],
            "verified": bool(video[17]),
            "subscribers": video[18]
        }
    }
    
    conn.close()
    return jsonify(video_data)

@app.route("/api/videos/<int:video_id>/comments", methods=["GET", "POST"])
def handle_comments(video_id):
    """Get or post comments for a video"""
    conn = sqlite3.connect("youtube.db")
    cursor = conn.cursor()
    
    if request.method == "GET":
        cursor.execute("""
            SELECT c.id, c.text, c.likes_count, c.created_at, c.reply_to,
                   u.username, u.avatar
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.video_id = ?
            ORDER BY c.created_at DESC
        """, (video_id,))
        
        comments = []
        for row in cursor.fetchall():
            comments.append({
                "id": row[0],
                "text": row[1],
                "likes": row[2],
                "created_at": row[3],
                "reply_to": row[4],
                "user": {
                    "username": row[5],
                    "avatar": row[6]
                }
            })
        
        conn.close()
        return jsonify(comments)
    
    elif request.method == "POST":
        data = request.json
        cursor.execute("""
            INSERT INTO comments (video_id, user_id, text, reply_to)
            VALUES (?, ?, ?, ?)
        """, (video_id, data["user_id"], data["text"], data.get("reply_to")))
        
        cursor.execute("UPDATE videos SET comments_count = comments_count + 1 WHERE id = ?", (video_id,))
        comment_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        # Emit real-time comment
        socketio.emit("new_comment", {
            "video_id": video_id,
            "comment_id": comment_id,
            "user_id": data["user_id"],
            "text": data["text"],
            "timestamp": datetime.now().isoformat()
        })
        
        return jsonify({"id": comment_id, "message": "Comment posted"}), 201

@app.route("/api/videos/<int:video_id>/like", methods=["POST"])
def like_video(video_id):
    """Like or dislike a video"""
    data = request.json
    user_id = data["user_id"]
    like_type = data["type"]  # 'like' or 'dislike'
    
    conn = sqlite3.connect("youtube.db")
    cursor = conn.cursor()
    
    # Check if user already liked/disliked
    cursor.execute("SELECT type FROM likes WHERE user_id = ? AND video_id = ?", (user_id, video_id))
    existing = cursor.fetchone()
    
    if existing:
        if existing[0] == like_type:
            # Remove like/dislike
            cursor.execute("DELETE FROM likes WHERE user_id = ? AND video_id = ?", (user_id, video_id))
            if like_type == "like":
                cursor.execute("UPDATE videos SET likes_count = likes_count - 1 WHERE id = ?", (video_id,))
            else:
                cursor.execute("UPDATE videos SET dislikes_count = dislikes_count - 1 WHERE id = ?", (video_id,))
            action = "removed"
        else:
            # Change like to dislike or vice versa
            cursor.execute("UPDATE likes SET type = ? WHERE user_id = ? AND video_id = ?", (like_type, user_id, video_id))
            if like_type == "like":
                cursor.execute("UPDATE videos SET likes_count = likes_count + 1, dislikes_count = dislikes_count - 1 WHERE id = ?", (video_id,))
            else:
                cursor.execute("UPDATE videos SET dislikes_count = dislikes_count + 1, likes_count = likes_count - 1 WHERE id = ?", (video_id,))
            action = "changed"
    else:
        # New like/dislike
        cursor.execute("INSERT INTO likes (user_id, video_id, type) VALUES (?, ?, ?)", (user_id, video_id, like_type))
        if like_type == "like":
            cursor.execute("UPDATE videos SET likes_count = likes_count + 1 WHERE id = ?", (video_id,))
        else:
            cursor.execute("UPDATE videos SET dislikes_count = dislikes_count + 1 WHERE id = ?", (video_id,))
        action = "added"
    
    conn.commit()
    conn.close()
    
    return jsonify({"action": action, "type": like_type})

@app.route("/api/recommendations/<int:user_id>", methods=["GET"])
def get_recommendations(user_id):
    """Get personalized video recommendations"""
    recommendations = RecommendationSystem.get_recommendations(user_id)
    return jsonify(recommendations)

# WebSocket events for real-time features
@socketio.on("connect")
def handle_connect():
    """Handle client connection"""
    print("YouTube client connected")
    emit("status", {"message": "Connected to YouTube Clone API"})

@socketio.on("watch_progress")
def handle_watch_progress(data):
    """Handle video watch progress updates"""
    # Update watch history in database
    conn = sqlite3.connect("youtube.db")
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT OR REPLACE INTO watch_history (user_id, video_id, watch_time, completed)
        VALUES (?, ?, ?, ?)
    """, (data["user_id"], data["video_id"], data["watch_time"], data["completed"]))
    
    conn.commit()
    conn.close()
    
    emit("progress_saved", {"video_id": data["video_id"], "progress": data["watch_time"]})

if __name__ == "__main__":
    init_db()
    print("📺 YouTube Clone Python API Server starting...")
    print("🗄️  Database initialized")
    print("🎥 Video processing ready")
    print("🚀 Server running on http://localhost:5004")
    socketio.run(app, debug=True, host="0.0.0.0", port=5004)
