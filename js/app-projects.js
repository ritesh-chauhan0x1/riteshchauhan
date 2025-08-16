// App Projects JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializeAppProjects();
});

function initializeAppProjects() {
    // Set up filter functionality
    setupFilters();
    
    // Set up demo modal
    setupDemoModal();
    
    // Set up load more functionality
    setupLoadMore();
    
    // Add scroll animations
    setupScrollAnimations();
}

// Filter Functionality
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.dataset.filter;
            
            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    showCard(card);
                } else {
                    const categories = card.dataset.category.split(' ');
                    if (categories.includes(filterValue)) {
                        showCard(card);
                    } else {
                        hideCard(card);
                    }
                }
            });
        });
    });
}

function showCard(card) {
    card.classList.remove('hidden');
    card.style.display = 'block';
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 10);
}

function hideCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
        card.classList.add('hidden');
        card.style.display = 'none';
    }, 300);
}

// Demo Modal Functionality
function setupDemoModal() {
    const demoButtons = document.querySelectorAll('.btn-demo');
    const modal = document.getElementById('demoModal');
    const modalTitle = document.getElementById('modalTitle');
    const demoContainer = document.getElementById('demoContainer');

    demoButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const demoType = btn.dataset.demo;
            openDemoModal(demoType);
        });
    });
}

