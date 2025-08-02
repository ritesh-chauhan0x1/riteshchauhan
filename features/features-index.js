class FeaturesIndex {
    constructor() {
        this.isMatrixMode = false;
        this.customCursorEnabled = false;
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        this.konamiIndex = 0;
        this.currentCategory = 'interactive';
        
        this.init();
    }

    init() {
        this.setupAnimations();
        this.setupKonamiCode();
        this.setupScrollAnimations();
        this.setupCategoryNavigation();
        this.createParticleBackground();
        this.animateStats();
    }

    setupAnimations() {
        // Stagger animation for feature cards
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.2)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = 'none';
            });
        });
    }

    setupCategoryNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        const categories = document.querySelectorAll('.feature-category');
        
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetCategory = btn.dataset.category;
                
                // Update active nav button
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Show target category
                categories.forEach(cat => {
                    cat.classList.remove('active');
                    if (cat.dataset.category === targetCategory) {
                        setTimeout(() => cat.classList.add('active'), 100);
                    }
                });
                
                this.currentCategory = targetCategory;
            });
        });
    }

    animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = target.textContent;
                    this.animateNumber(target, finalValue);
                }
            });
        }, observerOptions);

        stats.forEach(stat => observer.observe(stat));
    }

    animateNumber(element, finalValue) {
        if (finalValue === '∞') {
            let count = 0;
            const interval = setInterval(() => {
                element.textContent = count;
                count += Math.floor(Math.random() * 50) + 10;
                if (count > 500) {
                    clearInterval(interval);
                    element.textContent = '∞';
                }
            }, 50);
            return;
        }

        const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
        let current = 0;
        const increment = numericValue / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            element.textContent = finalValue.includes('%') ? 
                `${Math.floor(current)}%` : 
                `${Math.floor(current)}+`;
        }, 30);
    }

    setupKonamiCode() {
        document.addEventListener('keydown', (e) => {
            if (e.code === this.konamiCode[this.konamiIndex]) {
                this.konamiIndex++;
                if (this.konamiIndex === this.konamiCode.length) {
                    this.activateKonamiCode();
                    this.konamiIndex = 0;
                }
            } else {
                this.konamiIndex = 0;
            }
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card, .tech-item').forEach(el => {
            observer.observe(el);
        });
    }

    createParticleBackground() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.1';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticles = () => {
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((particle, index) => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
                ctx.fill();

                // Connect nearby particles
                particles.slice(index + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(102, 126, 234, ${0.1 * (1 - distance / 100)})`;
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animateParticles);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        createParticles();
        animateParticles();
    }
}

// Feature demonstration functions
function openFeature(url) {
    if (url.startsWith('#')) {
        // Scroll to section
        const element = document.querySelector(url);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // Open in new tab
        window.open(url, '_blank');
    }
}

function demonstrateTheme() {
    const body = document.body;
    const isDark = body.style.background === 'rgb(15, 15, 15)' || body.style.background === '#0f0f0f' || !body.style.background;
    
    if (isDark) {
        body.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
        body.style.color = '#2d3748';
        body.style.transition = 'all 0.5s ease';
        body.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            body.style.transform = 'scale(1)';
        }, 250);
        
        setTimeout(() => {
            body.style.background = '#0f0f0f';
            body.style.color = '#ffffff';
            body.style.transform = 'scale(1.05)';
            setTimeout(() => {
                body.style.transform = 'scale(1)';
            }, 250);
        }, 2000);
    }
}

function demonstrate3D() {
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'perspective(1000px) rotateX(15deg) rotateY(15deg) translateZ(50px)';
            card.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            }, 1000);
        }, index * 100);
    });
}

function demonstrateMorphing(button) {
    button.classList.add('loading');
    button.textContent = 'Processing...';
    
    setTimeout(() => {
        button.textContent = '✓ Complete!';
        button.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
        
        setTimeout(() => {
            button.classList.remove('loading');
            button.textContent = 'Test Morphing 🔄';
            button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }, 1500);
    }, 2000);
}

function triggerConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#667eea', '#764ba2', '#60efff', '#00ff87', '#feca57', '#ff9ff3'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        container.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
}

function enableCustomCursor() {
    if (window.featuresIndex.customCursorEnabled) {
        document.querySelector('.custom-cursor')?.remove();
        document.body.style.cursor = 'auto';
        window.featuresIndex.customCursorEnabled = false;
        return;
    }

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    document.body.style.cursor = 'none';
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    const animateCursor = () => {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    };
    
    animateCursor();
    
    // Add hover effects
    document.querySelectorAll('button, .feature-card, a').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    
    window.featuresIndex.customCursorEnabled = true;
}

function revealSecret(type) {
    if (type === 'snake') {
        alert('🐍 Secret Command Revealed!\n\nGo to the Terminal About Me feature and type: "snake"\n\nThen use WASD keys to play!');
    }
}

function showKonamiHint() {
    alert('🎮 Konami Code Hint:\n\n↑ ↑ ↓ ↓ ← → ← → B A\n\nUse your arrow keys followed by B and A keys!\n\nSomething special will happen... 😉');
}

function enterMatrix() {
    if (window.featuresIndex.isMatrixMode) {
        exitMatrix();
        return;
    }
    
    document.body.classList.add('matrix-mode');
    
    const matrixRain = document.createElement('div');
    matrixRain.className = 'matrix-rain';
    matrixRain.id = 'matrixRain';
    document.body.appendChild(matrixRain);
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    const createMatrixChar = () => {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        char.textContent = chars[Math.floor(Math.random() * chars.length)];
        char.style.left = Math.random() * 100 + '%';
        char.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        matrixRain.appendChild(char);
        
        setTimeout(() => {
            char.remove();
        }, 5000);
    };
    
    const matrixInterval = setInterval(createMatrixChar, 100);
    
    // Auto-exit after 10 seconds
    setTimeout(() => {
        clearInterval(matrixInterval);
        exitMatrix();
    }, 10000);
    
    window.featuresIndex.isMatrixMode = true;
    window.featuresIndex.matrixInterval = matrixInterval;
}

function exitMatrix() {
    document.body.classList.remove('matrix-mode');
    document.getElementById('matrixRain')?.remove();
    
    if (window.featuresIndex.matrixInterval) {
        clearInterval(window.featuresIndex.matrixInterval);
    }
    
    window.featuresIndex.isMatrixMode = false;
}

function contactMe() {
    window.open('mailto:ritesh.chauhan@email.com?subject=Let\'s Build Something Amazing!&body=Hi Ritesh,\n\nI was impressed by your interactive portfolio features and would love to discuss potential opportunities.\n\nBest regards,', '_blank');
}

// Konami Code activation
function activateKonamiCode() {
    // Create a special animation
    const body = document.body;
    body.style.animation = 'none';
    
    // Rainbow background effect
    const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
    let colorIndex = 0;
    
    const rainbowInterval = setInterval(() => {
        body.style.background = `linear-gradient(135deg, ${colors[colorIndex]} 0%, ${colors[(colorIndex + 1) % colors.length]} 100%)`;
        colorIndex = (colorIndex + 1) % colors.length;
    }, 200);
    
    // Show special message
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        z-index: 10000;
        font-size: 2rem;
        border: 3px solid #fff;
        animation: pulse 1s infinite;
    `;
    message.innerHTML = `
        🎉 KONAMI CODE ACTIVATED! 🎉<br>
        <span style="font-size: 1.2rem;">You found the secret!</span><br>
        <button onclick="this.parentElement.remove(); clearInterval(${rainbowInterval}); document.body.style.background='#0f0f0f';" 
                style="margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 10px; cursor: pointer;">
            Close
        </button>
    `;
    
    document.body.appendChild(message);
    
    // Trigger confetti
    triggerConfetti();
    
    // Auto-close after 10 seconds
    setTimeout(() => {
        message.remove();
        clearInterval(rainbowInterval);
        body.style.background = '#0f0f0f';
    }, 10000);
}

// Global functions for button interactions
function scrollToFeatures() {
    document.getElementById('features-showcase').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function openFeature(url) {
    if (url.startsWith('#')) {
        // Scroll to section
        const element = document.querySelector(url);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // Open new page
        window.open(url, '_blank');
    }
}

function contactMe() {
    window.open('mailto:rites.chauhan11@gmail.com?subject=Let\'s Build Something Amazing!&body=Hi Ritesh,%0D%0A%0D%0AI was impressed by your interactive portfolio features and would love to discuss a collaboration opportunity.%0D%0A%0D%0ABest regards', '_blank');
}

function demonstrateTheme() {
    const body = document.body;
    const originalBg = body.style.background;
    
    // Theme transition animation
    body.style.transition = 'all 1s ease';
    body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    setTimeout(() => {
        body.style.background = 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)';
    }, 1000);
    
    setTimeout(() => {
        body.style.background = originalBg || '#0f0f0f';
        body.style.transition = '';
    }, 2000);
}

function demonstrate3D() {
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'perspective(1000px) rotateX(10deg) rotateY(10deg) translateZ(20px)';
            card.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.3)';
            
            setTimeout(() => {
                card.style.transform = '';
                card.style.boxShadow = '';
            }, 1500);
        }, index * 200);
    });
}

