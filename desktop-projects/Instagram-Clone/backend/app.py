"""
Instagram Clone Backend API
Social media platform with photo sharing, stories, and real-time interactions
Port: 5009
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
import sqlite3
import hashlib
import jwt
import datetime
from functools import wraps
import json
import base64
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'instagram-clone-secret-key-2024'
CORS(app, origins=['http://localhost:3000'])
socketio = SocketIO(app, cors_allowed_origins=['http://localhost:3000'])

# Database initialization
def init_db():
    conn = sqlite3.connect('instagram_clone.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            bio TEXT,
            avatar TEXT,
            website TEXT,
            phone_number TEXT,
            gender TEXT,
            is_verified BOOLEAN DEFAULT FALSE,
            is_private BOOLEAN DEFAULT FALSE,
            followers_count INTEGER DEFAULT 0,
            following_count INTEGER DEFAULT 0,
            posts_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Posts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            caption TEXT,
            location TEXT,
            image_urls TEXT,
            is_archived BOOLEAN DEFAULT FALSE,
            comments_disabled BOOLEAN DEFAULT FALSE,
            likes_count INTEGER DEFAULT 0,
            comments_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Likes table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            post_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (post_id) REFERENCES posts (id),
            UNIQUE(user_id, post_id)
        )
    ''')
    
    # Comments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            post_id INTEGER,
            parent_id INTEGER,
            content TEXT NOT NULL,
            likes_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (post_id) REFERENCES posts (id),
            FOREIGN KEY (parent_id) REFERENCES comments (id)
        )
    ''')
    
    # Follows table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS follows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            follower_id INTEGER,
            following_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (follower_id) REFERENCES users (id),
            FOREIGN KEY (following_id) REFERENCES users (id),
            UNIQUE(follower_id, following_id)
        )
    ''')
    
    # Stories table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            content_type TEXT DEFAULT 'image',
            content_url TEXT,
            text_overlay TEXT,
            background_color TEXT,
            music_id TEXT,
            expires_at TIMESTAMP,
            is_archived BOOLEAN DEFAULT FALSE,
            views_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Story views table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS story_views (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            story_id INTEGER,
            viewer_id INTEGER,
            viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (story_id) REFERENCES stories (id),
            FOREIGN KEY (viewer_id) REFERENCES users (id),
            UNIQUE(story_id, viewer_id)
        )
    ''')
    
    # Messages table (for DMs)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER,
            recipient_id INTEGER,
            content TEXT,
            message_type TEXT DEFAULT 'text',
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users (id),
            FOREIGN KEY (recipient_id) REFERENCES users (id)
        )
    ''')
    
    # Notifications table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            actor_id INTEGER,
            type TEXT NOT NULL,
            post_id INTEGER,
            message TEXT,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (actor_id) REFERENCES users (id),
            FOREIGN KEY (post_id) REFERENCES posts (id)
        )
    ''')
    
    # Saved posts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS saved_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            post_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (post_id) REFERENCES posts (id),
            UNIQUE(user_id, post_id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = data['user_id']
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user_id, *args, **kwargs)
    
    return decorated

# Helper functions
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

# Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    full_name = data.get('full_name')
    password = data.get('password')
    
    if not all([username, email, full_name, password]):
        return jsonify({'message': 'Missing required fields'}), 400
    
    conn = sqlite3.connect('instagram_clone.db')
    cursor = conn.cursor()
    
    # Check if user exists
    cursor.execute('SELECT id FROM users WHERE email = ? OR username = ?', (email, username))
    if cursor.fetchone():
        conn.close()
        return jsonify({'message': 'User already exists'}), 409
    
    # Create new user
    password_hash = hash_password(password)
    avatar = username[:2].upper()
    
    cursor.execute('''
        INSERT INTO users (username, email, full_name, password_hash, avatar)
        VALUES (?, ?, ?, ?, ?)
    ''', (username, email, full_name, password_hash, avatar))
    
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    token = generate_token(user_id)
    
    return jsonify({
        'message': 'User created successfully',
        'token': token,
        'user': {
            'id': user_id,
            'username': username,
            'email': email,
            'full_name': full_name,
            'avatar': avatar,
            'followers_count': 0,
            'following_count': 0,
            'posts_count': 0
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not all([username, password]):
        return jsonify({'message': 'Missing username or password'}), 400
    
    conn = sqlite3.connect('instagram_clone.db')
    cursor = conn.cursor()
    
    password_hash = hash_password(password)
    cursor.execute('''
        SELECT id, username, email, full_name, avatar, bio, is_verified,
               followers_count, following_count, posts_count
        FROM users 
        WHERE (username = ? OR email = ?) AND password_hash = ?
    ''', (username, username, password_hash))
    
    user = cursor.fetchone()
    if not user:
        conn.close()
        return jsonify({'message': 'Invalid credentials'}), 401
    
    conn.close()
    
    token = generate_token(user[0])
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user[0],
            'username': user[1],
            'email': user[2],
            'full_name': user[3],
            'avatar': user[4],
            'bio': user[5],
            'is_verified': bool(user[6]),
            'followers_count': user[7],
            'following_count': user[8],
            'posts_count': user[9]
        }
    }), 200

@app.route('/api/posts', methods=['GET'])
@token_required
def get_feed(current_user_id):
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    offset = (page - 1) * limit
    
    conn = sqlite3.connect('instagram_clone.db')
    cursor = conn.cursor()
    
    # Get posts from followed users and own posts
    cursor.execute('''
        SELECT p.id, p.caption, p.location, p.image_urls, p.likes_count, 
               p.comments_count, p.created_at,
               u.username, u.full_name, u.avatar, u.is_verified,
               l.id as is_liked, s.id as is_saved
        FROM posts p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN follows f ON p.user_id = f.following_id AND f.follower_id = ?
        LEFT JOIN likes l ON p.id = l.post_id AND l.user_id = ?
        LEFT JOIN saved_posts s ON p.id = s.post_id AND s.user_id = ?
        WHERE p.user_id = ? OR f.follower_id = ?
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
    ''', (current_user_id, current_user_id, current_user_id, current_user_id, current_user_id, limit, offset))
    
    posts = []
    for row in cursor.fetchall():
        # Get recent comments
        cursor.execute('''
            SELECT c.id, c.content, c.created_at, u.username, u.avatar
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at DESC
            LIMIT 2
        ''', (row[0],))
        
        comments = []
        for comment_row in cursor.fetchall():
            comments.append({
                'id': comment_row[0],
                'content': comment_row[1],
                'timestamp': comment_row[2],
                'user': {
                    'username': comment_row[3],
                    'avatar': comment_row[4]
                }
            })
        
        posts.append({
            'id': row[0],
            'caption': row[1],
            'location': row[2],
            'images': json.loads(row[3]) if row[3] else [],
            'likes_count': row[4],
            'comments_count': row[5],
            'timestamp': row[6],
            'user': {
                'username': row[7],
                'full_name': row[8],
                'avatar': row[9],
                'is_verified': bool(row[10])
            },
            'is_liked': row[11] is not None,
            'is_saved': row[12] is not None,
            'comments': comments
        })
    
    conn.close()
    return jsonify({'posts': posts}), 200

@app.route('/api/posts', methods=['POST'])
@token_required
def create_post(current_user_id):
    data = request.get_json()
    caption = data.get('caption', '')
    location = data.get('location', '')
    image_urls = data.get('image_urls', [])
    
    if not image_urls:
        return jsonify({'message': 'At least one image is required'}), 400
    
    conn = sqlite3.connect('instagram_clone.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO posts (user_id, caption, location, image_urls)
        VALUES (?, ?, ?, ?)
    ''', (current_user_id, caption, location, json.dumps(image_urls)))
    
    post_id = cursor.lastrowid
    
    # Update user's posts count
    cursor.execute('UPDATE users SET posts_count = posts_count + 1 WHERE id = ?', (current_user_id,))
    
    # Get user info for response
    cursor.execute('SELECT username, full_name, avatar, is_verified FROM users WHERE id = ?', (current_user_id,))
    user_info = cursor.fetchone()
    
    conn.commit()
    conn.close()
    
    post_data = {
        'id': post_id,
        'caption': caption,
        'location': location,
        'images': image_urls,
        'likes_count': 0,
        'comments_count': 0,
        'timestamp': datetime.datetime.utcnow().isoformat(),
        'user': {
            'username': user_info[0],
            'full_name': user_info[1],
            'avatar': user_info[2],
            'is_verified': bool(user_info[3])
        },
        'is_liked': False,
        'is_saved': False,
        'comments': []
    }
    
    # Emit to followers
    socketio.emit('new-post', post_data, broadcast=True)
    
    return jsonify({'message': 'Post created successfully', 'post': post_data}), 201

@app.route('/api/posts/<int:post_id>/like', methods=['POST'])
@token_required
def like_post(current_user_id, post_id):
    conn = sqlite3.connect('instagram_clone.db')
    cursor = conn.cursor()
    
    # Check if already liked
    cursor.execute('SELECT id FROM likes WHERE user_id = ? AND post_id = ?', (current_user_id, post_id))
    existing_like = cursor.fetchone()
    
    if existing_like:
        # Unlike
        cursor.execute('DELETE FROM likes WHERE user_id = ? AND post_id = ?', (current_user_id, post_id))
        cursor.execute('UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?', (post_id,))
        action = 'unliked'
    else:
        # Like
        cursor.execute('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', (current_user_id, post_id))
        cursor.execute('UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?', (post_id,))
        action = 'liked'
        
        # Create notification for post owner
        cursor.execute('SELECT user_id FROM posts WHERE id = ?', (post_id,))
        post_owner = cursor.fetchone()
        if post_owner and post_owner[0] != current_user_id:
            cursor.execute('''
                INSERT INTO notifications (user_id, actor_id, type, post_id, message)
                VALUES (?, ?, 'like', ?, 'liked your post')
            ''', (post_owner[0], current_user_id, post_id))
    
    conn.commit()
    conn.close()
    
    # Emit like/unlike event
    socketio.emit(f'post-{action}', {
        'post_id': post_id,
        'user_id': current_user_id
    }, broadcast=True)
    
    return jsonify({'message': f'Post {action} successfully'}), 200

@app.route('/api/posts/<int:post_id>/save', methods=['POST'])
@token_required
def save_post(current_user_id, post_id):
    conn = sqlite3.connect('instagram_clone.db')
    cursor = conn.cursor()
    
    # Check if already saved
    cursor.execute('SELECT id FROM saved_posts WHERE user_id = ? AND post_id = ?', (current_user_id, post_id))
    existing_save = cursor.fetchone()
    
    if existing_save:
        # Unsave
        cursor.execute('DELETE FROM saved_posts WHERE user_id = ? AND post_id = ?', (current_user_id, post_id))
        action = 'unsaved'
    else:
        # Save
        cursor.execute('INSERT INTO saved_posts (user_id, post_id) VALUES (?, ?)', (current_user_id, post_id))
        action = 'saved'
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': f'Post {action} successfully'}), 200

@app.route('/api/posts/<int:post_id>/comments', methods=['POST'])
@token_required
def add_comment(current_user_id, post_id):
    data = request.get_json()
    content = data.get('content')
    parent_id = data.get('parent_id')
    
    if not content:
        return jsonify({'message': 'Comment content is required'}), 400
    
    conn = sqlite3.connect('instagram_clone.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO comments (user_id, post_id, parent_id, content)
        VALUES (?, ?, ?, ?)
    ''', (current_user_id, post_id, parent_id, content))
    
    comment_id = cursor.lastrowid
    
    # Update post comments count
    cursor.execute('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?', (post_id,))
    
    # Get user info
    cursor.execute('SELECT username, avatar FROM users WHERE id = ?', (current_user_id,))
    user_info = cursor.fetchone()
    
    # Create notification for post owner
    cursor.execute('SELECT user_id FROM posts WHERE id = ?', (post_id,))
    post_owner = cursor.fetchone()
    if post_owner and post_owner[0] != current_user_id:
        cursor.execute('''
            INSERT INTO notifications (user_id, actor_id, type, post_id, message)
            VALUES (?, ?, 'comment', ?, 'commented on your post')
        ''', (post_owner[0], current_user_id, post_id))
    
    conn.commit()
    conn.close()
    
    comment_data = {
        'id': comment_id,
        'content': content,
        'timestamp': datetime.datetime.utcnow().isoformat(),
        'user': {
            'username': user_info[0],
            'avatar': user_info[1]
        },
        'post_id': post_id
    }
    
    # Emit comment event
    socketio.emit('new-comment', {
        'post_id': post_id,
        'comment': comment_data
    }, broadcast=True)
    
    return jsonify({'message': 'Comment added successfully', 'comment': comment_data}), 201

@app.route('/api/users/<username>', methods=['GET'])
@token_required
def get_user_profile(current_user_id, username):
    conn = sqlite3.connect('instagram_clone.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, username, full_name, bio, avatar, website, is_verified, is_private,
               followers_count, following_count, posts_count
        FROM users WHERE username = ?
    ''', (username,))
    
    user = cursor.fetchone()
    if not user:
        conn.close()
        return jsonify({'message': 'User not found'}), 404
    
    user_id = user[0]
    
    # Check if current user follows this user
    cursor.execute('SELECT id FROM follows WHERE follower_id = ? AND following_id = ?', 
                  (current_user_id, user_id))
    is_following = cursor.fetchone() is not None
    
    # Get user's posts (if public or following)
    posts = []
    if not user[7] or is_following or user_id == current_user_id:  # not private or following or own profile
        cursor.execute('''
            SELECT id, image_urls, likes_count, comments_count, created_at
            FROM posts WHERE user_id = ?
            ORDER BY created_at DESC
        ''', (user_id,))
        
        for post_row in cursor.fetchall():
            posts.append({
                'id': post_row[0],
                'images': json.loads(post_row[1]) if post_row[1] else [],
                'likes_count': post_row[2],
                'comments_count': post_row[3],
                'timestamp': post_row[4]
            })
    
    conn.close()
    
    profile_data = {
        'id': user_id,
        'username': user[1],
        'full_name': user[2],
        'bio': user[3],
        'avatar': user[4],
        'website': user[5],
        'is_verified': bool(user[6]),
        'is_private': bool(user[7]),
        'followers_count': user[8],
        'following_count': user[9],
        'posts_count': user[10],
        'is_following': is_following,
        'is_own_profile': user_id == current_user_id,
        'posts': posts
    }
    
    return jsonify({'user': profile_data}), 200

@app.route('/api/notifications', methods=['GET'])
@token_required
def get_notifications(current_user_id):
    conn = sqlite3.connect('instagram_clone.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT n.id, n.type, n.message, n.is_read, n.created_at,
               u.username, u.avatar, p.image_urls
        FROM notifications n
        JOIN users u ON n.actor_id = u.id
        LEFT JOIN posts p ON n.post_id = p.id
        WHERE n.user_id = ?
        ORDER BY n.created_at DESC
        LIMIT 50
    ''', (current_user_id,))
    
    notifications = []
    for row in cursor.fetchall():
        notification = {
            'id': row[0],
            'type': row[1],
            'message': row[2],
            'is_read': bool(row[3]),
            'timestamp': row[4],
            'actor': {
                'username': row[5],
                'avatar': row[6]
            }
        }
        
        if row[7]:  # Has post image
            images = json.loads(row[7])
            notification['post_image'] = images[0] if images else None
        
        notifications.append(notification)
    
    conn.close()
    return jsonify({'notifications': notifications}), 200

# Socket.IO events
@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')

@socketio.on('user-online')
def handle_user_online(data):
    user_id = data.get('id')
    emit('user-status-changed', {'user_id': user_id, 'status': 'online'}, broadcast=True)

@socketio.on('like-post')
def handle_like_post(data):
    emit('post-liked', data, broadcast=True, include_self=False)

@socketio.on('unlike-post')
def handle_unlike_post(data):
    emit('post-unliked', data, broadcast=True, include_self=False)

@socketio.on('add-comment')
def handle_add_comment(data):
    emit('new-comment', data, broadcast=True, include_self=False)

@socketio.on('create-post')
def handle_create_post(data):
    emit('new-post', data, broadcast=True, include_self=False)

if __name__ == '__main__':
    init_db()
    print("Instagram Clone Backend starting on port 5009...")
    socketio.run(app, debug=True, host='0.0.0.0', port=5009)
