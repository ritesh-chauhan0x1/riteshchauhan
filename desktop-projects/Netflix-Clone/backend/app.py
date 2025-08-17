# Netflix Clone - Python Backend API
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
import requests
import random

app = Flask(__name__)
app.config["SECRET_KEY"] = "netflix_clone_secret_key_2025"
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Database setup
def init_db():
    conn = sqlite3.connect("netflix.db")
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT NOT NULL,
            subscription_plan TEXT DEFAULT "basic",
            profile_image TEXT,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT NOT NULL,
            avatar TEXT,
            is_kids BOOLEAN DEFAULT FALSE,
            language TEXT DEFAULT "en",
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            genre TEXT,
            release_year INTEGER,
            duration INTEGER,
            rating TEXT,
            thumbnail TEXT,
            video_url TEXT,
            trailer_url TEXT,
            featured BOOLEAN DEFAULT FALSE,
            trending BOOLEAN DEFAULT FALSE,
            imdb_rating REAL,
            director TEXT,
            cast TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tv_shows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            genre TEXT,
            release_year INTEGER,
            seasons INTEGER,
            episodes INTEGER,
            rating TEXT,
            thumbnail TEXT,
            trailer_url TEXT,
            featured BOOLEAN DEFAULT FALSE,
            trending BOOLEAN DEFAULT FALSE,
            imdb_rating REAL,
            creator TEXT,
            cast TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS episodes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            show_id INTEGER,
            season_number INTEGER,
            episode_number INTEGER,
            title TEXT NOT NULL,
            description TEXT,
            duration INTEGER,
            video_url TEXT,
            thumbnail TEXT,
            air_date DATE,
            FOREIGN KEY (show_id) REFERENCES tv_shows (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS watch_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            profile_id INTEGER,
            content_type TEXT,
            content_id INTEGER,
            progress REAL DEFAULT 0,
            completed BOOLEAN DEFAULT FALSE,
            last_watched TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (profile_id) REFERENCES profiles (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS my_list (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            profile_id INTEGER,
            content_type TEXT,
            content_id INTEGER,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (profile_id) REFERENCES profiles (id),
            UNIQUE(profile_id, content_type, content_id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS recommendations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            profile_id INTEGER,
            content_type TEXT,
            content_id INTEGER,
            recommendation_score REAL,
            reason TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (profile_id) REFERENCES profiles (id)
        )
    """)
    
    # Insert sample data
    sample_users = [
        ("ritesh@netflix.com", generate_password_hash("password123"), "Ritesh Chauhan", "premium", "/images/ritesh_avatar.jpg"),
        ("demo@netflix.com", generate_password_hash("password123"), "Demo User", "standard", "/images/demo_avatar.jpg")
    ]
    
    for user in sample_users:
        cursor.execute("""
            INSERT OR IGNORE INTO users (email, password_hash, full_name, subscription_plan, profile_image)
            VALUES (?, ?, ?, ?, ?)
        """, user)
    
    # Sample movies
    sample_movies = [
        ("The Dark Knight", "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", "Action,Crime,Drama", 2008, 152, "PG-13", "/images/dark_knight.jpg", "/videos/dark_knight.mp4", "/trailers/dark_knight.mp4", True, True, 9.0, "Christopher Nolan", "Christian Bale, Heath Ledger, Aaron Eckhart"),
        ("Inception", "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", "Action,Sci-Fi,Thriller", 2010, 148, "PG-13", "/images/inception.jpg", "/videos/inception.mp4", "/trailers/inception.mp4", True, True, 8.8, "Christopher Nolan", "Leonardo DiCaprio, Marion Cotillard, Tom Hardy"),
        ("Interstellar", "A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.", "Adventure,Drama,Sci-Fi", 2014, 169, "PG-13", "/images/interstellar.jpg", "/videos/interstellar.mp4", "/trailers/interstellar.mp4", False, True, 8.6, "Christopher Nolan", "Matthew McConaughey, Anne Hathaway, Jessica Chastain"),
        ("The Matrix", "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.", "Action,Sci-Fi", 1999, 136, "R", "/images/matrix.jpg", "/videos/matrix.mp4", "/trailers/matrix.mp4", False, False, 8.7, "The Wachowskis", "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss"),
        ("Pulp Fiction", "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.", "Crime,Drama", 1994, 154, "R", "/images/pulp_fiction.jpg", "/videos/pulp_fiction.mp4", "/trailers/pulp_fiction.mp4", False, False, 8.9, "Quentin Tarantino", "John Travolta, Uma Thurman, Samuel L. Jackson")
    ]
    
    for movie in sample_movies:
        cursor.execute("""
            INSERT OR IGNORE INTO movies (title, description, genre, release_year, duration, rating, thumbnail, video_url, trailer_url, featured, trending, imdb_rating, director, cast)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, movie)
    
    # Sample TV shows
    sample_shows = [
        ("Stranger Things", "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.", "Drama,Fantasy,Horror", 2016, 4, 34, "TV-14", "/images/stranger_things.jpg", "/trailers/stranger_things.mp4", True, True, 8.7, "The Duffer Brothers", "Millie Bobby Brown, Finn Wolfhard, Winona Ryder"),
        ("Breaking Bad", "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his familys future.", "Crime,Drama,Thriller", 2008, 5, 62, "TV-MA", "/images/breaking_bad.jpg", "/trailers/breaking_bad.mp4", True, False, 9.5, "Vince Gilligan", "Bryan Cranston, Aaron Paul, Anna Gunn"),
        ("Money Heist", "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.", "Action,Crime,Mystery", 2017, 5, 41, "TV-MA", "/images/money_heist.jpg", "/trailers/money_heist.mp4", False, True, 8.2, "Álex Pina", "Álvaro Morte, Itziar Ituño, Pedro Alonso")
    ]
    
    for show in sample_shows:
        cursor.execute("""
            INSERT OR IGNORE INTO tv_shows (title, description, genre, release_year, seasons, episodes, rating, thumbnail, trailer_url, featured, trending, imdb_rating, creator, cast)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, show)
    
    conn.commit()
    conn.close()

class RecommendationEngine:
    @staticmethod
    def get_recommendations(profile_id, limit=10):
        """Generate personalized recommendations"""
        conn = sqlite3.connect("netflix.db")
        cursor = conn.cursor()
        
        # Get user's watch history
        cursor.execute("""
            SELECT content_type, content_id FROM watch_history 
            WHERE profile_id = ? 
            ORDER BY last_watched DESC LIMIT 5
        """, (profile_id,))
        
        watch_history = cursor.fetchall()
        
        # Simple recommendation based on genre
        recommendations = []
        
        if watch_history:
            # Get genres from watch history
            genres = []
            for content_type, content_id in watch_history:
                if content_type == "movie":
                    cursor.execute("SELECT genre FROM movies WHERE id = ?", (content_id,))
                else:
                    cursor.execute("SELECT genre FROM tv_shows WHERE id = ?", (content_id,))
                
                result = cursor.fetchone()
                if result:
                    genres.extend(result[0].split(","))
            
            # Find content with similar genres
            if genres:
                common_genres = list(set(genres))
                for genre in common_genres[:3]:
                    # Get movies
                    cursor.execute("""
                        SELECT id, title, thumbnail, imdb_rating FROM movies 
                        WHERE genre LIKE ? 
                        ORDER BY imdb_rating DESC LIMIT 3
                    """, (f"%{genre.strip()}%",))
                    
                    for row in cursor.fetchall():
                        recommendations.append({
                            "type": "movie",
                            "id": row[0],
                            "title": row[1],
                            "thumbnail": row[2],
                            "rating": row[3],
                            "reason": f"Because you watched {genre.strip()} content"
                        })
                    
                    # Get TV shows
                    cursor.execute("""
                        SELECT id, title, thumbnail, imdb_rating FROM tv_shows 
                        WHERE genre LIKE ? 
                        ORDER BY imdb_rating DESC LIMIT 2
                    """, (f"%{genre.strip()}%",))
                    
                    for row in cursor.fetchall():
                        recommendations.append({
                            "type": "tv_show",
                            "id": row[0],
                            "title": row[1],
                            "thumbnail": row[2],
                            "rating": row[3],
                            "reason": f"Because you watched {genre.strip()} shows"
                        })
        
        conn.close()
        return recommendations[:limit]

# API Routes
@app.route("/api/auth/login", methods=["POST"])
def login():
    """User login"""
    data = request.json
    email = data.get("email")
    password = data.get("password")
    
    conn = sqlite3.connect("netflix.db")
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, password_hash, full_name FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    
    if user and check_password_hash(user[1], password):
        # Generate JWT token
        token = jwt.encode({
            "user_id": user[0],
            "email": email,
            "exp": datetime.utcnow() + timedelta(days=1)
        }, app.config["SECRET_KEY"], algorithm="HS256")
        
        conn.close()
        return jsonify({
            "token": token,
            "user": {
                "id": user[0],
                "email": email,
                "name": user[2]
            }
        })
    
    conn.close()
    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/api/content/movies", methods=["GET"])
def get_movies():
    """Get all movies"""
    conn = sqlite3.connect("netflix.db")
    cursor = conn.cursor()
    
    genre = request.args.get("genre")
    featured = request.args.get("featured")
    trending = request.args.get("trending")
    
    query = "SELECT * FROM movies WHERE 1=1"
    params = []
    
    if genre:
        query += " AND genre LIKE ?"
        params.append(f"%{genre}%")
    
    if featured:
        query += " AND featured = ?"
        params.append(bool(featured))
    
    if trending:
        query += " AND trending = ?"
        params.append(bool(trending))
    
    query += " ORDER BY imdb_rating DESC"
    
    cursor.execute(query, params)
    movies = []
    
    for row in cursor.fetchall():
        movies.append({
            "id": row[0],
            "title": row[1],
            "description": row[2],
            "genre": row[3],
            "release_year": row[4],
            "duration": row[5],
            "rating": row[6],
            "thumbnail": row[7],
            "video_url": row[8],
            "trailer_url": row[9],
            "featured": bool(row[10]),
            "trending": bool(row[11]),
            "imdb_rating": row[12],
            "director": row[13],
            "cast": row[14]
        })
    
    conn.close()
    return jsonify(movies)

@app.route("/api/content/shows", methods=["GET"])
def get_shows():
    """Get all TV shows"""
    conn = sqlite3.connect("netflix.db")
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM tv_shows ORDER BY imdb_rating DESC")
    shows = []
    
    for row in cursor.fetchall():
        shows.append({
            "id": row[0],
            "title": row[1],
            "description": row[2],
            "genre": row[3],
            "release_year": row[4],
            "seasons": row[5],
            "episodes": row[6],
            "rating": row[7],
            "thumbnail": row[8],
            "trailer_url": row[9],
            "featured": bool(row[10]),
            "trending": bool(row[11]),
            "imdb_rating": row[12],
            "creator": row[13],
            "cast": row[14]
        })
    
    conn.close()
    return jsonify(shows)

@app.route("/api/user/<int:profile_id>/watchlist", methods=["GET", "POST", "DELETE"])
def handle_watchlist(profile_id):
    """Handle user watchlist operations"""
    conn = sqlite3.connect("netflix.db")
    cursor = conn.cursor()
    
    if request.method == "GET":
        cursor.execute("""
            SELECT ml.content_type, ml.content_id, ml.added_at,
                   CASE 
                       WHEN ml.content_type = 'movie' THEN m.title
                       ELSE tv.title
                   END as title,
                   CASE 
                       WHEN ml.content_type = 'movie' THEN m.thumbnail
                       ELSE tv.thumbnail
                   END as thumbnail
            FROM my_list ml
            LEFT JOIN movies m ON ml.content_type = 'movie' AND ml.content_id = m.id
            LEFT JOIN tv_shows tv ON ml.content_type = 'tv_show' AND ml.content_id = tv.id
            WHERE ml.profile_id = ?
            ORDER BY ml.added_at DESC
        """, (profile_id,))
        
        watchlist = []
        for row in cursor.fetchall():
            watchlist.append({
                "content_type": row[0],
                "content_id": row[1],
                "added_at": row[2],
                "title": row[3],
                "thumbnail": row[4]
            })
        
        conn.close()
        return jsonify(watchlist)
    
    elif request.method == "POST":
        data = request.json
        cursor.execute("""
            INSERT OR IGNORE INTO my_list (profile_id, content_type, content_id)
            VALUES (?, ?, ?)
        """, (profile_id, data["content_type"], data["content_id"]))
        
        conn.commit()
        conn.close()
        return jsonify({"message": "Added to watchlist"}), 201

@app.route("/api/user/<int:profile_id>/recommendations", methods=["GET"])
def get_user_recommendations(profile_id):
    """Get personalized recommendations"""
    recommendations = RecommendationEngine.get_recommendations(profile_id)
    return jsonify(recommendations)

@app.route("/api/content/search", methods=["GET"])
def search_content():
    """Search movies and TV shows"""
    query = request.args.get("q", "")
    
    conn = sqlite3.connect("netflix.db")
    cursor = conn.cursor()
    
    # Search movies
    cursor.execute("""
        SELECT 'movie' as type, id, title, thumbnail, imdb_rating 
        FROM movies 
        WHERE title LIKE ? OR description LIKE ? OR cast LIKE ?
    """, (f"%{query}%", f"%{query}%", f"%{query}%"))
    
    results = []
    for row in cursor.fetchall():
        results.append({
            "type": row[0],
            "id": row[1],
            "title": row[2],
            "thumbnail": row[3],
            "rating": row[4]
        })
    
    # Search TV shows
    cursor.execute("""
        SELECT 'tv_show' as type, id, title, thumbnail, imdb_rating 
        FROM tv_shows 
        WHERE title LIKE ? OR description LIKE ? OR cast LIKE ?
    """, (f"%{query}%", f"%{query}%", f"%{query}%"))
    
    for row in cursor.fetchall():
        results.append({
            "type": row[0],
            "id": row[1],
            "title": row[2],
            "thumbnail": row[3],
            "rating": row[4]
        })
    
    conn.close()
    return jsonify(results)

# WebSocket events for real-time features
@socketio.on("connect")
def handle_connect():
    """Handle client connection"""
    print("Netflix client connected")
    emit("status", {"message": "Connected to Netflix Clone API"})

@socketio.on("start_watching")
def handle_start_watching(data):
    """Handle user starting to watch content"""
    emit("watching_started", {
        "profile_id": data["profile_id"],
        "content_type": data["content_type"],
        "content_id": data["content_id"],
        "timestamp": datetime.now().isoformat()
    }, broadcast=True)

if __name__ == "__main__":
    init_db()
    print("🎬 Netflix Clone Python API Server starting...")
    print("🗄️  Database initialized")
    print("🎥 Movies and TV shows loaded")
    print("🚀 Server running on http://localhost:5003")
    socketio.run(app, debug=True, host="0.0.0.0", port=5003)
