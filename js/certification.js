// Certification Page JavaScript
class CertificationPage {
    constructor() {
        this.init();
    }

    init() {
        this.animateOnScroll();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const verifyLinks = document.querySelectorAll('.cert-verify');
        verifyLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCertVerification(e.target);
            });
        });
    }

    handleCertVerification(element) {
        const originalText = element.textContent;
        element.textContent = 'Verifying...';
        element.style.pointerEvents = 'none';

        setTimeout(() => {
            element.textContent = 'Verified ✓';
            element.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            
            setTimeout(() => {
                element.textContent = originalText;
                element.style.background = '';
                element.style.pointerEvents = 'auto';
            }, 3000);
        }, 2000);
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
                }
            });
        }, observerOptions);

        const certCards = document.querySelectorAll('.cert-card');
        certCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const certificationPage = new CertificationPage();
    
    if (typeof PortfolioBase !== 'undefined') {
        new PortfolioBase();
    }
});
