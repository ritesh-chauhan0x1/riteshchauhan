/**
 * Projects Advanced Version - Dynamic Loading
 * Alternative approach: Load projects from JSON data
 * 
 * Usage: Replace projects-filter.js with this file for dynamic loading
 * Requires: data/projects.json in your project root
 */

(function() {
  'use strict';

  const FILTER_KEY = 'projectsFilter';
  const PROJECTS_DATA_URL = '../data/projects.json';

  // DOM Elements
  let filterBtns = [];
  let projectsContainer = [];

  /**
   * Fetch and parse project data
   */
  async function loadProjectsData() {
    try {
      const response = await fetch(PROJECTS_DATA_URL);
      if (!response.ok) {
        console.error('Failed to load projects data');
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading projects:', error);
      return null;
    }
  }

  /**
   * Generate project card HTML
   */
  function generateProjectCard(project) {
    const badgesHTML = project.badges.map(badge => `<span class="badge">${badge}</span>`).join('');
    const techTagsHTML = project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('');

    return `
      <div class="project-card glass-card" data-category="${project.category}">
        <div class="project-header">
          <h3>${project.title}</h3>
          <div class="project-badges">
            ${badgesHTML}
          </div>
        </div>
        <p class="project-description">
          ${project.description}
        </p>
        <div class="tech-stack">
          ${techTagsHTML}
        </div>
        <div class="project-links">
          <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="link-btn github-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="link-btn demo-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="1"></circle>
              <path d="M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14"></path>
            </svg>
            Live Demo
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Render projects grouped by category
   */
  function renderProjects(projectsData) {
    const projectsSection = document.querySelector('.projects-section');
    if (!projectsSection) return;

    let html = '';
    const categories = projectsData.categories.filter(cat => cat.id !== 'all');

    categories.forEach(category => {
      const categoryProjects = projectsData.projects.filter(p => p.category === category.id);
      
      if (categoryProjects.length > 0) {
        html += `<h2 class="category-title">${category.icon} ${category.name}</h2>`;
        html += '<div class="projects-grid">';
        
        categoryProjects.forEach(project => {
          html += generateProjectCard(project);
        });
        
        html += '</div>';
      }
    });

    projectsSection.innerHTML = html;
    setupEventListeners();
  }

  /**
   * Setup filter event listeners
   */
  function setupEventListeners() {
    filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selectedFilter = e.target.dataset.filter;
        handleFilterClick(selectedFilter, projectCards);
      });
    });
  }

  /**
   * Handle filter click
   */
  function handleFilterClick(filter, projectCards) {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

    localStorage.setItem(FILTER_KEY, filter);
    filterProjects(filter, projectCards);
  }

  /**
   * Filter projects by category
   */
  function filterProjects(filter, projectCards) {
    projectCards.forEach((card, index) => {
      const cardCategory = card.dataset.category;
      const isMatch = filter === 'all' || cardCategory === filter;

      if (isMatch) {
        setTimeout(() => {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          void card.offsetWidth;
          card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 50);
      } else {
        card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });

    scrollToProjects();
  }

  /**
   * Scroll to projects section
   */
  function scrollToProjects() {
    const projectsSection = document.querySelector('.projects-section');
    if (projectsSection) {
      const headerHeight = 80;
      const offsetTop = projectsSection.offsetTop - headerHeight;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  }

  /**
   * Initialize application
   */
  async function init() {
    const projectsData = await loadProjectsData();
    
    if (!projectsData) {
      console.warn('Could not load projects data, falling back to static HTML');
      return;
    }

    renderProjects(projectsData);
    
    // Load saved filter
    const savedFilter = localStorage.getItem(FILTER_KEY) || 'all';
    const filterBtn = document.querySelector(`[data-filter="${savedFilter}"]`);
    if (filterBtn) {
      filterBtn.classList.add('active');
      const projectCards = document.querySelectorAll('.project-card');
      filterProjects(savedFilter, projectCards);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