function demonstrateMorphing(button) {
    const originalText = button.innerHTML;
    const originalStyle = button.style.cssText;
    
    // Morph to loading state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        // Morph to success state
        button.innerHTML = '<i class="fas fa-check"></i> Complete!';
        button.style.background = 'linear-gradient(135deg, #00ff87, #60efff)';
        button.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            // Return to original state
            button.innerHTML = originalText;
            button.style.cssText = originalStyle;
        }, 2000);
    }, 2000);
}

function revealSecret(type) {
    const messages = {
        snake: 'Type "snake" in the terminal to play the hidden Snake game! 🐍',
        konami: 'Try the Konami Code: ↑↑↓↓←→←→BA 🎮'
    };
    
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 300px;
        animation: slideInRight 0.5s ease;
    `;
    toast.textContent = messages[type] || 'Secret revealed!';
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

function showKonamiHint() {
    revealSecret('konami');
}

function enterMatrix() {
    window.featuresIndex?.enterMatrix();
}

function enableCustomCursor() {
    if (window.featuresIndex) {
        window.featuresIndex.customCursorEnabled = !window.featuresIndex.customCursorEnabled;
        window.featuresIndex.toggleCustomCursor();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.featuresIndex = new FeaturesIndex();
});

// Add some fun interactions
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('feature-card')) {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(102, 126, 234, 0.3);
            pointer-events: none;
            animation: ripple 0.6s linear;
        `;
        
        const rect = e.target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        
        e.target.style.position = 'relative';
        e.target.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Global function to open features
function openFeature(filename) {
    window.open(filename, '_blank');
}

// Global function to go back to main portfolio
function goToPortfolio() {
    window.open('../index.html', '_blank');
}

// Initialize the features index when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FeaturesIndex();
    
    // Add click handlers for feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', function() {
            const feature = this.getAttribute('data-feature');
            
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Get the correct filename
            let filename = '';
            switch(feature) {
                case 'live-playground':
                    filename = 'live-playground.html';
                    break;
                case 'terminal':
                    filename = 'terminal-about.html';
                    break;
                case 'voice-assistant':
                    filename = 'voice-assistant.html';
                    break;
                case 'parallax-story':
                    filename = 'parallax-story.html';
                    break;
                case 'snake-game':
                    filename = 'snake-game.html';
                    break;
                default:
                    console.warn('Unknown feature:', feature);
                    return;
            }
            
            // Open the feature
            setTimeout(() => {
                openFeature(filename);
            }, 200);
        });
    });
    
});
