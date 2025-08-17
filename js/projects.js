/**
 * Projects Page JavaScript
 * Handles project filtering, modal display, and dynamic content loading
 */

class ProjectsPage {
    constructor() {
        this.projects = [];
        this.currentFilter = 'all';
        this.init();
    }

    /**
     * Initialize projects page functionality
     */
    init() {
        this.loadProjects();
        this.setupFilterButtons();
        this.setupProjectModal();
        this.renderProjects();
    }

    /**
     * Load project data (in real app, this would be from API)
     */
    loadProjects() {
        this.projects = [
            {
                id: 1,
                title: "E-Commerce Platform",
                description: "A full-stack e-commerce solution with React frontend and Node.js backend",
                longDescription: "Complete e-commerce platform with user authentication, product catalog, shopping cart, payment integration, and admin dashboard.",
                image: "./1.jpeg",
                technologies: ["React", "Node.js", "MongoDB", "Stripe", "Express"],
                category: "web",
                status: "completed",
                liveUrl: "https://example.com",
                githubUrl: "https://github.com/ritesh-chauhan0x1/ecommerce",
                features: ["User Authentication", "Payment Gateway", "Admin Dashboard", "Responsive Design"]
            },
            {
                id: 2,
                title: "Task Management App",
                description: "A mobile-first task management application with real-time updates",
                longDescription: "Collaborative task management app with real-time updates, team collaboration features, and intuitive drag-and-drop interface.",
                image: "./2.jpeg",
                technologies: ["React Native", "Firebase", "Redux", "TypeScript"],
                category: "mobile",
                status: "completed",
                liveUrl: "https://example.com",
                githubUrl: "https://github.com/ritesh-chauhan0x1/taskapp",
                features: ["Real-time Updates", "Team Collaboration", "Drag & Drop", "Push Notifications"]
            },
            {
                id: 3,
                title: "Weather API Service",
                description: "RESTful API service providing weather data with caching and rate limiting",
                longDescription: "Scalable weather API service with advanced caching strategies, rate limiting, and comprehensive documentation.",
                image: "./3.jpeg",
                technologies: ["Python", "FastAPI", "Redis", "PostgreSQL", "Docker"],
                category: "api",
                status: "completed",
                githubUrl: "https://github.com/ritesh-chauhan0x1/weather-api",
                features: ["RESTful Design", "Caching Layer", "Rate Limiting", "Auto Documentation"]
            },
            {
                id: 4,
                title: "Code Generator Tool",
                description: "CLI tool for generating boilerplate code for various frameworks",
                longDescription: "Command-line tool that generates boilerplate code for React, Vue, Node.js projects with customizable templates.",
                image: "./1.jpeg",
                technologies: ["Node.js", "Commander.js", "Handlebars", "Jest"],
                category: "tools",
                status: "in-progress",
                githubUrl: "https://github.com/ritesh-chauhan0x1/code-generator",
                features: ["Multiple Templates", "CLI Interface", "Customizable", "Cross-platform"]
            },
            {
                id: 5,
                title: "Portfolio Website",
                description: "Responsive portfolio website with dark mode and smooth animations",
                longDescription: "Personal portfolio website showcasing projects, skills, and experience with modern design principles.",
                image: "./2.jpeg",
                technologies: ["HTML5", "CSS3", "JavaScript", "GSAP"],
                category: "web",
                status: "completed",
                liveUrl: "https://riteshchauhan.com.np",
                githubUrl: "https://github.com/ritesh-chauhan0x1/portfolio",
                features: ["Responsive Design", "Dark Mode", "Smooth Animations", "SEO Optimized"]
            },
            {
                id: 6,
                title: "Machine Learning Dashboard",
                description: "Interactive dashboard for visualizing ML model performance and data insights",
                longDescription: "Comprehensive dashboard for machine learning practitioners to visualize model performance, data insights, and training metrics.",
                image: "./3.jpeg",
                technologies: ["Python", "Streamlit", "Pandas", "Plotly", "Scikit-learn"],
                category: "web",
                status: "planned",
                githubUrl: "https://github.com/ritesh-chauhan0x1/ml-dashboard",
                features: ["Interactive Charts", "Model Comparison", "Data Visualization", "Export Reports"]
            }
        ];
    }

