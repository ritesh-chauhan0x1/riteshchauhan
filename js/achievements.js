// Achievements Page JavaScript
class AchievementsPage {
    constructor() {
        this.init();
    }

    init() {
        this.animateOnScroll();
        this.setupCounters();
        this.setupHoverEffects();
    }

    animateOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    
                    if (entry.target.classList.contains('achievement-card')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe achievement cards
        const achievementCards = document.querySelectorAll('.achievement-card');
        achievementCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        // Observe highlight items
        const highlightItems = document.querySelectorAll('.highlight-item');
        highlightItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
            observer.observe(item);
        });
    }

    setupCounters() {
        const counters = document.querySelectorAll('.achievement-number');
        
        counters.forEach(counter => {
            const target = counter.textContent;
            counter.textContent = '0';
            counter.setAttribute('data-target', target);
        });
    }

    animateCounter(card) {
        const counter = card.querySelector('.achievement-number');
        if (!counter || counter.classList.contains('animated')) return;

        counter.classList.add('animated');
        const target = counter.getAttribute('data-target');
        const isPercentage = target.includes('%');
        const isTime = target.includes('/');
        const numericTarget = parseInt(target.replace(/[^\d]/g, ''));
        
        let current = 0;
        const increment = numericTarget / 30; // 30 frames for animation
        const duration = 2000; // 2 seconds
        const frameTime = duration / 30;

        const updateCounter = () => {
            current += increment;
            
            if (current >= numericTarget) {
                counter.textContent = target;
                counter.classList.add('counting');
                return;
            }

            if (isPercentage) {
                counter.textContent = Math.floor(current) + '%';
            } else if (isTime) {
                counter.textContent = Math.floor(current) + '/7';
            } else if (numericTarget >= 1000) {
                counter.textContent = Math.floor(current) + '+';
            } else {
                counter.textContent = Math.floor(current) + '+';
            }

            setTimeout(updateCounter, frameTime);
        };

        updateCounter();
    }

    setupHoverEffects() {
        const achievementCards = document.querySelectorAll('.achievement-card');
        
        achievementCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.achievement-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(360deg)';
                    icon.style.transition = 'all 0.6s ease';
                }
            });

            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.achievement-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });

        // Highlight items pulse effect
        const highlightItems = document.querySelectorAll('.highlight-item');
        highlightItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const icon = item.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.1)';
                    icon.style.color = 'var(--secondary-color)';
                    icon.style.transition = 'all 0.3s ease';
                }
            });

            item.addEventListener('mouseleave', () => {
                const icon = item.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                    icon.style.color = 'var(--primary-color)';
                }
            });
        });
    }

    // Add parallax effect for achievement numbers
    setupParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const achievementNumbers = document.querySelectorAll('.achievement-number');
            
            achievementNumbers.forEach(number => {
                const speed = scrolled * 0.1;
                number.style.transform = `translateY(${speed}px)`;
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const achievementsPage = new AchievementsPage();
    
    if (typeof PortfolioBase !== 'undefined') {
        new PortfolioBase();
    }
});
