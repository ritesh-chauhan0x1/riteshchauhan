/**
 * About Page JavaScript
 * Handles about page specific functionality and animations
 */

class AboutPage {
    constructor() {
        this.init();
    }

    /**
     * Initialize about page functionality
     */
    init() {
        this.setupAnimations();
        this.setupSkillsAnimation();
        this.setupProfileImage();
        this.setupInteractiveElements();
    }

    /**
     * Setup scroll animations for elements
     */
    setupAnimations() {
        // Animate elements when they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Target elements for animation
        const animatedElements = document.querySelectorAll(
            '.about-intro, .skills-section, .interests-section, .skill-category, .interest-card'
        );

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    /**
     * Setup skills animation with staggered effect
     */
    setupSkillsAnimation() {
        const skillTags = document.querySelectorAll('.skill-tag');
        
        skillTags.forEach((tag, index) => {
            tag.style.opacity = '0';
            tag.style.transform = 'scale(0.8)';
            tag.style.transition = 'all 0.3s ease';
            
            // Staggered animation
            setTimeout(() => {
                tag.style.opacity = '1';
                tag.style.transform = 'scale(1)';
            }, index * 100);
        });

        // Add click effects to skill tags
        skillTags.forEach(tag => {
            tag.addEventListener('click', () => {
                tag.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    tag.style.animation = '';
                }, 500);
            });
        });

        // Add pulse animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Setup profile image interactions
     */
    setupProfileImage() {
        const profileImg = document.getElementById('profile-img');
        const profileContainer = document.querySelector('.profile-image');

        if (profileImg && profileContainer) {
            // Add hover effect
            profileContainer.addEventListener('mouseenter', () => {
                profileImg.style.transform = 'scale(1.05)';
                profileImg.style.transition = 'transform 0.3s ease';
            });

            profileContainer.addEventListener('mouseleave', () => {
                profileImg.style.transform = 'scale(1)';
            });

            // Add click effect
            profileContainer.addEventListener('click', () => {
                profileContainer.style.animation = 'profileBounce 0.6s ease';
                setTimeout(() => {
                    profileContainer.style.animation = '';
                }, 600);
            });

            // Add profile bounce animation
            const bounceStyle = document.createElement('style');
            bounceStyle.textContent = `
                @keyframes profileBounce {
                    0%, 100% { transform: translateY(0) scale(1); }
                    25% { transform: translateY(-10px) scale(1.02); }
                    50% { transform: translateY(-5px) scale(1.01); }
                    75% { transform: translateY(-2px) scale(1.005); }
                }
            `;
            document.head.appendChild(bounceStyle);
        }
    }

    /**
     * Setup interactive elements and tooltips
     */
    setupInteractiveElements() {
        // Add tooltips to fact icons
        const factIcons = document.querySelectorAll('.fact i');
        factIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'all 0.3s ease';
            });

            icon.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        });

        // Add interest card interactions
        const interestCards = document.querySelectorAll('.interest-card');
        interestCards.forEach(card => {
            const icon = card.querySelector('i');
            
            card.addEventListener('mouseenter', () => {
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                    icon.style.transition = 'all 0.3s ease';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });

        // Add typing effect to intro text
        this.setupTypingEffect();
    }

    /**
     * Setup typing effect for introduction text
     */
    setupTypingEffect() {
        const introHeading = document.querySelector('.intro-text h2');
        if (introHeading) {
            const originalText = introHeading.textContent;
            introHeading.textContent = '';
            
            let index = 0;
            const typeInterval = setInterval(() => {
                if (index < originalText.length) {
                    introHeading.textContent += originalText.charAt(index);
                    index++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 100);
        }
    }

    /**
     * Add smooth scrolling between sections
     */
    setupSmoothScrolling() {
        const sections = document.querySelectorAll('.about-intro, .skills-section, .interests-section');
        
        // Add navigation dots (optional)
        const navDots = document.createElement('div');
        navDots.className = 'section-nav';
        navDots.style.cssText = `
            position: fixed;
            right: 2rem;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 1rem;
            z-index: 100;
        `;

        sections.forEach((section, index) => {
            const dot = document.createElement('div');
            dot.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: var(--text-secondary);
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            dot.addEventListener('click', () => {
                section.scrollIntoView({ behavior: 'smooth' });
            });

            navDots.appendChild(dot);
        });

        document.body.appendChild(navDots);
    }

    /**
     * Add random fun facts rotation
     */
    setupFunFacts() {
        const additionalFacts = [
            { icon: 'fas fa-coffee', text: 'Coffee enthusiast' },
            { icon: 'fas fa-globe', text: 'Love to travel' },
            { icon: 'fas fa-gamepad', text: 'Gaming in free time' },
            { icon: 'fas fa-heart', text: 'Open source contributor' }
        ];

        const factsContainer = document.querySelector('.quick-facts');
        if (factsContainer) {
            let currentFactIndex = 0;
            
            setInterval(() => {
                if (additionalFacts.length > 0) {
                    const randomFact = additionalFacts[currentFactIndex % additionalFacts.length];
                    
                    const factElement = document.createElement('div');
                    factElement.className = 'fact fun-fact';
                    factElement.innerHTML = `
                        <i class="${randomFact.icon}"></i>
                        <span>${randomFact.text}</span>
                    `;
                    factElement.style.opacity = '0';
                    factElement.style.transform = 'translateX(-20px)';
                    factElement.style.transition = 'all 0.5s ease';
                    
                    factsContainer.appendChild(factElement);
                    
                    setTimeout(() => {
                        factElement.style.opacity = '1';
                        factElement.style.transform = 'translateX(0)';
                    }, 100);
                    
                    setTimeout(() => {
                        factElement.style.opacity = '0';
                        factElement.style.transform = 'translateX(20px)';
                        setTimeout(() => {
                            factElement.remove();
                        }, 500);
                    }, 3000);
                    
                    currentFactIndex++;
                }
            }, 5000);
        }
    }
}

// Initialize about page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for base.js to initialize
    setTimeout(() => {
        window.aboutPage = new AboutPage();
    }, 100);
});

console.log('👤 About Page Script Loaded');