function openDemoModal(demoType) {
    const modal = document.getElementById('demoModal');
    const modalTitle = document.getElementById('modalTitle');
    const demoContainer = document.getElementById('demoContainer');
    
    // Demo content based on project type
    const demoContent = getDemoContent(demoType);
    
    modalTitle.textContent = demoContent.title;
    demoContainer.innerHTML = demoContent.content;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDemoModal() {
    const modal = document.getElementById('demoModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function getDemoContent(demoType) {
    const demoData = {
        'whatsapp-mobile': {
            title: 'WhatsApp Mobile Demo',
            content: `
                <div class="demo-preview">
                    <h4><i class="fab fa-whatsapp"></i> WhatsApp Clone Mobile</h4>
                    <p>Experience the full mobile messaging experience with real-time chat, voice messages, and video calls.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-comment"></i>
                            <span>Real-time Messaging</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-microphone"></i>
                            <span>Voice Messages</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-video"></i>
                            <span>Video Calls</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-users"></i>
                            <span>Group Chats</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://expo.dev/@ritesh-chauhan/whatsapp-clone" target="_blank" class="demo-link">
                            <i class="fas fa-mobile-alt"></i> Try on Mobile (Expo)
                        </a>
                        <span class="demo-note">Scan QR code with Expo Go app to test on your device</span>
                    </div>
                </div>
            `
        },
        'instagram-mobile': {
            title: 'Instagram Mobile Demo',
            content: `
                <div class="demo-preview">
                    <h4><i class="fab fa-instagram"></i> Instagram Clone Mobile</h4>
                    <p>Full-featured social media app with photo sharing, stories, and live streaming.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-camera"></i>
                            <span>Photo/Video Sharing</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-eye"></i>
                            <span>Stories & Reels</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-filter"></i>
                            <span>Camera Filters</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-broadcast-tower"></i>
                            <span>Live Streaming</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://expo.dev/@ritesh-chauhan/instagram-clone" target="_blank" class="demo-link">
                            <i class="fas fa-mobile-alt"></i> Try on Mobile (Expo)
                        </a>
                        <span class="demo-note">Camera permissions required for full functionality</span>
                    </div>
                </div>
            `
        },
        'tiktok-mobile': {
            title: 'TikTok Mobile Demo',
            content: `
                <div class="demo-preview">
                    <h4><i class="fab fa-tiktok"></i> TikTok Clone Mobile</h4>
                    <p>Short-form video sharing app with AI-powered feed and video editing tools.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-video"></i>
                            <span>Video Recording</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-robot"></i>
                            <span>AI-Powered Feed</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-magic"></i>
                            <span>Video Effects</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-music"></i>
                            <span>Music Integration</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://expo.dev/@ritesh-chauhan/tiktok-clone" target="_blank" class="demo-link">
                            <i class="fas fa-mobile-alt"></i> Try on Mobile (Expo)
                        </a>
                        <span class="demo-note">Swipe up/down to browse videos, record with camera</span>
                    </div>
                </div>
            `
        },
        'uber-mobile': {
            title: 'Uber Mobile Demo',
            content: `
                <div class="demo-preview">
                    <h4><i class="fas fa-car"></i> Uber Clone Mobile</h4>
                    <p>Complete ride-sharing app with real-time GPS tracking and driver matching.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Real-time Tracking</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-search"></i>
                            <span>Driver Matching</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-credit-card"></i>
                            <span>Payment Integration</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-history"></i>
                            <span>Trip History</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://expo.dev/@ritesh-chauhan/uber-clone" target="_blank" class="demo-link">
                            <i class="fas fa-mobile-alt"></i> Try on Mobile (Expo)
                        </a>
                        <span class="demo-note">Location permissions required for GPS functionality</span>
                    </div>
                </div>
            `
        },
        'spotify-mobile': {
            title: 'Spotify Mobile Demo',
            content: `
                <div class="demo-preview">
                    <h4><i class="fab fa-spotify"></i> Spotify Clone Mobile</h4>
                    <p>Full-featured music streaming app with offline downloads and personalized playlists.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-music"></i>
                            <span>Music Streaming</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-download"></i>
                            <span>Offline Downloads</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-list"></i>
                            <span>Playlist Management</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-podcast"></i>
                            <span>Podcasts</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://github.com/ritesh-chauhan0x1/spotify-flutter/releases" target="_blank" class="demo-link">
                            <i class="fas fa-download"></i> Download APK
                        </a>
                        <span class="demo-note">Flutter app - install APK on Android or build for iOS</span>
                    </div>
                </div>
            `
        },
        'weather-mobile': {
            title: 'Weather Mobile Demo',
            content: `
                <div class="demo-preview">
                    <h4><i class="fas fa-cloud-sun"></i> Advanced Weather App</h4>
                    <p>Beautiful weather app with animated backgrounds and detailed forecasts.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-thermometer-half"></i>
                            <span>Animated UI</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-map"></i>
                            <span>Weather Maps</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>Severe Alerts</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-th"></i>
                            <span>Home Widgets</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://github.com/ritesh-chauhan0x1/weather-flutter/releases" target="_blank" class="demo-link">
                            <i class="fas fa-download"></i> Download APK
                        </a>
                        <span class="demo-note">Allow location access for personalized weather data</span>
                    </div>
                </div>
            `
        },
        'ecommerce-mobile': {
            title: 'E-Commerce Mobile Demo',
            content: `
                <div class="demo-preview">
                    <h4><i class="fas fa-shopping-bag"></i> E-Commerce Mobile App</h4>
                    <p>Complete shopping experience with AR try-on and secure payments.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-cube"></i>
                            <span>AR Try-On</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-lock"></i>
                            <span>Secure Payments</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-truck"></i>
                            <span>Order Tracking</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-star"></i>
                            <span>Product Reviews</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://expo.dev/@ritesh-chauhan/ecommerce-app" target="_blank" class="demo-link">
                            <i class="fas fa-mobile-alt"></i> Try on Mobile (Expo)
                        </a>
                        <span class="demo-note">Test card: 4242 4242 4242 4242 for payments</span>
                    </div>
                </div>
            `
        },
        'fitness-mobile': {
            title: 'Fitness Tracker Demo',
            content: `
                <div class="demo-preview">
                    <h4><i class="fas fa-running"></i> Fitness Tracker App</h4>
                    <p>Comprehensive fitness app with workout tracking and social challenges.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-dumbbell"></i>
                            <span>Workout Tracking</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-apple-alt"></i>
                            <span>Nutrition Logging</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-chart-line"></i>
                            <span>Progress Analytics</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-trophy"></i>
                            <span>Social Challenges</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://fitness-tracker-demo.ionic.io" target="_blank" class="demo-link">
                            <i class="fas fa-globe"></i> Try Web Version
                        </a>
                        <span class="demo-note">Connect fitness trackers for automatic data sync</span>
                    </div>
                </div>
            `
        },
        'news-mobile': {
            title: 'News Mobile Demo',
            content: `
                <div class="demo-preview">
                    <h4><i class="fas fa-newspaper"></i> Personalized News App</h4>
                    <p>AI-powered news app with personalized feeds and offline reading.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-robot"></i>
                            <span>AI Personalization</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-download"></i>
                            <span>Offline Reading</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-bell"></i>
                            <span>Push Notifications</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-share"></i>
                            <span>Social Sharing</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://github.com/ritesh-chauhan0x1/news-flutter/releases" target="_blank" class="demo-link">
                            <i class="fas fa-download"></i> Download APK
                        </a>
                        <span class="demo-note">Personalized feed learns from your reading habits</span>
                    </div>
                </div>
            `
        },
        'food-delivery': {
            title: 'Food Delivery Demo',
            content: `
                <div class="demo-preview">
                    <h4><i class="fas fa-utensils"></i> Food Delivery App</h4>
                    <p>Complete food delivery platform with restaurant discovery and real-time tracking.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-search"></i>
                            <span>Restaurant Discovery</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-route"></i>
                            <span>Real-time Tracking</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-store"></i>
                            <span>Multi-vendor Support</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-star"></i>
                            <span>Review System</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://expo.dev/@ritesh-chauhan/food-delivery" target="_blank" class="demo-link">
                            <i class="fas fa-mobile-alt"></i> Try on Mobile (Expo)
                        </a>
                        <span class="demo-note">Use demo location for testing restaurant listings</span>
                    </div>
                </div>
            `
        },
        'task-manager-mobile': {
            title: 'Task Manager Mobile Demo',
            content: `
                <div class="demo-preview">
                    <h4><i class="fas fa-tasks"></i> Task Manager Mobile</h4>
                    <p>Advanced task management with team collaboration and analytics.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-users"></i>
                            <span>Team Collaboration</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-clock"></i>
                            <span>Time Tracking</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Calendar Sync</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-chart-bar"></i>
                            <span>Analytics</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://task-manager-mobile.ionic.io" target="_blank" class="demo-link">
                            <i class="fas fa-globe"></i> Try Web Version
                        </a>
                        <span class="demo-note">Sync across all devices with cloud storage</span>
                    </div>
                </div>
            `
        },
        'crypto-tracker': {
            title: 'Crypto Tracker Demo',
            content: `
                <div class="demo-preview">
                    <h4><i class="fab fa-bitcoin"></i> Crypto Portfolio Tracker</h4>
                    <p>Native cryptocurrency tracking with real-time prices and portfolio management.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-chart-line"></i>
                            <span>Real-time Prices</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-briefcase"></i>
                            <span>Portfolio Tracking</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-bell"></i>
                            <span>Price Alerts</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-chart-area"></i>
                            <span>Advanced Charts</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://github.com/ritesh-chauhan0x1/crypto-tracker/releases" target="_blank" class="demo-link">
                            <i class="fas fa-download"></i> Download APK
                        </a>
                        <span class="demo-note">Native Android/iOS app with offline data caching</span>
                    </div>
                </div>
            `
        }
    };

    return demoData[demoType] || {
        title: 'App Demo',
        content: `
            <div class="demo-preview">
                <h4>Mobile Demo Coming Soon</h4>
                <p>This mobile app demo is currently being prepared. Check back soon!</p>
                <div class="demo-actions">
                    <span class="demo-note">Demo will be available on App Store and Google Play</span>
                </div>
            </div>
        `
    };
}

// Load More Functionality
function setupLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let hasMoreProjects = false; // Set to true if you have more projects to load

    if (!hasMoreProjects) {
        loadMoreBtn.style.display = 'none';
    }

    loadMoreBtn.addEventListener('click', () => {
        // Simulate loading more projects
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        setTimeout(() => {
            // Add more project cards here
            loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Apps';
            // If no more projects, hide button
            // loadMoreBtn.style.display = 'none';
        }, 1000);
    });
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all project cards
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
}

// Global function to close modal (called from HTML)
window.closeDemoModal = closeDemoModal;
