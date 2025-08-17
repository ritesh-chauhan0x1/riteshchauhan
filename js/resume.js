// Resume Page JavaScript
class ResumePage {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.animateOnScroll();
        this.setupDownloadHandlers();
    }

    setupEventListeners() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    setupDownloadHandlers() {
        const downloadBtn = document.getElementById('download-pdf');
        const viewOnlineBtn = document.getElementById('view-online');

        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadResume();
            });
        }

        if (viewOnlineBtn) {
            viewOnlineBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.viewOnlineResume();
            });
        }
    }

    downloadResume() {
        // Simulate PDF download
        const link = document.createElement('a');
        link.href = '#'; // Replace with actual PDF URL
        link.download = 'Ritesh_Chauhan_Resume.pdf';
        
        // Show download animation
        this.showDownloadAnimation();
        
        // In a real scenario, you would have:
        // link.href = 'path/to/your/resume.pdf';
        // link.click();
        
        // Production: Resume download tracking (development only)
        // console.log('Resume download initiated...');
    }

    viewOnlineResume() {
        // Scroll to resume preview or open in modal
        const resumePreview = document.querySelector('.resume-preview');
        if (resumePreview) {
            resumePreview.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    showDownloadAnimation() {
        const downloadBtn = document.getElementById('download-pdf');
        if (downloadBtn) {
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
            downloadBtn.style.pointerEvents = 'none';

            setTimeout(() => {
                downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
                setTimeout(() => {
                    downloadBtn.innerHTML = originalText;
                    downloadBtn.style.pointerEvents = 'auto';
                }, 2000);
            }, 2000);
        }
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
                    this.animateSkills(entry.target);
                }
            });
        }, observerOptions);

        // Observe resume sections
        const sections = document.querySelectorAll('.resume-section');
        sections.forEach(section => {
            observer.observe(section);
        });

        // Observe competency categories
        const categories = document.querySelectorAll('.competency-category');
        categories.forEach((category, index) => {
            category.style.animationDelay = `${index * 0.1}s`;
            observer.observe(category);
        });

        // Observe achievement items
        const achievements = document.querySelectorAll('.achievement-item');
        achievements.forEach((achievement, index) => {
            achievement.style.animationDelay = `${index * 0.2}s`;
            observer.observe(achievement);
        });
    }

    animateSkills(section) {
        const skillItems = section.querySelectorAll('.competency-category li');
        skillItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.resume-header');
        
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    }

    handleResize() {
        // Handle responsive adjustments
        this.adjustLayoutForMobile();
    }

    adjustLayoutForMobile() {
        const isMobile = window.innerWidth <= 768;
        const competenciesGrid = document.querySelector('.competencies-grid');
        
        if (competenciesGrid) {
            if (isMobile) {
                competenciesGrid.style.gridTemplateColumns = '1fr';
            } else {
                competenciesGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
            }
        }
    }

    // Add print styles handler
    setupPrintStyles() {
        const printBtn = document.createElement('button');
        printBtn.innerHTML = '<i class="fas fa-print"></i> Print Resume';
        printBtn.className = 'btn-outline print-btn';
        printBtn.addEventListener('click', () => {
            this.printResume();
        });

        const actions = document.querySelector('.resume-actions');
        if (actions) {
            actions.appendChild(printBtn);
        }
    }

    printResume() {
        // Add print-specific styles
        const printStyles = `
            @media print {
                .navbar, .social-icons { display: none !important; }
                .resume-actions { display: none !important; }
                .resume-container { margin: 0; padding: 20px; }
                .resume-preview { box-shadow: none; border: 1px solid #ddd; }
                body { font-size: 12pt; line-height: 1.4; }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = printStyles;
        document.head.appendChild(styleSheet);

        window.print();

        // Remove print styles after printing
        setTimeout(() => {
            document.head.removeChild(styleSheet);
        }, 1000);
    }
}

// Initialize resume page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const resumePage = new ResumePage();
    
    // Initialize base portfolio functionality
    if (typeof PortfolioBase !== 'undefined') {
        new PortfolioBase();
    }
});
