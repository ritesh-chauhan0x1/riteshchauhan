# Blog Platform - Python Backend API
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import sqlite3
from datetime import datetime, timedelta
import json
import hashlib
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
import os
import re
from textblob import TextBlob
import markdown

app = Flask(__name__)
app.config["SECRET_KEY"] = "blog_platform_secret_key_2025"
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Database setup
def init_db():
    conn = sqlite3.connect("blog.db")
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT,
            bio TEXT,
            avatar TEXT,
            website TEXT,
            location TEXT,
            followers_count INTEGER DEFAULT 0,
            following_count INTEGER DEFAULT 0,
            posts_count INTEGER DEFAULT 0,
            verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author_id INTEGER,
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            content TEXT NOT NULL,
            excerpt TEXT,
            featured_image TEXT,
            status TEXT DEFAULT "published",
            views_count INTEGER DEFAULT 0,
            likes_count INTEGER DEFAULT 0,
            comments_count INTEGER DEFAULT 0,
            reading_time INTEGER DEFAULT 0,
            featured BOOLEAN DEFAULT FALSE,
            meta_description TEXT,
            meta_keywords TEXT,
            published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            description TEXT,
            color TEXT DEFAULT "#3498db",
            posts_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS post_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER,
            category_id INTEGER,
            FOREIGN KEY (post_id) REFERENCES posts (id),
            FOREIGN KEY (category_id) REFERENCES categories (id),
            UNIQUE(post_id, category_id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            posts_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS post_tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER,
            tag_id INTEGER,
            FOREIGN KEY (post_id) REFERENCES posts (id),
            FOREIGN KEY (tag_id) REFERENCES tags (id),
            UNIQUE(post_id, tag_id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER,
            author_id INTEGER,
            content TEXT NOT NULL,
            status TEXT DEFAULT "approved",
            likes_count INTEGER DEFAULT 0,
            parent_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts (id),
            FOREIGN KEY (author_id) REFERENCES users (id),
            FOREIGN KEY (parent_id) REFERENCES comments (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            post_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (post_id) REFERENCES posts (id),
            UNIQUE(user_id, post_id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS follows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            follower_id INTEGER,
            following_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (follower_id) REFERENCES users (id),
            FOREIGN KEY (following_id) REFERENCES users (id),
            UNIQUE(follower_id, following_id)
        )
    """)
    
    # Insert sample data
    sample_users = [
        ("ritesh_writer", "ritesh@blog.com", generate_password_hash("password123"), "Ritesh Chauhan", "Full Stack Developer & Tech Writer", "/images/ritesh_avatar.jpg", "https://riteshchauhan.dev", "Mumbai, India", 2500, 180, 25, True),
        ("tech_blogger", "tech@blog.com", generate_password_hash("password123"), "Tech Blogger", "Writing about latest technology trends", "/images/tech_avatar.jpg", "https://techblog.com", "San Francisco, USA", 1800, 120, 35, False),
        ("coding_enthusiast", "coder@blog.com", generate_password_hash("password123"), "Coding Enthusiast", "Passionate about programming and algorithms", "/images/coder_avatar.jpg", "", "London, UK", 1200, 95, 18, False)
    ]
    
    for user in sample_users:
        cursor.execute("""
            INSERT OR IGNORE INTO users (username, email, password_hash, full_name, bio, avatar, website, location, followers_count, following_count, posts_count, verified)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, user)
    
    # Sample categories
    sample_categories = [
        ("Technology", "technology", "Latest tech trends and innovations", "#3498db"),
        ("Programming", "programming", "Coding tutorials and best practices", "#e74c3c"),
        ("Web Development", "web-development", "Frontend and backend development", "#2ecc71"),
        ("Python", "python", "Python programming and frameworks", "#f39c12"),
        ("JavaScript", "javascript", "JavaScript and its ecosystem", "#f1c40f"),
        ("Machine Learning", "machine-learning", "AI and ML concepts", "#9b59b6")
    ]
    
    for category in sample_categories:
        cursor.execute("""
            INSERT OR IGNORE INTO categories (name, slug, description, color)
            VALUES (?, ?, ?, ?)
        """, category)
    
    # Sample posts
    sample_posts = [
        (1, "Getting Started with Python Flask", "getting-started-python-flask", "Flask is a lightweight WSGI web application framework in Python. It is designed to make getting started quick and easy, with the ability to scale up to complex applications.", "Learn how to build your first web application using Flask framework.", "/images/flask_tutorial.jpg", "published", 1250, 89, 12, 8, True),
        (1, "React Hooks Complete Guide", "react-hooks-complete-guide", "React Hooks allow you to use state and other React features without writing a class. This guide covers all the essential hooks.", "Master React Hooks with practical examples and use cases.", "/images/react_hooks.jpg", "published", 980, 67, 8, 6, False),
        (2, "Top 10 VS Code Extensions for Developers", "top-10-vscode-extensions-developers", "Boost your productivity with these essential VS Code extensions that every developer should know about.", "Enhance your coding experience with these must-have extensions.", "/images/vscode_extensions.jpg", "published", 1890, 145, 23, 5, True),
        (3, "Understanding Big O Notation", "understanding-big-o-notation", "Big O notation is a mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity.", "Learn time and space complexity analysis with practical examples.", "/images/big_o.jpg", "published", 756, 42, 6, 7, False)
    ]
    
    for post in sample_posts:
        cursor.execute("""
            INSERT OR IGNORE INTO posts (author_id, title, slug, content, excerpt, featured_image, status, views_count, likes_count, comments_count, reading_time, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, post)
    
    conn.commit()
    conn.close()

class ContentAnalyzer:
    @staticmethod
    def calculate_reading_time(content):
        """Calculate estimated reading time in minutes"""
        word_count = len(content.split())
        reading_speed = 200  # Average words per minute
        return max(1, round(word_count / reading_speed))
    
    @staticmethod
    def generate_excerpt(content, length=150):
        """Generate excerpt from content"""
        # Remove HTML tags and markdown
        clean_text = re.sub(r'<[^>]+>', '', content)
        clean_text = re.sub(r'[#*_`]', '', clean_text)
        
        if len(clean_text) <= length:
            return clean_text
        
        # Find the last complete word within the length limit
        excerpt = clean_text[:length]
        last_space = excerpt.rfind(' ')
        if last_space > 0:
            excerpt = excerpt[:last_space]
        
        return excerpt + "..."
    
    @staticmethod
    def extract_keywords(content, max_keywords=10):
        """Extract keywords from content using TextBlob"""
        try:
            blob = TextBlob(content)
            # Extract noun phrases as keywords
            keywords = [phrase.lower() for phrase in blob.noun_phrases]
            # Remove duplicates and limit
            unique_keywords = list(set(keywords))[:max_keywords]
            return ", ".join(unique_keywords)
        except:
            return ""
    
    @staticmethod
    def create_slug(title):
        """Create URL-friendly slug from title"""
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug.strip('-')

class SEOOptimizer:
    @staticmethod
    def analyze_content_seo(title, content, meta_description=""):
        """Analyze content for SEO optimization"""
        analysis = {
            "title_length": len(title),
            "title_optimal": 50 <= len(title) <= 60,
            "content_length": len(content.split()),
            "content_optimal": len(content.split()) >= 300,
            "meta_description_length": len(meta_description),
            "meta_description_optimal": 150 <= len(meta_description) <= 160,
            "readability_score": 0,
            "keyword_density": {},
            "suggestions": []
        }
        
        # Add suggestions based on analysis
        if not analysis["title_optimal"]:
            if analysis["title_length"] < 50:
                analysis["suggestions"].append("Title is too short. Consider adding more descriptive words.")
            else:
                analysis["suggestions"].append("Title is too long. Try to keep it under 60 characters.")
        
        if not analysis["content_optimal"]:
            analysis["suggestions"].append("Content is too short. Aim for at least 300 words for better SEO.")
        
        if not analysis["meta_description_optimal"]:
            analysis["suggestions"].append("Meta description should be between 150-160 characters.")
        
        return analysis

# API Routes
@app.route("/api/posts", methods=["GET"])
def get_posts():
    """Get posts with filtering and pagination"""
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))
    category = request.args.get("category")
    tag = request.args.get("tag")
    author = request.args.get("author")
    featured = request.args.get("featured")
    search = request.args.get("search")
    
    offset = (page - 1) * per_page
    
    conn = sqlite3.connect("blog.db")
    cursor = conn.cursor()
    
    query = """
        SELECT p.id, p.title, p.slug, p.excerpt, p.featured_image, p.views_count, 
               p.likes_count, p.comments_count, p.reading_time, p.published_at, p.featured,
               u.username, u.full_name, u.avatar
        FROM posts p
        JOIN users u ON p.author_id = u.id
        WHERE p.status = 'published'
    """
    params = []
    
    if category:
        query += """ AND p.id IN (
            SELECT pc.post_id FROM post_categories pc
            JOIN categories c ON pc.category_id = c.id
            WHERE c.slug = ?
        )"""
        params.append(category)
    
    if tag:
        query += """ AND p.id IN (
            SELECT pt.post_id FROM post_tags pt
            JOIN tags t ON pt.tag_id = t.id
            WHERE t.slug = ?
        )"""
        params.append(tag)
    
    if author:
        query += " AND u.username = ?"
        params.append(author)
    
    if featured:
        query += " AND p.featured = ?"
        params.append(bool(featured))
    
    if search:
        query += " AND (p.title LIKE ? OR p.content LIKE ? OR p.excerpt LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])
    
    query += " ORDER BY p.published_at DESC LIMIT ? OFFSET ?"
    params.extend([per_page, offset])
    
    cursor.execute(query, params)
    posts = []
    
    for row in cursor.fetchall():
        posts.append({
            "id": row[0],
            "title": row[1],
            "slug": row[2],
            "excerpt": row[3],
            "featured_image": row[4],
            "views": row[5],
            "likes": row[6],
            "comments_count": row[7],
            "reading_time": row[8],
            "published_at": row[9],
            "featured": bool(row[10]),
            "author": {
                "username": row[11],
                "name": row[12],
                "avatar": row[13]
            }
        })
    
    conn.close()
    return jsonify(posts)

@app.route("/api/posts/<slug>", methods=["GET"])
def get_post(slug):
    """Get single post by slug"""
    conn = sqlite3.connect("blog.db")
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT p.*, u.username, u.full_name, u.avatar, u.bio
        FROM posts p
        JOIN users u ON p.author_id = u.id
        WHERE p.slug = ? AND p.status = 'published'
    """, (slug,))
    
    post = cursor.fetchone()
    if not post:
        return jsonify({"error": "Post not found"}), 404
    
    # Increment view count
    cursor.execute("UPDATE posts SET views_count = views_count + 1 WHERE slug = ?", (slug,))
    
    # Get categories
    cursor.execute("""
        SELECT c.name, c.slug, c.color
        FROM categories c
        JOIN post_categories pc ON c.id = pc.category_id
        WHERE pc.post_id = ?
    """, (post[0],))
    categories = [{"name": row[0], "slug": row[1], "color": row[2]} for row in cursor.fetchall()]
    
    # Get tags
    cursor.execute("""
        SELECT t.name, t.slug
        FROM tags t
        JOIN post_tags pt ON t.id = pt.tag_id
        WHERE pt.post_id = ?
    """, (post[0],))
    tags = [{"name": row[0], "slug": row[1]} for row in cursor.fetchall()]
    
    conn.commit()
    conn.close()
    
    post_data = {
        "id": post[0],
        "title": post[2],
        "slug": post[3],
        "content": post[4],
        "excerpt": post[5],
        "featured_image": post[6],
        "views": post[8] + 1,
        "likes": post[9],
        "comments_count": post[10],
        "reading_time": post[11],
        "featured": bool(post[12]),
        "published_at": post[15],
        "author": {
            "username": post[17],
            "name": post[18],
            "avatar": post[19],
            "bio": post[20]
        },
        "categories": categories,
        "tags": tags
    }
    
    return jsonify(post_data)

@app.route("/api/posts", methods=["POST"])
def create_post():
    """Create a new post"""
    data = request.json
    
    # Generate slug
    slug = ContentAnalyzer.create_slug(data["title"])
    
    # Calculate reading time
    reading_time = ContentAnalyzer.calculate_reading_time(data["content"])
    
    # Generate excerpt if not provided
    excerpt = data.get("excerpt") or ContentAnalyzer.generate_excerpt(data["content"])
    
    # Extract keywords for meta
    meta_keywords = ContentAnalyzer.extract_keywords(data["content"])
    
    conn = sqlite3.connect("blog.db")
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO posts (author_id, title, slug, content, excerpt, featured_image, 
                          reading_time, meta_description, meta_keywords, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["author_id"],
        data["title"],
        slug,
        data["content"],
        excerpt,
        data.get("featured_image", ""),
        reading_time,
        data.get("meta_description", excerpt),
        meta_keywords,
        data.get("status", "published")
    ))
    
    post_id = cursor.lastrowid
    
    # Update user posts count
    cursor.execute("UPDATE users SET posts_count = posts_count + 1 WHERE id = ?", (data["author_id"],))
    
    conn.commit()
    conn.close()
    
    # Emit real-time notification
    socketio.emit("new_post", {
        "post_id": post_id,
        "title": data["title"],
        "author_id": data["author_id"],
        "timestamp": datetime.now().isoformat()
    })
    
    return jsonify({"id": post_id, "slug": slug, "message": "Post created successfully"}), 201

@app.route("/api/posts/<int:post_id>/like", methods=["POST"])
def like_post(post_id):
    """Like or unlike a post"""
    data = request.json
    user_id = data["user_id"]
    
    conn = sqlite3.connect("blog.db")
    cursor = conn.cursor()
    
    # Check if already liked
    cursor.execute("SELECT id FROM likes WHERE user_id = ? AND post_id = ?", (user_id, post_id))
    existing_like = cursor.fetchone()
    
    if existing_like:
        # Unlike
        cursor.execute("DELETE FROM likes WHERE user_id = ? AND post_id = ?", (user_id, post_id))
        cursor.execute("UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?", (post_id,))
        action = "unliked"
    else:
        # Like
        cursor.execute("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", (user_id, post_id))
        cursor.execute("UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?", (post_id,))
        action = "liked"
    
    conn.commit()
    conn.close()
    
    return jsonify({"action": action})

@app.route("/api/categories", methods=["GET"])
def get_categories():
    """Get all categories"""
    conn = sqlite3.connect("blog.db")
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM categories ORDER BY posts_count DESC")
    categories = []
    
    for row in cursor.fetchall():
        categories.append({
            "id": row[0],
            "name": row[1],
            "slug": row[2],
            "description": row[3],
            "color": row[4],
            "posts_count": row[5]
        })
    
    conn.close()
    return jsonify(categories)

@app.route("/api/content/analyze", methods=["POST"])
def analyze_content():
    """Analyze content for SEO optimization"""
    data = request.json
    
    analysis = SEOOptimizer.analyze_content_seo(
        data["title"],
        data["content"],
        data.get("meta_description", "")
    )
    
    return jsonify(analysis)

# WebSocket events for real-time features
@socketio.on("connect")
def handle_connect():
    """Handle client connection"""
    print("Blog client connected")
    emit("status", {"message": "Connected to Blog Platform API"})

@socketio.on("reading_progress")
def handle_reading_progress(data):
    """Handle reading progress tracking"""
    emit("progress_updated", {
        "post_id": data["post_id"],
        "progress": data["progress"],
        "user_id": data["user_id"]
    }, broadcast=True)

if __name__ == "__main__":
    init_db()
    print("📝 Blog Platform Python API Server starting...")
    print("🗄️  Database initialized")
    print("📊 SEO analysis ready")
    print("🚀 Server running on http://localhost:5005")
    socketio.run(app, debug=True, host="0.0.0.0", port=5005)
