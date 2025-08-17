# E-commerce Platform - Python Backend API
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
import uuid
import stripe
from decimal import Decimal

app = Flask(__name__)
app.config["SECRET_KEY"] = "ecommerce_platform_secret_key_2025"
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Stripe configuration (test mode)
stripe.api_key = "sk_test_your_stripe_secret_key_here"

# Database setup
def init_db():
    conn = sqlite3.connect("ecommerce.db")
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            phone TEXT,
            avatar TEXT,
            date_of_birth DATE,
            gender TEXT,
            is_active BOOLEAN DEFAULT TRUE,
            is_verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS addresses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            type TEXT DEFAULT "shipping",
            full_name TEXT NOT NULL,
            address_line1 TEXT NOT NULL,
            address_line2 TEXT,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            postal_code TEXT NOT NULL,
            country TEXT NOT NULL,
            phone TEXT,
            is_default BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            description TEXT,
            image TEXT,
            parent_id INTEGER,
            sort_order INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE,
            FOREIGN KEY (parent_id) REFERENCES categories (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            description TEXT,
            short_description TEXT,
            sku TEXT UNIQUE NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            compare_price DECIMAL(10,2),
            cost_price DECIMAL(10,2),
            stock_quantity INTEGER DEFAULT 0,
            low_stock_threshold INTEGER DEFAULT 5,
            weight DECIMAL(8,3),
            dimensions TEXT,
            images TEXT,
            status TEXT DEFAULT "active",
            featured BOOLEAN DEFAULT FALSE,
            seo_title TEXT,
            seo_description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS product_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            category_id INTEGER,
            FOREIGN KEY (product_id) REFERENCES products (id),
            FOREIGN KEY (category_id) REFERENCES categories (id),
            UNIQUE(product_id, category_id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS product_variants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            name TEXT NOT NULL,
            sku TEXT UNIQUE NOT NULL,
            price DECIMAL(10,2),
            compare_price DECIMAL(10,2),
            stock_quantity INTEGER DEFAULT 0,
            variant_options TEXT,
            image TEXT,
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS carts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            session_id TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cart_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cart_id INTEGER,
            product_id INTEGER,
            variant_id INTEGER,
            quantity INTEGER NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cart_id) REFERENCES carts (id),
            FOREIGN KEY (product_id) REFERENCES products (id),
            FOREIGN KEY (variant_id) REFERENCES product_variants (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            order_number TEXT UNIQUE NOT NULL,
            status TEXT DEFAULT "pending",
            payment_status TEXT DEFAULT "pending",
            fulfillment_status TEXT DEFAULT "unfulfilled",
            subtotal DECIMAL(10,2) NOT NULL,
            tax_amount DECIMAL(10,2) DEFAULT 0,
            shipping_amount DECIMAL(10,2) DEFAULT 0,
            discount_amount DECIMAL(10,2) DEFAULT 0,
            total_amount DECIMAL(10,2) NOT NULL,
            currency TEXT DEFAULT "USD",
            payment_method TEXT,
            shipping_address TEXT,
            billing_address TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            product_id INTEGER,
            variant_id INTEGER,
            product_name TEXT NOT NULL,
            variant_name TEXT,
            quantity INTEGER NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            total DECIMAL(10,2) NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders (id),
            FOREIGN KEY (product_id) REFERENCES products (id),
            FOREIGN KEY (variant_id) REFERENCES product_variants (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            user_id INTEGER,
            rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
            title TEXT,
            content TEXT,
            verified_purchase BOOLEAN DEFAULT FALSE,
            helpful_count INTEGER DEFAULT 0,
            status TEXT DEFAULT "approved",
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS wishlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product_id INTEGER,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (product_id) REFERENCES products (id),
            UNIQUE(user_id, product_id)
        )
    """)
    
    # Insert sample data
    sample_users = [
        ("ritesh@ecommerce.com", generate_password_hash("password123"), "Ritesh", "Chauhan", "+919876543210", "/images/ritesh_avatar.jpg"),
        ("customer@ecommerce.com", generate_password_hash("password123"), "John", "Doe", "+1234567890", "/images/john_avatar.jpg")
    ]
    
    for user in sample_users:
        cursor.execute("""
            INSERT OR IGNORE INTO users (email, password_hash, first_name, last_name, phone, avatar)
            VALUES (?, ?, ?, ?, ?, ?)
        """, user)
    
    # Sample categories
    sample_categories = [
        ("Electronics", "electronics", "Electronic devices and gadgets", "/images/electronics.jpg", None, 1),
        ("Smartphones", "smartphones", "Mobile phones and accessories", "/images/smartphones.jpg", 1, 1),
        ("Laptops", "laptops", "Laptops and notebooks", "/images/laptops.jpg", 1, 2),
        ("Clothing", "clothing", "Fashion and apparel", "/images/clothing.jpg", None, 2),
        ("Men's Clothing", "mens-clothing", "Men's fashion", "/images/mens_clothing.jpg", 4, 1),
        ("Women's Clothing", "womens-clothing", "Women's fashion", "/images/womens_clothing.jpg", 4, 2)
    ]
    
    for category in sample_categories:
        cursor.execute("""
            INSERT OR IGNORE INTO categories (name, slug, description, image, parent_id, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)
        """, category)
    
    # Sample products
    sample_products = [
        ("iPhone 15 Pro", "iphone-15-pro", "Latest iPhone with advanced camera system", "Premium smartphone with titanium design", "IPH15PRO", 999.00, 1099.00, 850.00, 50, 5, 0.221, "6.1 x 2.78 x 0.32 inches", '["iphone1.jpg","iphone2.jpg","iphone3.jpg"]', "active", True),
        ("MacBook Pro M3", "macbook-pro-m3", "Powerful laptop for professionals", "14-inch MacBook Pro with M3 chip", "MBP14M3", 1999.00, 2199.00, 1750.00, 25, 3, 1.55, "12.31 x 8.71 x 0.61 inches", '["macbook1.jpg","macbook2.jpg"]', "active", True),
        ("Nike Air Max 270", "nike-air-max-270", "Comfortable running shoes", "Stylish and comfortable sneakers", "NAM270", 150.00, 180.00, 95.00, 100, 10, 0.8, "12 x 8 x 5 inches", '["nike1.jpg","nike2.jpg","nike3.jpg"]', "active", False),
        ("Sony WH-1000XM5", "sony-wh-1000xm5", "Premium noise-canceling headphones", "Industry-leading noise cancellation", "SONYWH5", 399.00, 449.00, 280.00, 75, 8, 0.55, "10 x 8 x 3 inches", '["sony1.jpg","sony2.jpg"]', "active", True)
    ]
    
    for product in sample_products:
        cursor.execute("""
            INSERT OR IGNORE INTO products (name, slug, description, short_description, sku, price, compare_price, cost_price, stock_quantity, low_stock_threshold, weight, dimensions, images, status, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, product)
    
    conn.commit()
    conn.close()

class InventoryManager:
    @staticmethod
    def check_stock_availability(product_id, variant_id=None, quantity=1):
        """Check if product/variant has sufficient stock"""
        conn = sqlite3.connect("ecommerce.db")
        cursor = conn.cursor()
        
        if variant_id:
            cursor.execute("SELECT stock_quantity FROM product_variants WHERE id = ?", (variant_id,))
        else:
            cursor.execute("SELECT stock_quantity FROM products WHERE id = ?", (product_id,))
        
        result = cursor.fetchone()
        conn.close()
        
        if result and result[0] >= quantity:
            return True
        return False
    
    @staticmethod
    def update_stock(product_id, variant_id=None, quantity_change=0):
        """Update product/variant stock quantity"""
        conn = sqlite3.connect("ecommerce.db")
        cursor = conn.cursor()
        
        if variant_id:
            cursor.execute(
                "UPDATE product_variants SET stock_quantity = stock_quantity + ? WHERE id = ?",
                (quantity_change, variant_id)
            )
        else:
            cursor.execute(
                "UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?",
                (quantity_change, product_id)
            )
        
        conn.commit()
        conn.close()

class OrderManager:
    @staticmethod
    def generate_order_number():
        """Generate unique order number"""
        timestamp = datetime.now().strftime("%Y%m%d")
        random_part = str(uuid.uuid4())[:8].upper()
        return f"ORD-{timestamp}-{random_part}"
    
    @staticmethod
    def calculate_order_total(items, shipping_amount=0, tax_rate=0.08, discount_amount=0):
        """Calculate order totals"""
        subtotal = sum(item["price"] * item["quantity"] for item in items)
        tax_amount = subtotal * tax_rate
        total = subtotal + tax_amount + shipping_amount - discount_amount
        
        return {
            "subtotal": round(subtotal, 2),
            "tax_amount": round(tax_amount, 2),
            "shipping_amount": shipping_amount,
            "discount_amount": discount_amount,
            "total": round(total, 2)
        }

# API Routes
@app.route("/api/products", methods=["GET"])
def get_products():
    """Get products with filtering and pagination"""
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 12))
    category = request.args.get("category")
    search = request.args.get("search")
    min_price = request.args.get("min_price")
    max_price = request.args.get("max_price")
    sort = request.args.get("sort", "created_at")
    featured = request.args.get("featured")
    
    offset = (page - 1) * per_page
    
    conn = sqlite3.connect("ecommerce.db")
    cursor = conn.cursor()
    
    query = "SELECT * FROM products WHERE status = 'active'"
    params = []
    
    if category:
        query += """ AND id IN (
            SELECT pc.product_id FROM product_categories pc
            JOIN categories c ON pc.category_id = c.id
            WHERE c.slug = ?
        )"""
        params.append(category)
    
    if search:
        query += " AND (name LIKE ? OR description LIKE ? OR short_description LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])
    
    if min_price:
        query += " AND price >= ?"
        params.append(float(min_price))
    
    if max_price:
        query += " AND price <= ?"
        params.append(float(max_price))
    
    if featured:
        query += " AND featured = ?"
        params.append(bool(featured))
    
    # Add sorting
    if sort == "price_asc":
        query += " ORDER BY price ASC"
    elif sort == "price_desc":
        query += " ORDER BY price DESC"
    elif sort == "name":
        query += " ORDER BY name ASC"
    else:
        query += " ORDER BY created_at DESC"
    
    query += " LIMIT ? OFFSET ?"
    params.extend([per_page, offset])
    
    cursor.execute(query, params)
    products = []
    
    for row in cursor.fetchall():
        # Get average rating
        cursor.execute("""
            SELECT AVG(rating), COUNT(rating) FROM reviews 
            WHERE product_id = ? AND status = 'approved'
        """, (row[0],))
        rating_data = cursor.fetchone()
        avg_rating = round(rating_data[0] or 0, 1)
        review_count = rating_data[1] or 0
        
        products.append({
            "id": row[0],
            "name": row[1],
            "slug": row[2],
            "description": row[3],
            "short_description": row[4],
            "sku": row[5],
            "price": float(row[6]),
            "compare_price": float(row[7]) if row[7] else None,
            "stock_quantity": row[9],
            "images": json.loads(row[13]) if row[13] else [],
            "featured": bool(row[16]),
            "rating": avg_rating,
            "review_count": review_count
        })
    
    conn.close()
    return jsonify(products)

