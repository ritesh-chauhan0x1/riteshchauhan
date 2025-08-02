/**
 * Portfolio Link Verification and Fix System
 * This script checks all links and files to ensure they work properly
 */

class PortfolioVerifier {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.successes = [];
    }

    async verifyPortfolio() {
        console.log('🔍 Starting Portfolio Verification...');
        
        await this.checkMainFiles();
        await this.checkFeatureFiles();
        await this.checkNavigation();
        await this.checkProjectLinks();
        
        this.generateReport();
    }

    async checkMainFiles() {
        const mainFiles = [
            'index.html',
            'styles.css',
            'script.js',
            'navigation.js'
        ];

        for (const file of mainFiles) {
            try {
                const response = await fetch(file, { method: 'HEAD' });
                if (response.ok) {
                    this.successes.push(`✅ ${file} - OK`);
                } else {
                    this.errors.push(`❌ ${file} - Not found (${response.status})`);
                }
            } catch (error) {
                this.errors.push(`❌ ${file} - Network error`);
            }
        }
    }

    async checkFeatureFiles() {
        const featureFiles = [
            'features/index.html',
            'features/live-playground.html',
            'features/terminal-about.html',
            'features/voice-assistant.html',
            'features/parallax-story.html',
            'features/snake-game.html'
        ];

        for (const file of featureFiles) {
            try {
                const response = await fetch(file, { method: 'HEAD' });
                if (response.ok) {
                    this.successes.push(`✅ ${file} - OK`);
                } else {
                    this.errors.push(`❌ ${file} - Not found (${response.status})`);
                }
            } catch (error) {
                this.errors.push(`❌ ${file} - Network error`);
            }
        }
    }

    checkNavigation() {
        const navLinks = document.querySelectorAll('nav a[href]');
        let navErrors = 0;
        let navSuccess = 0;

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    navSuccess++;
                } else {
                    this.warnings.push(`⚠️ Navigation link "${href}" - target not found`);
                    navErrors++;
                }
            }
        });

        if (navSuccess > 0) {
            this.successes.push(`✅ Navigation - ${navSuccess} internal links working`);
        }
        if (navErrors > 0) {
            this.warnings.push(`⚠️ Navigation - ${navErrors} broken internal links`);
        }
    }

    checkProjectLinks() {
        // Get projects from localStorage or default data
        const projects = JSON.parse(localStorage.getItem('portfolio_projects') || 'null') || 
                        (typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA.projects : []);

        let validProjects = 0;
        let invalidProjects = 0;

        projects.forEach(project => {
            let projectValid = true;

            // Check if project has required fields
            if (!project.title || !project.description) {
                this.warnings.push(`⚠️ Project "${project.title || 'Unnamed'}" - missing required fields`);
                projectValid = false;
            }

            // Check URLs
            if (project.liveUrl && !this.isValidUrl(project.liveUrl)) {
                this.warnings.push(`⚠️ Project "${project.title}" - invalid live URL`);
                projectValid = false;
            }

            if (project.githubUrl && !this.isValidUrl(project.githubUrl)) {
                this.warnings.push(`⚠️ Project "${project.title}" - invalid GitHub URL`);
                projectValid = false;
            }

            if (projectValid) {
                validProjects++;
            } else {
                invalidProjects++;
            }
        });

        this.successes.push(`✅ Projects - ${validProjects} valid projects`);
        if (invalidProjects > 0) {
            this.warnings.push(`⚠️ Projects - ${invalidProjects} projects have issues`);
        }
    }

    isValidUrl(string) {
        try {
            new URL(string.startsWith('http') ? string : 'https://' + string);
            return true;
        } catch (_) {
            return false;
        }
    }

    generateReport() {
        console.log('\n📊 PORTFOLIO VERIFICATION REPORT');
        console.log('='.repeat(50));
        
        if (this.successes.length > 0) {
            console.log('\n✅ SUCCESSES:');
            this.successes.forEach(success => console.log(success));
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️ WARNINGS:');
            this.warnings.forEach(warning => console.log(warning));
        }

        if (this.errors.length > 0) {
            console.log('\n❌ ERRORS:');
            this.errors.forEach(error => console.log(error));
        }

        console.log('\n📈 SUMMARY:');
        console.log(`Total Checks: ${this.successes.length + this.warnings.length + this.errors.length}`);
        console.log(`Successes: ${this.successes.length}`);
        console.log(`Warnings: ${this.warnings.length}`);
        console.log(`Errors: ${this.errors.length}`);

        const score = Math.round((this.successes.length / (this.successes.length + this.warnings.length + this.errors.length)) * 100);
        console.log(`Portfolio Health Score: ${score}%`);

        if (score >= 90) {
            console.log('🎉 Excellent! Your portfolio is in great shape!');
        } else if (score >= 75) {
            console.log('👍 Good! Minor issues to address.');
        } else if (score >= 50) {
            console.log('⚠️ Needs attention. Several issues found.');
        } else {
            console.log('🚨 Critical issues need immediate attention.');
        }

        // Provide quick fixes
        this.suggestFixes();
    }

    suggestFixes() {
        console.log('\n🔧 SUGGESTED FIXES:');
        
        if (this.errors.some(e => e.includes('404') || e.includes('Not found'))) {
            console.log('• Check that all files are in the correct directories');
            console.log('• Verify file names match exactly (case-sensitive)');
        }

        if (this.warnings.some(w => w.includes('Navigation'))) {
            console.log('• Add missing section IDs to HTML elements');
            console.log('• Update navigation links to match existing sections');
        }

        if (this.warnings.some(w => w.includes('Project'))) {
            console.log('• Update project URLs to include https://');
            console.log('• Add missing project information through admin dashboard');
        }

        console.log('• Run: portfolioVerifier.autoFix() to attempt automatic fixes');
    }

    autoFix() {
        console.log('🔧 Attempting automatic fixes...');
        
        // Auto-fix project URLs
        const projects = JSON.parse(localStorage.getItem('portfolio_projects') || 'null');
        if (projects) {
            let fixed = 0;
            projects.forEach(project => {
                if (project.liveUrl && !project.liveUrl.startsWith('http')) {
                    project.liveUrl = 'https://' + project.liveUrl;
                    fixed++;
                }
                if (project.githubUrl && !project.githubUrl.startsWith('http')) {
                    project.githubUrl = 'https://' + project.githubUrl;
                    fixed++;
                }
            });
            
            if (fixed > 0) {
                localStorage.setItem('portfolio_projects', JSON.stringify(projects));
                console.log(`✅ Fixed ${fixed} project URLs`);
                
                // Reload projects if function exists
                if (typeof loadProjectsToPublic === 'function') {
                    loadProjectsToPublic();
                    console.log('🔄 Reloaded projects with fixed URLs');
                }
            }
        }

        console.log('🎯 Auto-fix complete! Run verification again to see improvements.');
    }
}

// Make verifier available globally
window.portfolioVerifier = new PortfolioVerifier();

// Quick access functions
window.verifyPortfolio = () => window.portfolioVerifier.verifyPortfolio();
window.fixPortfolio = () => window.portfolioVerifier.autoFix();

// Auto-run verification in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setTimeout(() => {
        console.log('🔍 Running automatic portfolio verification...');
        window.portfolioVerifier.verifyPortfolio();
    }, 2000);
}
