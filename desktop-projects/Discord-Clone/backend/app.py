"""
Discord Clone Backend API
Real-time gaming communication platform with voice channels and server management
Port: 5007
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

app = Flask(__name__)
app.config['SECRET_KEY'] = 'discord-clone-secret-key-2024'
CORS(app, origins=['http://localhost:3000'])
socketio = SocketIO(app, cors_allowed_origins=['http://localhost:3000'])

# Database initialization
def init_db():
    conn = sqlite3.connect('discord_clone.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            avatar TEXT,
            status TEXT DEFAULT 'offline',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Servers table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS servers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            icon TEXT,
            owner_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES users (id)
        )
    ''')
    
    # Channels table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS channels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            topic TEXT,
            server_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (server_id) REFERENCES servers (id)
        )
    ''')
    
    # Messages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            user_id INTEGER,
            channel_id INTEGER,
            message_type TEXT DEFAULT 'text',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (channel_id) REFERENCES channels (id)
        )
    ''')
    
    # Server members table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS server_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            server_id INTEGER,
            role TEXT DEFAULT 'member',
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (server_id) REFERENCES servers (id)
        )
    ''')
    
    # Voice sessions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS voice_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            channel_id INTEGER,
            is_muted BOOLEAN DEFAULT FALSE,
            is_deafened BOOLEAN DEFAULT FALSE,
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (channel_id) REFERENCES channels (id)
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
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

# Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not all([username, email, password]):
        return jsonify({'message': 'Missing required fields'}), 400
    
    conn = sqlite3.connect('discord_clone.db')
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
        INSERT INTO users (username, email, password_hash, avatar, status)
        VALUES (?, ?, ?, ?, ?)
    ''', (username, email, password_hash, avatar, 'online'))
    
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
            'avatar': avatar,
            'status': 'online'
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not all([email, password]):
        return jsonify({'message': 'Missing email or password'}), 400
    
    conn = sqlite3.connect('discord_clone.db')
    cursor = conn.cursor()
    
    password_hash = hash_password(password)
    cursor.execute('''
        SELECT id, username, email, avatar FROM users 
        WHERE email = ? AND password_hash = ?
    ''', (email, password_hash))
    
    user = cursor.fetchone()
    if not user:
        conn.close()
        return jsonify({'message': 'Invalid credentials'}), 401
    
    # Update user status to online
    cursor.execute('UPDATE users SET status = ? WHERE id = ?', ('online', user[0]))
    conn.commit()
    conn.close()
    
    token = generate_token(user[0])
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user[0],
            'username': user[1],
            'email': user[2],
            'avatar': user[3],
            'status': 'online'
        }
    }), 200

@app.route('/api/servers', methods=['GET'])
@token_required
def get_servers(current_user_id):
    conn = sqlite3.connect('discord_clone.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT s.id, s.name, s.description, s.icon, s.owner_id
        FROM servers s
        JOIN server_members sm ON s.id = sm.server_id
        WHERE sm.user_id = ?
    ''', (current_user_id,))
    
    servers = []
    for row in cursor.fetchall():
        server_id = row[0]
        
        # Get channels for this server
        cursor.execute('''
            SELECT id, name, type, topic FROM channels 
            WHERE server_id = ? ORDER BY type, name
        ''', (server_id,))
        
        channels = []
        for channel_row in cursor.fetchall():
            channels.append({
                'id': channel_row[0],
                'name': channel_row[1],
                'type': channel_row[2],
                'topic': channel_row[3]
            })
        
        servers.append({
            'id': row[0],
            'name': row[1],
            'description': row[2],
            'icon': row[3],
            'owner_id': row[4],
            'channels': channels
        })
    
    conn.close()
    return jsonify({'servers': servers}), 200

@app.route('/api/channels/<int:channel_id>/messages', methods=['GET'])
@token_required
def get_messages(current_user_id, channel_id):
    conn = sqlite3.connect('discord_clone.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT m.id, m.content, m.message_type, m.created_at, u.username, u.avatar
        FROM messages m
        JOIN users u ON m.user_id = u.id
        WHERE m.channel_id = ?
        ORDER BY m.created_at DESC
        LIMIT 50
    ''', (channel_id,))
    
    messages = []
    for row in cursor.fetchall():
        messages.append({
            'id': row[0],
            'content': row[1],
            'type': row[2],
            'timestamp': row[3],
            'author': {
                'username': row[4],
                'avatar': row[5]
            }
        })
    
    conn.close()
    messages.reverse()  # Show oldest first
    return jsonify({'messages': messages}), 200

@app.route('/api/channels/<int:channel_id>/messages', methods=['POST'])
@token_required
def send_message(current_user_id, channel_id):
    data = request.get_json()
    content = data.get('content')
    message_type = data.get('type', 'text')
    
    if not content:
        return jsonify({'message': 'Content is required'}), 400
    
    conn = sqlite3.connect('discord_clone.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO messages (content, user_id, channel_id, message_type)
        VALUES (?, ?, ?, ?)
    ''', (content, current_user_id, channel_id, message_type))
    
    message_id = cursor.lastrowid
    
    # Get user info for the response
    cursor.execute('SELECT username, avatar FROM users WHERE id = ?', (current_user_id,))
    user_info = cursor.fetchone()
    
    conn.commit()
    conn.close()
    
    message_data = {
        'id': message_id,
        'content': content,
        'type': message_type,
        'timestamp': datetime.datetime.utcnow().isoformat(),
        'author': {
            'username': user_info[0],
            'avatar': user_info[1]
        },
        'channelId': channel_id
    }
    
    # Emit to all clients in the channel
    socketio.emit('new-message', message_data, room=f'channel-{channel_id}')
    
    return jsonify({'message': 'Message sent successfully', 'data': message_data}), 201

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
    if user_id:
        conn = sqlite3.connect('discord_clone.db')
        cursor = conn.cursor()
        cursor.execute('UPDATE users SET status = ? WHERE id = ?', ('online', user_id))
        conn.commit()
        conn.close()
        emit('user-joined', data, broadcast=True)

@socketio.on('user-offline')
def handle_user_offline(data):
    user_id = data.get('id')
    if user_id:
        conn = sqlite3.connect('discord_clone.db')
        cursor = conn.cursor()
        cursor.execute('UPDATE users SET status = ? WHERE id = ?', ('offline', user_id))
        conn.commit()
        conn.close()
        emit('user-left', data, broadcast=True)

@socketio.on('join-channel')
def handle_join_channel(data):
    channel_id = data.get('channelId')
    if channel_id:
        join_room(f'channel-{channel_id}')
        print(f'User joined channel {channel_id}')

@socketio.on('leave-channel')
def handle_leave_channel(data):
    channel_id = data.get('channelId')
    if channel_id:
        leave_room(f'channel-{channel_id}')
        print(f'User left channel {channel_id}')

@socketio.on('send-message')
def handle_send_message(data):
    channel_id = data.get('channelId')
    if channel_id:
        emit('new-message', data, room=f'channel-{channel_id}', include_self=False)

@socketio.on('typing-start')
def handle_typing_start(data):
    channel_id = data.get('channelId')
    if channel_id:
        emit('user-typing', data, room=f'channel-{channel_id}', include_self=False)

@socketio.on('join-voice-channel')
def handle_join_voice(data):
    user_id = data.get('userId')
    channel_id = data.get('channelId')
    
    if user_id and channel_id:
        conn = sqlite3.connect('discord_clone.db')
        cursor = conn.cursor()
        
        # Add to voice session
        cursor.execute('''
            INSERT OR REPLACE INTO voice_sessions (user_id, channel_id)
            VALUES (?, ?)
        ''', (user_id, channel_id))
        
        conn.commit()
        conn.close()
        
        join_room(f'voice-{channel_id}')
        emit('voice-user-joined', data, room=f'voice-{channel_id}', include_self=False)

@socketio.on('leave-voice-channel')
def handle_leave_voice(data):
    user_id = data.get('userId')
    
    if user_id:
        conn = sqlite3.connect('discord_clone.db')
        cursor = conn.cursor()
        
        # Remove from voice session
        cursor.execute('DELETE FROM voice_sessions WHERE user_id = ?', (user_id,))
        
        conn.commit()
        conn.close()
        
        emit('voice-user-left', {'userId': user_id}, broadcast=True)

@socketio.on('voice-mute-status')
def handle_voice_mute(data):
    user_id = data.get('userId')
    is_muted = data.get('isMuted')
    is_deafened = data.get('isDeafened')
    
    if user_id is not None:
        conn = sqlite3.connect('discord_clone.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE voice_sessions 
            SET is_muted = ?, is_deafened = ? 
            WHERE user_id = ?
        ''', (is_muted, is_deafened, user_id))
        
        conn.commit()
        conn.close()
        
        emit('voice-user-muted', data, broadcast=True, include_self=False)

if __name__ == '__main__':
    init_db()
    print("Discord Clone Backend starting on port 5007...")
    socketio.run(app, debug=True, host='0.0.0.0', port=5007)