@app.route("/api/products/<slug>", methods=["GET"])
def get_product(slug):
    """Get single product by slug"""
    conn = sqlite3.connect("ecommerce.db")
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM products WHERE slug = ? AND status = 'active'", (slug,))
    product = cursor.fetchone()
    
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    # Get product variants
    cursor.execute("SELECT * FROM product_variants WHERE product_id = ?", (product[0],))
    variants = []
    for variant in cursor.fetchall():
        variants.append({
            "id": variant[0],
            "name": variant[2],
            "sku": variant[3],
            "price": float(variant[4]) if variant[4] else None,
            "stock_quantity": variant[6],
            "options": json.loads(variant[7]) if variant[7] else {},
            "image": variant[8]
        })
    
    # Get reviews
    cursor.execute("""
        SELECT r.*, u.first_name, u.last_name, u.avatar
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.product_id = ? AND r.status = 'approved'
        ORDER BY r.created_at DESC
    """, (product[0],))
    
    reviews = []
    for review in cursor.fetchall():
        reviews.append({
            "id": review[0],
            "rating": review[3],
            "title": review[4],
            "content": review[5],
            "verified_purchase": bool(review[6]),
            "helpful_count": review[7],
            "created_at": review[9],
            "user": {
                "name": f"{review[10]} {review[11]}",
                "avatar": review[12]
            }
        })
    
    # Calculate average rating
    avg_rating = sum(r["rating"] for r in reviews) / len(reviews) if reviews else 0
    
    product_data = {
        "id": product[0],
        "name": product[1],
        "slug": product[2],
        "description": product[3],
        "short_description": product[4],
        "sku": product[5],
        "price": float(product[6]),
        "compare_price": float(product[7]) if product[7] else None,
        "stock_quantity": product[9],
        "weight": float(product[11]) if product[11] else None,
        "dimensions": product[12],
        "images": json.loads(product[13]) if product[13] else [],
        "featured": bool(product[16]),
        "variants": variants,
        "reviews": reviews,
        "rating": round(avg_rating, 1),
        "review_count": len(reviews)
    }
    
    conn.close()
    return jsonify(product_data)

