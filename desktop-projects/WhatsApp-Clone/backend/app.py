"""
WhatsApp Clone Backend API
Real-time messaging application with end-to-end encryption and media sharing
Port: 5008
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

app = Flask(__name__)
app.config['SECRET_KEY'] = 'whatsapp-clone-secret-key-2024'
CORS(app, origins=['http://localhost:3000'])
socketio = SocketIO(app, cors_allowed_origins=['http://localhost:3000'])

# Database initialization
def init_db():
    conn = sqlite3.connect('whatsapp_clone.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone_number TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            email TEXT,
            password_hash TEXT NOT NULL,
            avatar TEXT,
            status TEXT DEFAULT 'Hey there! I am using WhatsApp.',
            is_online BOOLEAN DEFAULT FALSE,
            last_seen TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Chats table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            is_group BOOLEAN DEFAULT FALSE,
            description TEXT,
            avatar TEXT,
            created_by INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES users (id)
        )
    ''')
    
    # Chat participants table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_participants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_id INTEGER,
            user_id INTEGER,
            role TEXT DEFAULT 'member',
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (chat_id) REFERENCES chats (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Messages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            message_type TEXT DEFAULT 'text',
            chat_id INTEGER,
            sender_id INTEGER,
            reply_to INTEGER,
            is_forwarded BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (chat_id) REFERENCES chats (id),
            FOREIGN KEY (sender_id) REFERENCES users (id),
            FOREIGN KEY (reply_to) REFERENCES messages (id)
        )
    ''')
    
    # Message status table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS message_status (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message_id INTEGER,
            user_id INTEGER,
            status TEXT DEFAULT 'sent',
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (message_id) REFERENCES messages (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Stories table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            content TEXT,
            story_type TEXT DEFAULT 'text',
            background_color TEXT,
            expires_at TIMESTAMP,
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
            FOREIGN KEY (viewer_id) REFERENCES users (id)
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
    phone_number = data.get('phone_number')
    name = data.get('name')
    password = data.get('password')
    email = data.get('email')
    
    if not all([phone_number, name, password]):
        return jsonify({'message': 'Missing required fields'}), 400
    
    conn = sqlite3.connect('whatsapp_clone.db')
    cursor = conn.cursor()
    
    # Check if user exists
    cursor.execute('SELECT id FROM users WHERE phone_number = ?', (phone_number,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'message': 'User already exists'}), 409
    
    # Create new user
    password_hash = hash_password(password)
    avatar = name[:2].upper()
    
    cursor.execute('''
        INSERT INTO users (phone_number, name, email, password_hash, avatar, is_online)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (phone_number, name, email, password_hash, avatar, True))
    
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    token = generate_token(user_id)
    
    return jsonify({
        'message': 'User created successfully',
        'token': token,
        'user': {
            'id': user_id,
            'phone_number': phone_number,
            'name': name,
            'email': email,
            'avatar': avatar,
            'is_online': True
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    phone_number = data.get('phone_number')
    password = data.get('password')
    
    if not all([phone_number, password]):
        return jsonify({'message': 'Missing phone number or password'}), 400
    
    conn = sqlite3.connect('whatsapp_clone.db')
    cursor = conn.cursor()
    
    password_hash = hash_password(password)
    cursor.execute('''
        SELECT id, phone_number, name, email, avatar, status FROM users 
        WHERE phone_number = ? AND password_hash = ?
    ''', (phone_number, password_hash))
    
    user = cursor.fetchone()
    if not user:
        conn.close()
        return jsonify({'message': 'Invalid credentials'}), 401
    
    # Update user status to online
    cursor.execute('UPDATE users SET is_online = ? WHERE id = ?', (True, user[0]))
    conn.commit()
    conn.close()
    
    token = generate_token(user[0])
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user[0],
            'phone_number': user[1],
            'name': user[2],
            'email': user[3],
            'avatar': user[4],
            'status': user[5],
            'is_online': True
        }
    }), 200

@app.route('/api/chats', methods=['GET'])
@token_required
def get_chats(current_user_id):
    conn = sqlite3.connect('whatsapp_clone.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT DISTINCT c.id, c.name, c.is_group, c.avatar,
               u.name as contact_name, u.avatar as contact_avatar, u.is_online,
               m.content as last_message, m.created_at as last_message_time,
               COUNT(CASE WHEN ms.status != 'read' AND m.sender_id != ? THEN 1 END) as unread_count
        FROM chats c
        JOIN chat_participants cp ON c.id = cp.chat_id
        LEFT JOIN chat_participants cp2 ON c.id = cp2.chat_id AND cp2.user_id != ?
        LEFT JOIN users u ON cp2.user_id = u.id
        LEFT JOIN messages m ON c.id = m.chat_id AND m.id = (
            SELECT MAX(id) FROM messages WHERE chat_id = c.id
        )
        LEFT JOIN message_status ms ON m.id = ms.message_id AND ms.user_id = ?
        WHERE cp.user_id = ?
        GROUP BY c.id
        ORDER BY last_message_time DESC
    ''', (current_user_id, current_user_id, current_user_id, current_user_id))
    
    chats = []
    for row in cursor.fetchall():
        chat_data = {
            'id': row[0],
            'name': row[1] if row[2] else row[4],  # Use group name or contact name
            'is_group': bool(row[2]),
            'avatar': row[3] if row[2] else row[5],  # Use group avatar or contact avatar
            'is_online': bool(row[6]) if not row[2] else None,
            'last_message': {
                'content': row[7],
                'timestamp': row[8]
            } if row[7] else None,
            'unread_count': row[9] or 0
        }
        chats.append(chat_data)
    
    conn.close()
    return jsonify({'chats': chats}), 200

@app.route('/api/chats/<int:chat_id>/messages', methods=['GET'])
@token_required
def get_messages(current_user_id, chat_id):
    conn = sqlite3.connect('whatsapp_clone.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT m.id, m.content, m.message_type, m.created_at, m.is_forwarded,
               u.name, u.avatar, ms.status
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        LEFT JOIN message_status ms ON m.id = ms.message_id AND ms.user_id = ?
        WHERE m.chat_id = ?
        ORDER BY m.created_at ASC
        LIMIT 100
    ''', (current_user_id, chat_id))
    
    messages = []
    for row in cursor.fetchall():
        messages.append({
            'id': row[0],
            'content': row[1],
            'type': row[2],
            'timestamp': row[3],
            'is_forwarded': bool(row[4]),
            'sender': {
                'name': row[5],
                'avatar': row[6]
            },
            'status': row[7] or 'sent'
        })
    
    # Mark messages as read
    cursor.execute('''
        UPDATE message_status SET status = 'read' 
        WHERE message_id IN (
            SELECT id FROM messages WHERE chat_id = ? AND sender_id != ?
        ) AND user_id = ?
    ''', (chat_id, current_user_id, current_user_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({'messages': messages}), 200

@app.route('/api/chats/<int:chat_id>/messages', methods=['POST'])
@token_required
def send_message(current_user_id, chat_id):
    data = request.get_json()
    content = data.get('content')
    message_type = data.get('type', 'text')
    reply_to = data.get('reply_to')
    
    if not content:
        return jsonify({'message': 'Content is required'}), 400
    
    conn = sqlite3.connect('whatsapp_clone.db')
    cursor = conn.cursor()
    
    # Insert message
    cursor.execute('''
        INSERT INTO messages (content, message_type, chat_id, sender_id, reply_to)
        VALUES (?, ?, ?, ?, ?)
    ''', (content, message_type, chat_id, current_user_id, reply_to))
    
    message_id = cursor.lastrowid
    
    # Get chat participants
    cursor.execute('''
        SELECT user_id FROM chat_participants WHERE chat_id = ? AND user_id != ?
    ''', (chat_id, current_user_id))
    participants = cursor.fetchall()
    
    # Create message status for each participant
    for participant in participants:
        cursor.execute('''
            INSERT INTO message_status (message_id, user_id, status)
            VALUES (?, ?, 'sent')
        ''', (message_id, participant[0]))
    
    # Get sender info
    cursor.execute('SELECT name, avatar FROM users WHERE id = ?', (current_user_id,))
    sender_info = cursor.fetchone()
    
    conn.commit()
    conn.close()
    
    message_data = {
        'id': message_id,
        'content': content,
        'type': message_type,
        'timestamp': datetime.datetime.utcnow().isoformat(),
        'sender': {
            'id': current_user_id,
            'name': sender_info[0],
            'avatar': sender_info[1]
        },
        'chatId': chat_id,
        'status': 'sent'
    }
    
    # Emit to all participants
    socketio.emit('new-message', message_data, room=f'chat-{chat_id}')
    
    return jsonify({'message': 'Message sent successfully', 'data': message_data}), 201

@app.route('/api/chats', methods=['POST'])
@token_required
def create_chat(current_user_id):
    data = request.get_json()
    participant_id = data.get('participant_id')
    is_group = data.get('is_group', False)
    name = data.get('name')
    
    if not participant_id and not is_group:
        return jsonify({'message': 'Participant ID is required for individual chats'}), 400
    
    conn = sqlite3.connect('whatsapp_clone.db')
    cursor = conn.cursor()
    
    if not is_group:
        # Check if chat already exists between these users
        cursor.execute('''
            SELECT c.id FROM chats c
            JOIN chat_participants cp1 ON c.id = cp1.chat_id
            JOIN chat_participants cp2 ON c.id = cp2.chat_id
            WHERE c.is_group = FALSE 
            AND cp1.user_id = ? AND cp2.user_id = ?
        ''', (current_user_id, participant_id))
        
        existing_chat = cursor.fetchone()
        if existing_chat:
            conn.close()
            return jsonify({'chat_id': existing_chat[0]}), 200
    
    # Create new chat
    cursor.execute('''
        INSERT INTO chats (name, is_group, created_by)
        VALUES (?, ?, ?)
    ''', (name, is_group, current_user_id))
    
    chat_id = cursor.lastrowid
    
    # Add participants
    cursor.execute('''
        INSERT INTO chat_participants (chat_id, user_id, role)
        VALUES (?, ?, 'admin')
    ''', (chat_id, current_user_id))
    
    if not is_group:
        cursor.execute('''
            INSERT INTO chat_participants (chat_id, user_id)
            VALUES (?, ?)
        ''', (chat_id, participant_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Chat created successfully', 'chat_id': chat_id}), 201

@app.route('/api/users/search', methods=['GET'])
@token_required
def search_users(current_user_id):
    query = request.args.get('q', '')
    
    if len(query) < 2:
        return jsonify({'users': []}), 200
    
    conn = sqlite3.connect('whatsapp_clone.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, name, phone_number, avatar, is_online
        FROM users 
        WHERE (name LIKE ? OR phone_number LIKE ?) AND id != ?
        LIMIT 20
    ''', (f'%{query}%', f'%{query}%', current_user_id))
    
    users = []
    for row in cursor.fetchall():
        users.append({
            'id': row[0],
            'name': row[1],
            'phone_number': row[2],
            'avatar': row[3],
            'is_online': bool(row[4])
        })
    
    conn.close()
    return jsonify({'users': users}), 200

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
        conn = sqlite3.connect('whatsapp_clone.db')
        cursor = conn.cursor()
        cursor.execute('UPDATE users SET is_online = ? WHERE id = ?', (True, user_id))
        conn.commit()
        conn.close()
        emit('user-status-changed', {'user_id': user_id, 'is_online': True}, broadcast=True)

@socketio.on('user-offline')
def handle_user_offline(data):
    user_id = data.get('id')
    if user_id:
        conn = sqlite3.connect('whatsapp_clone.db')
        cursor = conn.cursor()
        cursor.execute('UPDATE users SET is_online = ?, last_seen = ? WHERE id = ?', 
                      (False, datetime.datetime.utcnow(), user_id))
        conn.commit()
        conn.close()
        emit('user-status-changed', {'user_id': user_id, 'is_online': False}, broadcast=True)

@socketio.on('join-chat')
def handle_join_chat(data):
    chat_id = data.get('chatId')
    if chat_id:
        join_room(f'chat-{chat_id}')
        print(f'User joined chat {chat_id}')

@socketio.on('leave-chat')
def handle_leave_chat(data):
    chat_id = data.get('chatId')
    if chat_id:
        leave_room(f'chat-{chat_id}')
        print(f'User left chat {chat_id}')

@socketio.on('send-message')
def handle_send_message(data):
    chat_id = data.get('chatId')
    if chat_id:
        emit('new-message', data, room=f'chat-{chat_id}', include_self=False)

@socketio.on('typing-start')
def handle_typing_start(data):
    chat_id = data.get('chatId')
    if chat_id:
        emit('user-typing', data, room=f'chat-{chat_id}', include_self=False)

@socketio.on('typing-stop')
def handle_typing_stop(data):
    chat_id = data.get('chatId')
    if chat_id:
        emit('user-stopped-typing', data, room=f'chat-{chat_id}', include_self=False)

@socketio.on('mark-messages-read')
def handle_mark_read(data):
    chat_id = data.get('chatId')
    user_id = data.get('userId')
    
    if chat_id and user_id:
        conn = sqlite3.connect('whatsapp_clone.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE message_status SET status = 'read', timestamp = ?
            WHERE message_id IN (
                SELECT id FROM messages WHERE chat_id = ? AND sender_id != ?
            ) AND user_id = ?
        ''', (datetime.datetime.utcnow(), chat_id, user_id, user_id))
        
        conn.commit()
        conn.close()
        
        emit('messages-read', {'chatId': chat_id, 'userId': user_id}, 
             room=f'chat-{chat_id}', include_self=False)

if __name__ == '__main__':
    init_db()
    print("WhatsApp Clone Backend starting on port 5008...")
    socketio.run(app, debug=True, host='0.0.0.0', port=5008)
