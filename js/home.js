/**
 * 3D Enhanced Home Page JavaScript
 * Handles advanced 3D interactions, animations, and particle effects
 */

class HomePage {
    constructor() {
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.windowCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.init();
    }

    /**
     * Initialize home page functionality
     */
    init() {
        this.setupLoadingScreen();
        this.createParticles();
        this.setupMouseTracking();
        this.setup3DInteractions();
        this.setupAnimatedCounters();
        this.setupScrollAnimations();
        this.setupProfileCardInteractions();
        this.enhanceButtons();
    }

    /**
     * Setup and handle loading screen with 3D effects
     */
    setupLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    this.revealContentWith3D();
                }, 500);
            }
        }, 2500);
    }

    /**
     * Reveal main content with 3D animations
     */
    revealContentWith3D() {
        const heroSection = document.querySelector('.hero-section');
        const profileCard = document.querySelector('.profile-card-3d');
        
        if (heroSection) {
            heroSection.style.opacity = '0';
            heroSection.style.transform = 'translateY(50px) rotateX(10deg)';
            
            setTimeout(() => {
                heroSection.style.transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                heroSection.style.opacity = '1';
                heroSection.style.transform = 'translateY(0) rotateX(0deg)';
            }, 100);
        }

        if (profileCard) {
            setTimeout(() => {
                profileCard.style.opacity = '1';
                profileCard.style.transform = 'translateY(0) rotateY(0deg)';
            }, 400);
        }
    }

    /**
     * Create floating particles background
     */
    createParticles() {
        const particleContainer = document.querySelector('.particles-container');
        if (!particleContainer) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position and properties
            const size = Math.random() * 4 + 2;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const opacity = Math.random() * 0.5 + 0.1;
            
            particle.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, ${opacity});
                border-radius: 50%;
                pointer-events: none;
                transition: transform 0.3s ease;
            `;
            
            particleContainer.appendChild(particle);
            
            this.particles.push({
                element: particle,
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                originalX: x,
                originalY: y
            });
        }
        
        this.animateParticles();
    }

    /**
     * Animate particles movement
     */
    animateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x <= 0 || particle.x >= window.innerWidth) particle.vx *= -1;
            if (particle.y <= 0 || particle.y >= window.innerHeight) particle.vy *= -1;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.x -= dx * force * 0.01;
                particle.y -= dy * force * 0.01;
            }
            
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        });
        
        requestAnimationFrame(() => this.animateParticles());
    }

    /**
     * Setup mouse tracking for parallax effects
     */
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Calculate mouse position relative to center
            const xOffset = (e.clientX - this.windowCenter.x) / this.windowCenter.x;
            const yOffset = (e.clientY - this.windowCenter.y) / this.windowCenter.y;
            
            // Apply parallax to hero content
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                const rotateX = yOffset * 5;
                const rotateY = xOffset * 5;
                heroContent.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
            }
            
            // Apply parallax to profile card
            const profileCard = document.querySelector('.profile-card-3d');
            if (profileCard) {
                const rotateX = yOffset * 10;
                const rotateY = xOffset * 10;
                profileCard.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateZ(50px)`;
            }
        });
        
        // Reset transforms when mouse leaves
        document.addEventListener('mouseleave', () => {
            const heroContent = document.querySelector('.hero-content');
            const profileCard = document.querySelector('.profile-card-3d');
            
            if (heroContent) {
                heroContent.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            }
            if (profileCard) {
                profileCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(50px)';
            }
        });
    }

    /**
     * Setup 3D interactions for various elements
     */
    setup3DInteractions() {
        // 3D tilt effect for cards
        const tiltElements = document.querySelectorAll('.stat-item, .featured-project');
        
        tiltElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'perspective(1000px) rotateX(-5deg) rotateY(5deg) translateZ(20px)';
            });
            
            element.addEventListener('mousemove', (e) => {
                const rect = e.target.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * 10;
                const rotateY = (centerX - x) / centerX * 10;
                
                e.target.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });
            
            element.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }

    /**
     * Setup animated counters with 3D effects
     */
    setupAnimatedCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const animateCounter = (element, target) => {
            const increment = target / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                element.textContent = Math.floor(current) + (target >= 100 ? '+' : '');
                
                // Add pulse effect during animation
                element.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 100);
            }, 50);
        };
        
        // Intersection Observer for triggering animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const targetValue = parseInt(element.getAttribute('data-target') || element.textContent);
                    animateCounter(element, targetValue);
                    observer.unobserve(element);
                }
            });
        });
        
        statNumbers.forEach(number => {
            // Store original value as data attribute
            number.setAttribute('data-target', parseInt(number.textContent));
            number.textContent = '0';
            observer.observe(number);
        });
    }

    /**
     * Setup scroll-triggered animations
     */
    setupScrollAnimations() {
        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1
        });
        
        // Observe elements for scroll animations
        const animateElements = document.querySelectorAll('.stats-section, .featured-work, .cta-section');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px) rotateX(10deg)';
            animateOnScroll.observe(el);
        });
        
        // Add CSS animation class
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) rotateX(0deg) !important;
                transition: all 1s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Setup profile card 3D interactions
     */
    setupProfileCardInteractions() {
        const profileCard = document.querySelector('.profile-card-3d');
        if (!profileCard) return;
        
        profileCard.addEventListener('mouseenter', () => {
            profileCard.style.transform = 'perspective(1000px) rotateY(10deg) rotateX(-5deg) translateZ(50px)';
            profileCard.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        });
        
        profileCard.addEventListener('mouseleave', () => {
            profileCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(50px)';
            profileCard.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        });
        
        // Add floating animation
        setInterval(() => {
            const randomY = Math.sin(Date.now() * 0.001) * 10;
            profileCard.style.transform += ` translateY(${randomY}px)`;
        }, 50);
    }

    /**
     * Enhance buttons with 3D effects
     */
    enhanceButtons() {
        const buttons = document.querySelectorAll('.cta-btn, .btn-3d');
        
        buttons.forEach(button => {
            // Add ripple effect
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${size}px;
                    height: ${size}px;
                `;
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
            
            // Add 3D hover effects
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'perspective(1000px) rotateX(-5deg) translateZ(10px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'perspective(1000px) rotateX(0deg) translateZ(0px)';
            });
        });
        
        // Add ripple animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Handle window resize for particle system
     */
    handleResize() {
        this.windowCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        
        // Reposition particles
        this.particles.forEach(particle => {
            if (particle.x > window.innerWidth) particle.x = window.innerWidth;
            if (particle.y > window.innerHeight) particle.y = window.innerHeight;
        });
    }
}

// Initialize home page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for base.js to initialize
    setTimeout(() => {
        window.homePage = new HomePage();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.homePage) {
                window.homePage.handleResize();
            }
        });
    }, 100);
});

// Performance optimization: Reduce animations on low-end devices
if (navigator.hardwareConcurrency < 4 || navigator.connection?.effectiveType === 'slow-2g') {
    document.documentElement.style.setProperty('--reduce-motion', '1');
}

// Production - Remove console.log for performance
// console.log('🚀 3D Enhanced Home Page Script Loaded');
