/**
 * Base JavaScript - Shared functionality across all pages
 * Handles navigation, theme toggle, and active menu highlighting
 */

class PortfolioBase {
    constructor() {
        this.currentPage = this.getCurrentPageName();
        this.init();
    }

    /**
     * Initialize all base functionality
     */
    init() {
        this.setupNavigation();
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.highlightActiveMenu();
        this.setupSocialLinks();
        this.initializeTheme();
    }

    /**
     * Get current page name from URL
     * @returns {string} Current page name
     */
    getCurrentPageName() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        // Handle index.html or empty path as 'home'
        if (filename === 'index.html' || filename === '' || path === '/') {
            return 'home';
        }
        
        // Remove .html extension to get page name
        return filename.replace('.html', '');
    }

    /**
     * Setup navigation functionality
     */
    setupNavigation() {
        // Add navigation HTML to all pages if not present
        const existingNav = document.querySelector('.navbar');
        if (!existingNav) {
            this.createNavigation();
        }

        // Setup navigation click handlers
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                e.target.classList.add('active');
            });
        });
    }

    /**
     * Create navigation HTML structure with dropdown menus
     */
    createNavigation() {
        const nav = document.createElement('nav');
        nav.className = 'navbar';
        nav.innerHTML = [
            '<div class="nav-container">',
                '<a href="index.html" class="nav-brand"><i class="fas fa-code"></i> <span style="font-weight:700;letter-spacing:1px;">Ritesh Chauhan</span></a>',
                '<ul class="nav-menu" id="nav-menu">',
                    '<li class="nav-item">',
                        '<a href="index.html" class="nav-link" data-page="home"><i class="fas fa-home"></i> Home</a>',
                    '</li>',
                    '<li class="nav-item">',
                        '<a href="about.html" class="nav-link" data-page="about"><i class="fas fa-user"></i> About</a>',
                    '</li>',
                    '<li class="nav-item dropdown">',
                        '<a href="career.html" class="nav-link" data-page="career">',
                            '<i class="fas fa-briefcase"></i> Career <i class="fas fa-chevron-down dropdown-icon"></i>',
                        '</a>',
                        '<ul class="dropdown-menu">',
                            '<li><a href="career.html#internship" class="dropdown-link"><i class="fas fa-user-graduate"></i> Internship</a></li>',
                            '<li><a href="career.html#experience" class="dropdown-link"><i class="fas fa-building"></i> Job Experience</a></li>',
                        '</ul>',
                    '</li>',
                    '<li class="nav-item dropdown">',
                        '<a href="education.html" class="nav-link" data-page="education">',
                            '<i class="fas fa-graduation-cap"></i> Education <i class="fas fa-chevron-down dropdown-icon"></i>',
                        '</a>',
                        '<ul class="dropdown-menu">',
                            '<li><a href="education.html#school" class="dropdown-link"><i class="fas fa-school"></i> School</a></li>',
                            '<li><a href="education.html#college" class="dropdown-link"><i class="fas fa-university"></i> College</a></li>',
                            '<li><a href="university.html" class="dropdown-link"><i class="fas fa-university"></i> University</a></li>',
                        '</ul>',
                    '</li>',
                    '<li class="nav-item dropdown">',
                        '<a href="achievements.html" class="nav-link" data-page="achievements">',
                            '<i class="fas fa-trophy"></i> Achievements <i class="fas fa-chevron-down dropdown-icon"></i>',
                        '</a>',
                        '<ul class="dropdown-menu">',
                            '<li><a href="certification.html" class="dropdown-link"><i class="fas fa-certificate"></i> Certificates</a></li>',
                            '<li><a href="awards.html" class="dropdown-link"><i class="fas fa-award"></i> Awards</a></li>',
                            '<li><a href="achievements.html#recognition" class="dropdown-link"><i class="fas fa-star"></i> Recognition</a></li>',
                        '</ul>',
                    '</li>',
                    '<li class="nav-item">',
                        '<a href="contact.html" class="nav-link" data-page="contact"><i class="fas fa-envelope"></i> Contact</a>',
                    '</li>',
                '</ul>',
                '<div class="nav-toggle" id="nav-toggle">',
                    '<span></span>',
                    '<span></span>',
                    '<span></span>',
                '</div>',
            '</div>'
        ].join('');
        
        // Insert navigation at the beginning of body
        document.body.insertBefore(nav, document.body.firstChild);
        
        // Setup dropdown functionality
        this.setupDropdownMenus();
    }

    /**
     * Highlight the active menu item based on current page
     */
    highlightActiveMenu() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            
            // Remove active class from all links
            link.classList.remove('active');
            
            // Add active class to current page link
            if (linkPage === this.currentPage) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Setup mobile menu toggle functionality
     */
    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    /**
     * Setup dropdown menu functionality
     */
    setupDropdownMenus() {
        const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
        
        dropdownItems.forEach(dropdown => {
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            let hoverTimeout;

            // Desktop hover behavior
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                dropdownMenu.classList.add('show');
                dropdown.querySelector('.dropdown-icon').style.transform = 'rotate(180deg)';
            });

            dropdown.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    dropdownMenu.classList.remove('show');
                    dropdown.querySelector('.dropdown-icon').style.transform = 'rotate(0deg)';
                }, 150); // Small delay for better UX
            });

            // Mobile click behavior
            const navLink = dropdown.querySelector('.nav-link');
            navLink.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const isOpen = dropdownMenu.classList.contains('show');
                    
                    // Close all other dropdowns
                    dropdownItems.forEach(item => {
                        item.querySelector('.dropdown-menu').classList.remove('show');
                        item.querySelector('.dropdown-icon').style.transform = 'rotate(0deg)';
                    });

                    // Toggle current dropdown
                    if (!isOpen) {
                        dropdownMenu.classList.add('show');
                        dropdown.querySelector('.dropdown-icon').style.transform = 'rotate(180deg)';
                    }
                }
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-item.dropdown')) {
                dropdownItems.forEach(dropdown => {
                    dropdown.querySelector('.dropdown-menu').classList.remove('show');
                    dropdown.querySelector('.dropdown-icon').style.transform = 'rotate(0deg)';
                });
            }
        });
    }

    /**
     * Setup theme toggle functionality
     */
    setupThemeToggle() {
        // Add theme toggle if not present
        let themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) {
            themeToggle = document.createElement('div');
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = '<i class="fas fa-moon" id="theme-icon"></i>';
            document.body.appendChild(themeToggle);
        }

        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
        const body = document.body;
        const themeIcon = document.getElementById('theme-icon');
        
        if (body.classList.contains('theme-dark')) {
            // Switch to light mode
            body.classList.remove('theme-dark');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            localStorage.setItem('portfolioTheme', 'light');
        } else {
            // Switch to dark mode
            body.classList.add('theme-dark');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            localStorage.setItem('portfolioTheme', 'dark');
        }
    }

    /**
     * Initialize theme from localStorage
     */
    initializeTheme() {
        const savedTheme = localStorage.getItem('portfolioTheme');
        const body = document.body;
        const themeIcon = document.getElementById('theme-icon');
        
        if (savedTheme === 'dark') {
            body.classList.add('theme-dark');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        } else {
            body.classList.remove('theme-dark');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
        }
    }

    /**
     * Setup social media links interactions
     */
    setupSocialLinks() {
        // Add social navigation if not present
        let socialNav = document.querySelector('.social-nav');
        if (!socialNav) {
            socialNav = document.createElement('nav');
            socialNav.className = 'social-nav';
            socialNav.innerHTML = [
                '<a href="https://instagram.com/riteshchauhan_15" class="social-link instagram" target="_blank" title="Instagram">',
                    '<i class="fab fa-instagram"></i>',
                '</a>',
                '<a href="https://www.facebook.com/share/16oEJ9HJ6q/" class="social-link facebook" target="_blank" title="Facebook">',
                    '<i class="fab fa-facebook-f"></i>',
                '</a>',
                '<a href="https://github.com/ritesh-chauhan0x1" class="social-link github" target="_blank" title="GitHub">',
                    '<i class="fab fa-github"></i>',
                '</a>',
                '<a href="https://leetcode.com/u/riteshchauhn_15/" class="social-link leetcode" target="_blank" title="LeetCode">',
                    '<span class="leetcode-text">LC</span>',
                '</a>',
                '<a href="https://wa.me/+919337940768" class="social-link whatsapp" target="_blank" title="WhatsApp">',
                    '<i class="fab fa-whatsapp"></i>',
                '</a>',
                '<a href="mailto:22054368@kiit.ac.in" class="social-link gmail" target="_blank" title="Gmail">',
                    '<i class="far fa-envelope"></i>',
                '</a>'
            ].join('');
            document.body.appendChild(socialNav);
        }

        // Add hover effects
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.1)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    /**
     * Add fade-in animation to content
     */
    animateContent() {
        const content = document.querySelector('.main-content');
        if (content) {
            content.classList.add('fade-in');
        }
    }
}

// Initialize base functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.portfolioBase = new PortfolioBase();
    window.portfolioBase.animateContent();
});

// Optional: Add keyboard navigation
document.addEventListener('keydown', function(e) {
    // Toggle theme with 'T' key
    if (e.key === 't' || e.key === 'T') {
        if (window.portfolioBase) {
            window.portfolioBase.toggleTheme();
        }
    }
});

// Production - Remove console.log for performance
// console.log('🎉 Portfolio Base Loaded - Navigation & Theme System Active');
