/**
 * Home Page JavaScript
 * Handles home-specific functionality including loading screen
 */

class HomePage {
    constructor() {
        this.init();
    }

    /**
     * Initialize home page functionality
     */
    init() {
        this.setupLoadingScreen();
        this.enhanceHomeContent();
        this.setupTypewriter();
    }

    /**
     * Setup and handle loading screen
     */
    setupLoadingScreen() {
        // Hide loading screen after 2.5 seconds
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    this.showMainContent();
                }, 500);
            }
        }, 2500);
    }

    /**
     * Show main content with animation
     */
    showMainContent() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(20px)';
            
            // Trigger animation
            setTimeout(() => {
                mainContent.style.transition = 'all 0.8s ease';
                mainContent.style.opacity = '1';
                mainContent.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    /**
     * Enhance home content with additional elements
     */
    enhanceHomeContent() {
        const contentCenter = document.querySelector('.content-center');
        if (contentCenter) {
            // Add welcome section
            const welcomeSection = document.createElement('div');
            welcomeSection.className = 'welcome-section';
            welcomeSection.innerHTML = `
                <h2>Welcome to My Portfolio</h2>
                <p>I'm a passionate developer with expertise in modern web technologies. Explore my work, learn about my journey, and let's connect!</p>
                <div class="welcome-buttons">
                    <a href="about.html" class="btn btn-primary">
                        <i class="fas fa-user"></i>
                        Learn About Me
                    </a>
                    <a href="projects.html" class="btn btn-outline">
                        <i class="fas fa-code"></i>
                        View My Work
                    </a>
                </div>
            `;
            
            contentCenter.appendChild(welcomeSection);

            // Add quick stats
            const statsSection = document.createElement('div');
            statsSection.className = 'quick-stats';
            statsSection.innerHTML = `
                <div class="stat-card">
                    <div class="stat-number">5+</div>
                    <div class="stat-label">Years of Experience</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">50+</div>
                    <div class="stat-label">Projects Completed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">10+</div>
                    <div class="stat-label">Technologies Mastered</div>
                </div>
            `;
            
            contentCenter.appendChild(statsSection);
        }
    }

    /**
     * Setup typewriter effect for the main heading
     */
    setupTypewriter() {
        setTimeout(() => {
            const heading = document.querySelector('.content-center h1');
            if (heading) {
                const text = heading.textContent;
                heading.textContent = '';
                heading.style.opacity = '1';
                
                let i = 0;
                const typeInterval = setInterval(() => {
                    if (i < text.length) {
                        heading.textContent += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(typeInterval);
                        // Add blinking cursor effect
                        heading.innerHTML += '<span class="cursor">|</span>';
                        
                        // Style the cursor
                        const cursor = heading.querySelector('.cursor');
                        if (cursor) {
                            cursor.style.animation = 'blink 1s infinite';
                            
                            // Add cursor animation to CSS if not present
                            const style = document.createElement('style');
                            style.textContent = `
                                @keyframes blink {
                                    0%, 50% { opacity: 1; }
                                    51%, 100% { opacity: 0; }
                                }
                            `;
                            document.head.appendChild(style);
                        }
                    }
                }, 100);
            }
        }, 3000); // Start after loading screen
    }

    /**
     * Add smooth scrolling to anchor links
     */
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Initialize home page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for base.js to initialize
    setTimeout(() => {
        window.homePage = new HomePage();
    }, 100);
});

console.log('🏠 Home Page Script Loaded');
