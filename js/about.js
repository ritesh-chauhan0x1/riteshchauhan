/**
 * About Page JavaScript - Professional Version
 * Handles about page specific functionality and professional animations
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
        this.setupImageGallery();
        this.setupSkillsAnimation();
        this.setupTimelineAnimation();
        this.setupInteractiveElements();
        this.setupImageZoom();
        this.setupProfessionalFeatures();
    }

    /**
     * Setup scroll animations for elements
     */
    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Add staggered animation for child elements
                    const children = entry.target.querySelectorAll('.skill-tag, .achievement-card, .timeline-item');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Target elements for animation
        const animatedElements = document.querySelectorAll(
            '.profile-section, .about-content, .content-section, .image-gallery'
        );

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });

        // Animate child elements
        const childElements = document.querySelectorAll('.skill-tag, .achievement-card, .timeline-item');
        childElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.4s ease';
        });
    }

    /**
     * Setup image gallery with enhanced interactions
     */
    setupImageGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const profileImage = document.querySelector('.profile-image');

        // Add click events to gallery images
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('.gallery-img');
            
            item.addEventListener('click', () => {
                this.openImageModal(img.src, `Professional Photo ${index + 2}`);
            });

            // Add hover effect data
            item.setAttribute('data-title', `Professional Photo ${index + 2}`);
        });

        // Add click event to profile image
        if (profileImage) {
            profileImage.addEventListener('click', () => {
                const img = profileImage.querySelector('img');
                this.openImageModal(img.src, 'Ritesh Chauhan - Professional Photo');
            });
        }

        // Create modal for image viewing
        this.createImageModal();
    }

    /**
     * Create image modal for full-size viewing
     */
    createImageModal() {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <img class="modal-image" src="" alt="">
                <div class="modal-caption"></div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add modal styles
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .image-modal.active {
                display: flex;
                opacity: 1;
            }

            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                cursor: pointer;
            }

            .modal-content {
                position: relative;
                margin: auto;
                max-width: 90%;
                max-height: 90%;
                display: flex;
                flex-direction: column;
                align-items: center;
                z-index: 1001;
            }

            .modal-close {
                position: absolute;
                top: -50px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 0.5rem;
                transition: color 0.3s ease;
            }

            .modal-close:hover {
                color: var(--accent);
            }

            .modal-image {
                max-width: 100%;
                max-height: 80vh;
                object-fit: contain;
                border-radius: 10px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }

            .modal-caption {
                color: white;
                text-align: center;
                margin-top: 1rem;
                font-size: 1.1rem;
                font-weight: 500;
            }
        `;
        document.head.appendChild(modalStyles);

        // Setup modal events
        const overlay = modal.querySelector('.modal-overlay');
        const closeBtn = modal.querySelector('.modal-close');

        overlay.addEventListener('click', () => this.closeImageModal());
        closeBtn.addEventListener('click', () => this.closeImageModal());
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeImageModal();
            }
        });
    }

    /**
     * Open image modal
     */
    openImageModal(src, caption) {
        const modal = document.querySelector('.image-modal');
        const modalImage = modal.querySelector('.modal-image');
        const modalCaption = modal.querySelector('.modal-caption');

        modalImage.src = src;
        modalCaption.textContent = caption;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close image modal
     */
    closeImageModal() {
        const modal = document.querySelector('.image-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Setup enhanced skills animation
     */
    setupSkillsAnimation() {
        const skillTags = document.querySelectorAll('.skill-tag');
        
        // Add click effects to skill tags
        skillTags.forEach(tag => {
            tag.addEventListener('click', () => {
                tag.style.animation = 'skillPulse 0.5s ease';
                setTimeout(() => {
                    tag.style.animation = '';
                }, 500);
            });

            // Add hover sound effect simulation
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'translateY(-2px) scale(1.05)';
            });

            tag.addEventListener('mouseleave', () => {
                tag.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add skill pulse animation
        const skillStyles = document.createElement('style');
        skillStyles.textContent = `
            @keyframes skillPulse {
                0% { transform: translateY(-2px) scale(1); }
                50% { transform: translateY(-2px) scale(1.15); }
                100% { transform: translateY(-2px) scale(1); }
            }
        `;
        document.head.appendChild(skillStyles);
    }

    /**
     * Setup timeline animation
     */
    setupTimelineAnimation() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.3 });

        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            item.style.transition = `all 0.6s ease ${index * 0.2}s`;
            timelineObserver.observe(item);
        });
    }

    /**
     * Setup interactive elements
     */
    setupInteractiveElements() {
        // Add hover effects to contact details
        const detailItems = document.querySelectorAll('.detail-item');
        detailItems.forEach(item => {
            item.addEventListener('click', () => {
                const text = item.querySelector('span').textContent;
                
                // Copy to clipboard if it's email or phone
                if (text.includes('@') || text.includes('+')) {
                    navigator.clipboard.writeText(text).then(() => {
                        this.showToast('Copied to clipboard!');
                    }).catch(() => {
                        console.log('Could not copy to clipboard');
                    });
                }
            });
        });

        // Add achievement card interactions
        const achievementCards = document.querySelectorAll('.achievement-card');
        achievementCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.achievement-icon');
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            });

            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.achievement-icon');
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }

    /**
     * Setup image zoom functionality
     */
    setupImageZoom() {
        const images = document.querySelectorAll('.profile-image img, .gallery-img');
        
        images.forEach(img => {
            img.addEventListener('mouseenter', () => {
                img.style.cursor = 'zoom-in';
            });
        });
    }

    /**
     * Show toast notification
     */
    showToast(message) {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        
        // Add toast styles
        const toastStyles = document.createElement('style');
        toastStyles.textContent = `
            .toast-notification {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: var(--accent);
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
                font-weight: 500;
            }

            .toast-notification.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(toastStyles);

        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Add smooth section navigation
     */
    setupSectionNavigation() {
        const sections = document.querySelectorAll('.content-section');
        
        // Create floating navigation
        const navContainer = document.createElement('div');
        navContainer.className = 'section-navigation';
        navContainer.innerHTML = `
            <div class="nav-dots">
                ${Array.from(sections).map((_, index) => 
                    `<div class="nav-dot" data-section="${index}"></div>`
                ).join('')}
            </div>
        `;

        document.body.appendChild(navContainer);

        // Add navigation styles
        const navStyles = document.createElement('style');
        navStyles.textContent = `
            .section-navigation {
                position: fixed;
                right: 2rem;
                top: 50%;
                transform: translateY(-50%);
                z-index: 100;
            }

            .nav-dots {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .nav-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: rgba(var(--accent-rgb), 0.3);
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .nav-dot:hover,
            .nav-dot.active {
                background: var(--accent);
                transform: scale(1.2);
            }

            @media (max-width: 768px) {
                .section-navigation {
                    display: none;
                }
            }
        `;
        document.head.appendChild(navStyles);

        // Setup navigation functionality
        const navDots = document.querySelectorAll('.nav-dot');
        navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                sections[index].scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Highlight active section
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(sections).indexOf(entry.target);
                    navDots.forEach(dot => dot.classList.remove('active'));
                    if (navDots[index]) {
                        navDots[index].classList.add('active');
                    }
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => sectionObserver.observe(section));
    }

    /**
     * Setup professional features and interactions
     */
    setupProfessionalFeatures() {
        // Add contact info click functionality
        this.setupContactInteractions();
        
        // Add skill tag interactions
        this.setupSkillInteractions();
        
        // Add professional animations
        this.setupProfessionalAnimations();
        
        // Setup section navigation
        this.setupSectionNavigation();
    }

    /**
     * Setup contact information interactions
     */
    setupContactInteractions() {
        const contactItems = document.querySelectorAll('.detail-item');
        
        contactItems.forEach(item => {
            const span = item.querySelector('span');
            const text = span.textContent;
            
            // Add click to copy functionality for email and phone
            if (text.includes('@') || text.includes('+91')) {
                item.style.cursor = 'pointer';
                item.title = `Click to copy ${text}`;
                
                item.addEventListener('click', () => {
                    navigator.clipboard.writeText(text).then(() => {
                        this.showToast(`${text} copied to clipboard!`);
                        
                        // Visual feedback
                        item.style.background = 'var(--accent)';
                        item.style.color = 'white';
                        
                        setTimeout(() => {
                            item.style.background = '';
                            item.style.color = '';
                        }, 1000);
                    }).catch(() => {
                        this.showToast('Failed to copy to clipboard');
                    });
                });
            }
        });
    }

    /**
     * Setup skill tag interactions
     */
    setupSkillInteractions() {
        const skillTags = document.querySelectorAll('.skill-tag');
        
        skillTags.forEach(tag => {
            tag.addEventListener('click', () => {
                // Add pulse animation
                tag.style.animation = 'skillPulse 0.6s ease-out';
                
                setTimeout(() => {
                    tag.style.animation = '';
                }, 600);
                
                // Show skill info
                const skillName = tag.textContent;
                this.showToast(`${skillName} - One of my key technical skills!`);
            });
        });
    }

    /**
     * Setup professional animations
     */
    setupProfessionalAnimations() {
        // Add scroll-triggered animations for achievement cards
        const achievementCards = document.querySelectorAll('.achievement-card');
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.3 });

        achievementCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
            card.style.transition = 'all 0.6s ease';
            cardObserver.observe(card);
        });
    }
}

// Initialize about page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for base.js to initialize
    setTimeout(() => {
        window.aboutPage = new AboutPage();
    }, 100);
});

// Production - Remove console.log for performance
// console.log('👤 Professional About Page Script Loaded');
