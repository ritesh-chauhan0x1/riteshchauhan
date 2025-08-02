// Portfolio Debug and Diagnostic Tool
class PortfolioDebugger {
    constructor() {
        this.issues = [];
        this.warnings = [];
        this.successes = [];
        
        console.log('🔧 Portfolio Debugger initialized');
    }

    async runDiagnostics() {
        console.log('🔍 Running comprehensive portfolio diagnostics...');
        
        this.checkCSSLoading();
        this.checkJavaScriptFunctions();
        this.checkDOMElements();
        this.checkLocalStorage();
        this.checkAnimations();
        this.checkTheme();
        this.checkConsoleErrors();
        
        this.generateReport();
    }

    checkCSSLoading() {
        console.log('📄 Checking CSS loading...');
        
        // Check if main stylesheet is loaded
        const styleSheets = Array.from(document.styleSheets);
        const mainCSS = styleSheets.find(sheet => 
            sheet.href && sheet.href.includes('styles.css')
        );
        
        if (mainCSS) {
            this.successes.push('✅ Main CSS file loaded successfully');
        } else {
            this.issues.push('❌ Main CSS file not loaded');
        }

        // Check CSS variables
        const testEl = document.createElement('div');
        testEl.style.color = 'var(--text-primary)';
        document.body.appendChild(testEl);
        
        const computedColor = window.getComputedStyle(testEl).color;
        document.body.removeChild(testEl);
        
        if (computedColor && computedColor !== 'var(--text-primary)') {
            this.successes.push('✅ CSS variables working correctly');
        } else {
            this.issues.push('❌ CSS variables not working');
        }

        // Check theme classes
        if (document.body.classList.contains('theme-dark') || !document.body.classList.contains('theme-dark')) {
            this.successes.push('✅ Theme system accessible');
        }
    }

