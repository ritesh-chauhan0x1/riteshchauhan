/**
 * Career Page JavaScript
 * Handles career timeline animations and interactions
 */

class CareerPage {
    constructor() {
        this.init();
    }

    /**
     * Initialize career page functionality
     */
    init() {
        this.setupTimelineAnimations();
        this.setupInteractiveElements();
    }

    /**
     * Setup timeline scroll animations
     */
    setupTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observerOptions = {
            threshold: 0.3,
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

        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(50px)';
            item.style.transition = `all 0.8s ease ${index * 0.2}s`;
            observer.observe(item);
        });
    }

    /**
     * Setup interactive elements
     */
    setupInteractiveElements() {
        const skillTags = document.querySelectorAll('.skill-tag');
        
        skillTags.forEach(tag => {
            tag.addEventListener('click', () => {
                tag.style.animation = 'skillPulse 0.5s ease';
                setTimeout(() => {
                    tag.style.animation = '';
                }, 500);
            });
        });

        // Add skill pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes skillPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize career page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.careerPage = new CareerPage();
    }, 100);
});

// Production - Remove console.log for performance
// console.log('💼 Career Page Script Loaded');