@app.route("/api/cart", methods=["GET", "POST", "PUT", "DELETE"])
def handle_cart():
    """Handle cart operations"""
    user_id = request.args.get("user_id") or request.json.get("user_id") if request.json else None
    session_id = request.args.get("session_id") or request.json.get("session_id") if request.json else None
    
    conn = sqlite3.connect("ecommerce.db")
    cursor = conn.cursor()
    
    if request.method == "GET":
        # Get cart items
        if user_id:
            cursor.execute("SELECT id FROM carts WHERE user_id = ?", (user_id,))
        else:
            cursor.execute("SELECT id FROM carts WHERE session_id = ?", (session_id,))
        
        cart = cursor.fetchone()
        if not cart:
            return jsonify({"items": [], "total": 0})
        
        cursor.execute("""
            SELECT ci.*, p.name, p.slug, p.images, p.price as current_price,
                   pv.name as variant_name, pv.variant_options
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            LEFT JOIN product_variants pv ON ci.variant_id = pv.id
            WHERE ci.cart_id = ?
        """, (cart[0],))
        
        items = []
        total = 0
        
        for item in cursor.fetchall():
            item_total = float(item[4]) * item[3]  # price * quantity
            total += item_total
            
            items.append({
                "id": item[0],
                "product_id": item[1],
                "variant_id": item[2],
                "quantity": item[3],
                "price": float(item[4]),
                "total": item_total,
                "product": {
                    "name": item[6],
                    "slug": item[7],
                    "images": json.loads(item[8]) if item[8] else [],
                    "current_price": float(item[9])
                },
                "variant": {
                    "name": item[10],
                    "options": json.loads(item[11]) if item[11] else {}
                } if item[10] else None
            })
        
        conn.close()
        return jsonify({"items": items, "total": round(total, 2)})
    
    elif request.method == "POST":
        # Add item to cart
        data = request.json
        
        # Get or create cart
        if user_id:
            cursor.execute("SELECT id FROM carts WHERE user_id = ?", (user_id,))
        else:
            cursor.execute("SELECT id FROM carts WHERE session_id = ?", (session_id,))
        
        cart = cursor.fetchone()
        if not cart:
            cursor.execute("""
                INSERT INTO carts (user_id, session_id) VALUES (?, ?)
            """, (user_id, session_id))
            cart_id = cursor.lastrowid
        else:
            cart_id = cart[0]
        
        # Check stock availability
        if not InventoryManager.check_stock_availability(
            data["product_id"], 
            data.get("variant_id"), 
            data["quantity"]
        ):
            return jsonify({"error": "Insufficient stock"}), 400
        
        # Add or update cart item
        cursor.execute("""
            SELECT id, quantity FROM cart_items 
            WHERE cart_id = ? AND product_id = ? AND variant_id = ?
        """, (cart_id, data["product_id"], data.get("variant_id")))
        
        existing_item = cursor.fetchone()
        if existing_item:
            new_quantity = existing_item[1] + data["quantity"]
            cursor.execute("""
                UPDATE cart_items SET quantity = ? WHERE id = ?
            """, (new_quantity, existing_item[0]))
        else:
            cursor.execute("""
                INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, price)
                VALUES (?, ?, ?, ?, ?)
            """, (cart_id, data["product_id"], data.get("variant_id"), 
                  data["quantity"], data["price"]))
        
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Item added to cart"}), 201

