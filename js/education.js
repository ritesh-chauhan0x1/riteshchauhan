/**
 * Education Page JavaScript
 * Handles education section animations and interactions
 */

class EducationPage {
    constructor() {
        this.init();
    }

    /**
     * Initialize education page functionality
     */
    init() {
        this.setupAnimations();
        this.setupInteractiveElements();
    }

    /**
     * Setup scroll animations
     */
    setupAnimations() {
        const educationCards = document.querySelectorAll('.education-card');
        
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, observerOptions);

        educationCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
            card.style.transition = `all 0.8s ease ${index * 0.2}s`;
            observer.observe(card);
        });
    }

    /**
     * Setup interactive elements
     */
    setupInteractiveElements() {
        const educationIcons = document.querySelectorAll('.education-icon');
        
        educationIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'all 0.3s ease';
            });

            icon.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        });

        const highlights = document.querySelectorAll('.highlight');
        highlights.forEach(highlight => {
            highlight.addEventListener('click', () => {
                highlight.style.animation = 'highlightPulse 0.5s ease';
                setTimeout(() => {
                    highlight.style.animation = '';
                }, 500);
            });
        });

        // Add highlight pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes highlightPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize education page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.educationPage = new EducationPage();
    }, 100);
});

// Production - Remove console.log for performance
// console.log('🎓 Education Page Script Loaded');
