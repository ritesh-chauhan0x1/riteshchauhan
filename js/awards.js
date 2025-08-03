// Awards Page JavaScript
class AwardsPage {
    constructor() {
        this.init();
    }

    init() {
        this.animateOnScroll();
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
                    this.animateAwardItem(entry.target);
                }
            });
        }, observerOptions);

        const awardItems = document.querySelectorAll('.award-item');
        awardItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
            observer.observe(item);
        });
    }

    animateAwardItem(item) {
        const icon = item.querySelector('.award-icon i');
        if (icon) {
            setTimeout(() => {
                icon.style.transform = 'scale(1.2) rotate(360deg)';
                icon.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }, 600);
            }, 300);
        }
    }

    setupHoverEffects() {
        const awardContents = document.querySelectorAll('.award-content');
        
        awardContents.forEach(content => {
            content.addEventListener('mouseenter', () => {
                const icon = content.querySelector('.award-icon i');
                if (icon) {
                    icon.style.transform = 'scale(1.1)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });

            content.addEventListener('mouseleave', () => {
                const icon = content.querySelector('.award-icon i');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const awardsPage = new AwardsPage();
    
    if (typeof PortfolioBase !== 'undefined') {
        new PortfolioBase();
    }
});
