// Simple Theme Toggle - Light/Dark Mode Only
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    
    // Toggle between light and dark mode
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

// Load saved theme on page load
function initializeTheme() {
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

// Initialize theme immediately and on DOM load
initializeTheme();
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
});

// Social Media Links Interactions
document.addEventListener('DOMContentLoaded', function() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        link.addEventListener('click', function(e) {
            // Add a subtle click effect
            this.style.transform = 'translateY(-1px) scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'translateY(-3px) scale(1.1)';
            }, 100);
        });
    });
});

// Optional: Add some keyboard navigation
document.addEventListener('keydown', function(e) {
    // Toggle theme with 'T' key
    if (e.key === 't' || e.key === 'T') {
        toggleTheme();
    }
});

console.log('🎉 Minimal Portfolio Loaded - Social Links & Theme Toggle Only');
console.log('💡 Press "T" to toggle theme');
console.log('🔗 Social links available on the left side (desktop) or bottom (mobile)');