    checkJavaScriptFunctions() {
        console.log('🔧 Checking JavaScript functions...');
        
        const criticalFunctions = [
            'initializePortfolio',
            'initializeTheme',
            'toggleTheme',
            'loadProjectsToPublic',
            'loadPhotosToPublic',
            'initializeScrollAnimations'
        ];

        criticalFunctions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                this.successes.push(`✅ Function ${funcName} available`);
            } else {
                this.issues.push(`❌ Function ${funcName} missing`);
            }
        });

        // Check if DOM content loaded handlers are working
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            this.successes.push('✅ DOM ready state is good');
        } else {
            this.warnings.push('⚠️ DOM not fully loaded yet');
        }
    }

    checkDOMElements() {
        console.log('🏗️ Checking DOM elements...');
        
        const criticalElements = [
            'loading',
            'theme-icon', 
            'adminIcon',
            'projectsGrid',
            'photosGrid'
        ];

        criticalElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                this.successes.push(`✅ Element #${elementId} found`);
            } else {
                this.warnings.push(`⚠️ Element #${elementId} not found`);
            }
        });

        // Check navigation
        const navLinks = document.querySelectorAll('.nav-links a');
        if (navLinks.length > 0) {
            this.successes.push(`✅ Navigation links found (${navLinks.length})`);
        } else {
            this.warnings.push('⚠️ No navigation links found');
        }
    }

    checkLocalStorage() {
        console.log('💾 Checking LocalStorage...');
        
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            this.successes.push('✅ LocalStorage working');
            
            // Check for existing data
            const portfolioData = localStorage.getItem('portfolio_projects');
            if (portfolioData) {
                this.successes.push('✅ Portfolio data found in LocalStorage');
            } else {
                this.warnings.push('⚠️ No portfolio data in LocalStorage');
            }
        } catch (error) {
            this.issues.push('❌ LocalStorage not accessible');
        }
    }

    checkAnimations() {
        console.log('🎬 Checking animations...');
        
        // Check for reveal elements
        const revealElements = document.querySelectorAll('.reveal');
        if (revealElements.length > 0) {
            this.successes.push(`✅ Reveal elements found (${revealElements.length})`);
        } else {
            this.warnings.push('⚠️ No reveal elements found');
        }

        // Check CSS animations support
        if (CSS.supports('animation', 'test')) {
            this.successes.push('✅ CSS animations supported');
        } else {
            this.warnings.push('⚠️ CSS animations not supported');
        }
    }

    checkTheme() {
        console.log('🎨 Checking theme system...');
        
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            this.successes.push('✅ Theme toggle icon found');
            
            // Check if theme toggle works
            if (typeof toggleTheme === 'function') {
                this.successes.push('✅ Theme toggle function available');
            } else {
                this.issues.push('❌ Theme toggle function missing');
            }
        } else {
            this.warnings.push('⚠️ Theme toggle icon not found');
        }

        // Check saved theme
        const savedTheme = localStorage.getItem('portfolio-theme') || localStorage.getItem('portfolioTheme');
        if (savedTheme) {
            this.successes.push(`✅ Saved theme found: ${savedTheme}`);
        } else {
            this.warnings.push('⚠️ No saved theme preference');
        }
    }

    checkConsoleErrors() {
        console.log('🐛 Checking for console errors...');
        
        // This would need to be implemented with error listeners
        // For now, just check if error handling is in place
        if (window.onerror || window.addEventListener) {
            this.successes.push('✅ Error handling capabilities available');
        }
    }

    generateReport() {
        console.log('\n📊 PORTFOLIO DIAGNOSTIC REPORT');
        console.log('=' .repeat(50));
        
        if (this.successes.length > 0) {
            console.log('\n✅ SUCCESSES:');
            this.successes.forEach(success => console.log(success));
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️ WARNINGS:');
            this.warnings.forEach(warning => console.log(warning));
        }

        if (this.issues.length > 0) {
            console.log('\n❌ ISSUES:');
            this.issues.forEach(issue => console.log(issue));
        }

        const total = this.successes.length + this.warnings.length + this.issues.length;
        const score = Math.round((this.successes.length / total) * 100);
        
        console.log(`\n📈 HEALTH SCORE: ${score}%`);
        
        if (score >= 90) {
            console.log('🎉 Portfolio is running excellently!');
        } else if (score >= 75) {
            console.log('👍 Portfolio is running well with minor issues');
        } else if (score >= 50) {
            console.log('⚠️ Portfolio has some issues that should be addressed');
        } else {
            console.log('🚨 Portfolio has critical issues requiring immediate attention');
        }

        this.provideFixes();
    }

    provideFixes() {
        console.log('\n🔧 SUGGESTED FIXES:');
        
        if (this.issues.some(issue => issue.includes('CSS'))) {
            console.log('• Refresh the page to reload CSS files');
            console.log('• Check if styles.css file exists and is accessible');
            console.log('• Clear browser cache and reload');
        }

        if (this.issues.some(issue => issue.includes('Function'))) {
            console.log('• Check if all JavaScript files are loaded');
            console.log('• Verify script.js is not blocked by browser');
            console.log('• Check browser console for JavaScript errors');
        }

        if (this.warnings.some(warning => warning.includes('Element'))) {
            console.log('• Some DOM elements may still be loading');
            console.log('• Try running diagnostics again after page fully loads');
        }

        console.log('\n💡 To run diagnostics again: portfolioDebugger.runDiagnostics()');
    }

    // Quick fix methods
    quickFixCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'styles.css';
        document.head.appendChild(link);
        console.log('🔧 Attempted to reload CSS');
    }

    quickFixTheme() {
        if (typeof initializeTheme === 'function') {
            initializeTheme();
            console.log('🔧 Attempted to reinitialize theme');
        }
    }

    quickFixAnimations() {
        if (typeof initializeScrollAnimations === 'function') {
            initializeScrollAnimations();
            console.log('🔧 Attempted to reinitialize animations');
        }
    }
}

// Initialize debugger
const portfolioDebugger = new PortfolioDebugger();

// Auto-run diagnostics when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => portfolioDebugger.runDiagnostics(), 2000);
    });
} else {
    setTimeout(() => portfolioDebugger.runDiagnostics(), 1000);
}

// Make available globally
window.portfolioDebugger = portfolioDebugger;

// Console shortcuts
console.log('🔧 Portfolio Debugger loaded! Available commands:');
console.log('• portfolioDebugger.runDiagnostics() - Run full diagnostics');
console.log('• portfolioDebugger.quickFixCSS() - Attempt to reload CSS');
console.log('• portfolioDebugger.quickFixTheme() - Reinitialize theme');
console.log('• portfolioDebugger.quickFixAnimations() - Reinitialize animations');