    /**
     * Setup filter button functionality
     */
    setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Update current filter and re-render projects
                this.currentFilter = e.target.getAttribute('data-filter');
                this.renderProjects();
            });
        });
    }

    /**
     * Render projects based on current filter
     */
    renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        // Show loading state
        projectsGrid.innerHTML = `
            <div class="projects-loading">
                <div class="loading-spinner"></div>
                <p>Loading projects...</p>
            </div>
        `;

        // Simulate loading delay
        setTimeout(() => {
            const filteredProjects = this.currentFilter === 'all' 
                ? this.projects 
                : this.projects.filter(project => project.category === this.currentFilter);

            projectsGrid.innerHTML = '';

            if (filteredProjects.length === 0) {
                projectsGrid.innerHTML = `
                    <div class="no-projects">
                        <i class="fas fa-folder-open"></i>
                        <h3>No projects found</h3>
                        <p>No projects match the selected filter.</p>
                    </div>
                `;
                return;
            }

            filteredProjects.forEach((project, index) => {
                const projectCard = this.createProjectCard(project);
                projectsGrid.appendChild(projectCard);
                
                // Animate card appearance
                setTimeout(() => {
                    projectCard.style.opacity = '1';
                    projectCard.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 500);
    }

    /**
     * Create project card element
     */
    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';

        const statusDotClass = project.status === 'completed' ? '' : 
                              project.status === 'in-progress' ? 'in-progress' : 'planned';

        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    <div class="project-actions">
                        ${project.liveUrl ? `<a href="${project.liveUrl}" class="project-link btn-primary" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>` : ''}
                        <a href="${project.githubUrl}" class="project-link btn-outline" target="_blank">
                            <i class="fab fa-github"></i> Code
                        </a>
                    </div>
                    <div class="project-status">
                        <span class="status-dot ${statusDotClass}"></span>
                        ${project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
                    </div>
                </div>
            </div>
        `;

        // Add click handler for project details
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on links
            if (!e.target.closest('a')) {
                this.showProjectModal(project);
            }
        });

        return card;
    }

    /**
     * Setup project modal functionality
     */
    setupProjectModal() {
        // Create modal if it doesn't exist
        if (!document.getElementById('project-modal')) {
            const modal = document.createElement('div');
            modal.id = 'project-modal';
            modal.className = 'project-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <button class="modal-close" id="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="modal-body" id="modal-body">
                        <!-- Modal content will be inserted here -->
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Setup close handlers
            const closeBtn = document.getElementById('modal-close');
            closeBtn.addEventListener('click', () => this.closeProjectModal());

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeProjectModal();
                }
            });

            // Close modal with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeProjectModal();
                }
            });
        }
    }

    /**
     * Show project modal with detailed information
     */
    showProjectModal(project) {
        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');

        modalBody.innerHTML = `
            <div class="modal-project-header">
                <img src="${project.image}" alt="${project.title}">
                <div class="modal-project-info">
                    <h2>${project.title}</h2>
                    <p>${project.longDescription}</p>
                </div>
            </div>
            <div class="modal-project-details">
                <div class="modal-section">
                    <h3>Technologies Used</h3>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                <div class="modal-section">
                    <h3>Key Features</h3>
                    <ul class="features-list">
                        ${project.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="modal-section">
                    <h3>Project Links</h3>
                    <div class="modal-links">
                        ${project.liveUrl ? `<a href="${project.liveUrl}" class="btn-primary" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>` : ''}
                        <a href="${project.githubUrl}" class="btn-outline" target="_blank">
                            <i class="fab fa-github"></i> View Code
                        </a>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close project modal
     */
    closeProjectModal() {
        const modal = document.getElementById('project-modal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    /**
     * Setup search functionality (bonus feature)
     */
    setupSearch() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search projects...';
        searchInput.className = 'project-search';
        
        const filtersContainer = document.querySelector('.filter-tabs');
        filtersContainer.parentNode.insertBefore(searchInput, filtersContainer);

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            this.filterProjectsBySearch(searchTerm);
        });
    }

    /**
     * Filter projects by search term
     */
    filterProjectsBySearch(searchTerm) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const title = card.querySelector('.project-title').textContent.toLowerCase();
            const description = card.querySelector('.project-description').textContent.toLowerCase();
            const techTags = Array.from(card.querySelectorAll('.tech-tag'))
                .map(tag => tag.textContent.toLowerCase()).join(' ');
            
            const matchesSearch = title.includes(searchTerm) || 
                                description.includes(searchTerm) || 
                                techTags.includes(searchTerm);
            
            if (matchesSearch) {
                card.style.display = 'block';
                card.classList.remove('hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });
    }
}

// Initialize projects page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for base.js to initialize
    setTimeout(() => {
        window.projectsPage = new ProjectsPage();
    }, 100);
});

// Production - Remove console.log for performance
// console.log('💼 Projects Page Script Loaded');
