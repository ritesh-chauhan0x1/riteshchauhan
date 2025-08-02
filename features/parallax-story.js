class ParallaxStory {
    constructor() {
        this.container = document.querySelector('.parallax-container');
        this.sections = document.querySelectorAll('.story-section');
        this.navItems = document.querySelectorAll('.nav-item');
        this.progressFill = document.querySelector('.progress-fill');
        this.currentSection = 0;
        this.isScrolling = false;
        
        this.init();
    }

    init() {
        this.setupScrollListener();
        this.setupNavigation();
        this.setupParallaxEffect();
        this.animateFloatingElements();
        this.updateProgress();
    }

    setupScrollListener() {
        let scrollTimeout;
        
        this.container.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                this.updateCurrentSection();
                this.updateProgress();
                this.triggerSectionAnimations();
            }, 10);
        });
    }

    setupNavigation() {
        this.navItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.scrollToSection(index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' && this.currentSection < this.sections.length - 1) {
                e.preventDefault();
                this.scrollToSection(this.currentSection + 1);
            } else if (e.key === 'ArrowUp' && this.currentSection > 0) {
                e.preventDefault();
                this.scrollToSection(this.currentSection - 1);
            }
        });
    }

    scrollToSection(index) {
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        const targetSection = this.sections[index];
        
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }

    updateCurrentSection() {
        const scrollTop = this.container.scrollTop;
        const windowHeight = window.innerHeight;
        
        this.sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollTop >= sectionTop - windowHeight / 2 && 
                scrollTop < sectionBottom - windowHeight / 2) {
                this.currentSection = index;
            }
        });
        
        // Update navigation
        this.navItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSection);
        });
    }

    updateProgress() {
        const scrollTop = this.container.scrollTop;
        const scrollHeight = this.container.scrollHeight - window.innerHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        
        this.progressFill.style.width = `${Math.min(progress, 100)}%`;
    }

    setupParallaxEffect() {
        this.container.addEventListener('scroll', () => {
            const scrollTop = this.container.scrollTop;
            
            this.sections.forEach((section, index) => {
                const bg = section.querySelector('.parallax-bg');
                const content = section.querySelector('.story-content');
                const floatingElements = section.querySelector('.floating-elements');
                
                if (bg && content) {
                    const sectionTop = section.offsetTop;
                    const sectionProgress = (scrollTop - sectionTop) / window.innerHeight;
                    
                    // Parallax background
                    const bgTransform = sectionProgress * 50;
                    bg.style.transform = `translate3d(0, ${bgTransform}px, 0)`;
                    
                    // Content animation
                    const contentTransform = sectionProgress * -20;
                    content.style.transform = `translate3d(0, ${contentTransform}px, 0)`;
                    
                    // Floating elements
                    if (floatingElements) {
                        const floatTransform = sectionProgress * -30;
                        floatingElements.style.transform = `translate3d(0, ${floatTransform}px, 0)`;
                    }
                }
            });
        });
    }

    triggerSectionAnimations() {
        const currentSectionElement = this.sections[this.currentSection];
        
        // Animate timeline items
        const timelineItems = currentSectionElement.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = 'none';
                item.offsetHeight; // Trigger reflow
                item.style.animation = `slideInFromBottom 0.8s ease-out ${index * 0.2}s both`;
            }, 100);
        });
        
        // Animate project cards
        const projectCards = currentSectionElement.querySelectorAll('.mini-project');
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                card.style.animation = `slideInUp 0.8s ease-out ${index * 0.3}s both`;
            }, 200);
        });
        
        // Animate skill items
        const skillItems = currentSectionElement.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = 'none';
                item.offsetHeight; // Trigger reflow
                item.style.animation = `scaleIn 0.8s ease-out ${index * 0.2}s both`;
            }, 300);
        });
    }

    animateFloatingElements() {
        const codeSnippets = document.querySelectorAll('.code-snippet');
        
        codeSnippets.forEach((snippet, index) => {
            // Add typing effect
            const text = snippet.textContent;
            snippet.textContent = '';
            
            setTimeout(() => {
                this.typeText(snippet, text, 50);
            }, index * 2000);
            
            // Add random floating animation variations
            const randomDelay = Math.random() * 2;
            const randomDuration = 4 + Math.random() * 4;
            
            snippet.style.animationDelay = `${randomDelay}s`;
            snippet.style.animationDuration = `${randomDuration}s`;
        });
    }

    typeText(element, text, speed) {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                // Add cursor blink effect
                element.style.borderRight = '2px solid #60efff';
                element.style.animation += ', blink 1s infinite';
            }
        }, speed);
    }

    // Interactive features
    addInteractiveElements() {
        // Add click effects to stats
        const stats = document.querySelectorAll('.stat');
        stats.forEach(stat => {
            stat.addEventListener('click', () => {
                stat.style.animation = 'bounce 0.6s ease-in-out';
                setTimeout(() => {
                    stat.style.animation = '';
                }, 600);
            });
        });

        // Add hover effects to timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const tech = item.querySelector('.tech');
                tech.style.transform = 'scale(1.1)';
                tech.style.color = '#60efff';
            });
            
            item.addEventListener('mouseleave', () => {
                const tech = item.querySelector('.tech');
                tech.style.transform = 'scale(1)';
                tech.style.color = '#ffffff';
            });
        });

        // Add particles on section change
        this.container.addEventListener('scroll', this.debounce(() => {
            this.createParticles();
        }, 500));
    }

    createParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
        `;
        document.body.appendChild(particleContainer);

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #60efff;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFade 2s ease-out forwards;
                box-shadow: 0 0 10px #60efff;
            `;
            particleContainer.appendChild(particle);
        }

        setTimeout(() => {
            particleContainer.remove();
        }, 2000);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Add particle animation CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0) translateY(-100px);
        }
    }
    
    @keyframes blink {
        0%, 50% { border-color: #60efff; }
        51%, 100% { border-color: transparent; }
    }
`;
document.head.appendChild(particleStyle);

// Easter egg: Konami code for special effects
class StoryEasterEggs {
    constructor() {
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        this.konamiIndex = 0;
        this.setupKonamiCode();
    }

    setupKonamiCode() {
        document.addEventListener('keydown', (e) => {
            if (e.code === this.konamiCode[this.konamiIndex]) {
                this.konamiIndex++;
                if (this.konamiIndex === this.konamiCode.length) {
                    this.activateSpecialMode();
                    this.konamiIndex = 0;
                }
            } else {
                this.konamiIndex = 0;
            }
        });
    }

    activateSpecialMode() {
        // Matrix rain effect
        this.createMatrixRain();
        
        // Rainbow backgrounds
        const sections = document.querySelectorAll('.story-section');
        sections.forEach((section, index) => {
            setTimeout(() => {
                const bg = section.querySelector('.parallax-bg');
                bg.style.background = `hsl(${index * 60}, 70%, 50%)`;
                bg.style.animation = 'rainbow 2s infinite';
            }, index * 200);
        });

        // Show achievement
        this.showAchievement();
    }

    createMatrixRain() {
        const matrix = document.createElement('div');
        matrix.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        const chars = '01アイウエオカキクケコサシスセソ';
        
        for (let i = 0; i < 50; i++) {
            const char = document.createElement('div');
            char.textContent = chars[Math.floor(Math.random() * chars.length)];
            char.style.cssText = `
                position: absolute;
                color: #00ff00;
                font-family: 'Courier New', monospace;
                font-size: 20px;
                left: ${Math.random() * 100}%;
                animation: matrixFall ${2 + Math.random() * 3}s linear infinite;
            `;
            matrix.appendChild(char);
        }
        
        document.body.appendChild(matrix);
        
        setTimeout(() => {
            matrix.remove();
        }, 10000);
    }

    showAchievement() {
        const achievement = document.createElement('div');
        achievement.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                color: #60efff;
                padding: 2rem;
                border-radius: 20px;
                text-align: center;
                z-index: 10001;
                border: 2px solid #60efff;
                box-shadow: 0 0 30px #60efff;
                animation: achievementPop 0.5s ease-out;
            ">
                <h2>🏆 Achievement Unlocked!</h2>
                <p>Secret Code Master</p>
                <p style="font-size: 0.9rem; opacity: 0.8; margin-top: 1rem;">
                    You discovered the hidden Konami code!
                </p>
                <button onclick="this.closest('div').remove()" style="
                    margin-top: 1rem;
                    padding: 0.5rem 1rem;
                    background: #60efff;
                    color: #000;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                ">Awesome!</button>
            </div>
        `;
        
        document.body.appendChild(achievement);
    }
}

// Add rainbow and matrix animation CSS
const extraStyle = document.createElement('style');
extraStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes matrixFall {
        0% {
            transform: translateY(-100vh);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh);
            opacity: 0;
        }
    }
    
    @keyframes achievementPop {
        0% {
            transform: translate(-50%, -50%) scale(0);
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(extraStyle);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.parallaxStory = new ParallaxStory();
    window.storyEasterEggs = new StoryEasterEggs();
    
    // Add interactive elements after a short delay
    setTimeout(() => {
        window.parallaxStory.addInteractiveElements();
    }, 1000);
});

// Performance optimization
window.addEventListener('load', () => {
    // Preload next section backgrounds
    const backgrounds = document.querySelectorAll('.parallax-bg');
    backgrounds.forEach(bg => {
        bg.style.willChange = 'transform';
    });
    
    // Add intersection observer for better performance
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.story-section').forEach(section => {
            observer.observe(section);
        });
    }
});
