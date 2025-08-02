/**
 * Navigation Helper for Ritesh Chauhan Portfolio
 * Handles cross-file navigation and ensures all links work properly
 */

class PortfolioNavigator {
    constructor() {
        this.baseUrl = window.location.origin;
        this.currentPath = window.location.pathname;
        this.init();
    }

    init() {
        this.setupGlobalNavigation();
        this.fixRelativeLinks();
        this.addBackToPortfolioButtons();
        this.setupErrorHandling();
    }

    setupGlobalNavigation() {
        // Add navigation helper functions to global scope
        window.navigateToFeature = this.navigateToFeature.bind(this);
        window.navigateToPortfolio = this.navigateToPortfolio.bind(this);
        window.openExternalLink = this.openExternalLink.bind(this);
    }

    navigateToFeature(featureName) {
        const featureMap = {
            'live-playground': 'features/live-playground.html',
            'terminal-about': 'features/terminal-about.html',
            'voice-assistant': 'features/voice-assistant.html',
            'parallax-story': 'features/parallax-story.html',
            'snake-game': 'features/snake-game.html',
            'features-index': 'features/index.html'
        };

        const path = featureMap[featureName];
        if (path) {
            // Determine if we're in features folder or root
            const isInFeatures = this.currentPath.includes('/features/');
            const url = isInFeatures ? path.replace('features/', '') : path;
            
            window.open(url, '_blank');
        } else {
            console.error('Feature not found:', featureName);
        }
    }

    navigateToPortfolio() {
        const isInFeatures = this.currentPath.includes('/features/');
        const url = isInFeatures ? '../index.html' : 'index.html';
        window.open(url, '_blank');
    }

    openExternalLink(url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    fixRelativeLinks() {
        // Fix all relative links on page load
        document.addEventListener('DOMContentLoaded', () => {
            const links = document.querySelectorAll('a[href]');
            links.forEach(link => {
                const href = link.getAttribute('href');
                
                // Skip external links, anchors, and javascript links
                if (href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript:')) {
                    return;
                }

                // Add proper click handling for internal links
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    if (href.includes('features/')) {
                        this.navigateToFeature(href.split('/').pop().replace('.html', ''));
                    } else if (href === '../index.html' || href === 'index.html') {
                        this.navigateToPortfolio();
                    }
                });
            });
        });
    }

    addBackToPortfolioButtons() {
        // Add back to portfolio button for feature pages
        if (this.currentPath.includes('/features/') && !this.currentPath.includes('index.html')) {
            document.addEventListener('DOMContentLoaded', () => {
                const backButton = document.createElement('button');
                backButton.innerHTML = '← Back to Portfolio';
                backButton.className = 'back-to-portfolio-btn';
                backButton.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    z-index: 1000;
                    padding: 10px 20px;
                    background: var(--accent, #007bff);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-family: inherit;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
                `;

                backButton.addEventListener('click', () => {
                    this.navigateToPortfolio();
                });

                backButton.addEventListener('mouseenter', () => {
                    backButton.style.transform = 'translateY(-2px)';
                    backButton.style.boxShadow = '0 6px 20px rgba(0, 123, 255, 0.4)';
                });

                backButton.addEventListener('mouseleave', () => {
                    backButton.style.transform = 'translateY(0)';
                    backButton.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.3)';
                });

                document.body.appendChild(backButton);
            });
        }
    }

    setupErrorHandling() {
        // Handle 404 errors gracefully
        window.addEventListener('error', (e) => {
            if (e.message.includes('404') || e.message.includes('Not Found')) {
                console.warn('Navigation error detected, attempting to fix...');
                // Could implement fallback navigation here
            }
        });
    }

    // Utility function to check if a file exists
    async checkFileExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    // Debug function to list all available files
    static logFileStructure() {
        console.log(`
🗂️ Portfolio File Structure:
Root:
├── index.html (Main Portfolio)
├── styles.css (Main Styles)
├── script.js (Main JavaScript)
├── navigation.js (This File)
└── features/
    ├── index.html (Features Gallery)
    ├── live-playground.html (Code Playground)
    ├── terminal-about.html (Terminal Interface)
    ├── voice-assistant.html (Voice Assistant)
    ├── parallax-story.html (Parallax Story)
    ├── snake-game.html (Snake Game)
    └── [corresponding .css and .js files]

📝 Navigation Functions:
• navigateToFeature(featureName)
• navigateToPortfolio()
• openExternalLink(url)
        `);
    }
}

// Initialize navigation system
window.portfolioNavigator = new PortfolioNavigator();

// Add debug function to console
window.debugPortfolioFiles = PortfolioNavigator.logFileStructure;

// Console welcome for developers
console.log(`
🧭 Portfolio Navigation System Loaded
   Use: portfolioNavigator.navigateToFeature('live-playground')
   Debug: debugPortfolioFiles()
`);