@app.route("/api/orders", methods=["POST"])
def create_order():
    """Create a new order"""
    data = request.json
    
    conn = sqlite3.connect("ecommerce.db")
    cursor = conn.cursor()
    
    # Generate order number
    order_number = OrderManager.generate_order_number()
    
    # Calculate totals
    totals = OrderManager.calculate_order_total(
        data["items"],
        data.get("shipping_amount", 0),
        data.get("tax_rate", 0.08),
        data.get("discount_amount", 0)
    )
    
    # Create order
    cursor.execute("""
        INSERT INTO orders (user_id, order_number, subtotal, tax_amount, 
                           shipping_amount, discount_amount, total_amount, 
                           payment_method, shipping_address, billing_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["user_id"],
        order_number,
        totals["subtotal"],
        totals["tax_amount"],
        totals["shipping_amount"],
        totals["discount_amount"],
        totals["total"],
        data.get("payment_method", "stripe"),
        json.dumps(data.get("shipping_address", {})),
        json.dumps(data.get("billing_address", {}))
    ))
    
    order_id = cursor.lastrowid
    
    # Add order items and update inventory
    for item in data["items"]:
        cursor.execute("""
            INSERT INTO order_items (order_id, product_id, variant_id, 
                                   product_name, variant_name, quantity, price, total)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            order_id,
            item["product_id"],
            item.get("variant_id"),
            item["product_name"],
            item.get("variant_name"),
            item["quantity"],
            item["price"],
            item["price"] * item["quantity"]
        ))
        
        # Update inventory
        InventoryManager.update_stock(
            item["product_id"],
            item.get("variant_id"),
            -item["quantity"]
        )
    
    conn.commit()
    conn.close()
    
    # Emit real-time order notification
    socketio.emit("new_order", {
        "order_id": order_id,
        "order_number": order_number,
        "user_id": data["user_id"],
        "total": totals["total"],
        "timestamp": datetime.now().isoformat()
    })
    
    return jsonify({
        "order_id": order_id,
        "order_number": order_number,
        "total": totals["total"],
        "message": "Order created successfully"
    }), 201

# WebSocket events for real-time features
@socketio.on("connect")
def handle_connect():
    """Handle client connection"""
    print("E-commerce client connected")
    emit("status", {"message": "Connected to E-commerce Platform API"})

@socketio.on("track_product_view")
def handle_product_view(data):
    """Track product view for analytics"""
    emit("product_viewed", {
        "product_id": data["product_id"],
        "user_id": data.get("user_id"),
        "timestamp": datetime.now().isoformat()
    }, broadcast=True)

if __name__ == "__main__":
    init_db()
    print("🛒 E-commerce Platform Python API Server starting...")
    print("🗄️  Database initialized")
    print("💳 Payment processing ready")
    print("📦 Inventory management active")
    print("🚀 Server running on http://localhost:5006")
    socketio.run(app, debug=True, host="0.0.0.0", port=5006)
