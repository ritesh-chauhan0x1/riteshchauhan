/**
 * Projects Filter Script
 * Handles project category filtering with smooth transitions
 */

(function() {
  'use strict';

  // DOM Elements
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Store selected filter in localStorage
  const FILTER_KEY = 'projectsFilter';

  /**
   * Initialize filter functionality
   */
  function init() {
    // Setup hamburger menu toggle for mobile
    setupFilterToggle();

    // Load saved filter preference
    const savedFilter = localStorage.getItem(FILTER_KEY) || 'all';
    
    // Set active button
    filterBtns.forEach(btn => {
      if (btn.dataset.filter === savedFilter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Apply saved filter
    filterProjects(savedFilter);

    // Add event listeners
    filterBtns.forEach(btn => {
      btn.addEventListener('click', handleFilterClick);
    });
  }

  /**
   * Setup hamburger menu toggle for mobile/tablet
   */
  function setupFilterToggle() {
    const toggleBtn = document.getElementById('filterToggle');
    const filterSection = document.querySelector('.filter-section');
    const projectsLayout = document.querySelector('.projects-layout');

    if (!toggleBtn || !filterSection) return;

    // Toggle button click
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('active');
      projectsLayout.classList.toggle('mobile-open');
    });

    // Close sidebar when filter button is clicked
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Only close on mobile
        if (window.innerWidth < 1024) {
          toggleBtn.classList.remove('active');
          projectsLayout.classList.remove('mobile-open');
        }
      });
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (!filterSection.contains(e.target) && !toggleBtn.contains(e.target)) {
        toggleBtn.classList.remove('active');
        projectsLayout.classList.remove('mobile-open');
      }
    });

    // Close sidebar on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        toggleBtn.classList.remove('active');
        projectsLayout.classList.remove('mobile-open');
      }
    });
  }

  /**
   * Handle filter button click
   */
  function handleFilterClick(event) {
    const selectedFilter = event.target.dataset.filter;

    // Update active button
    filterBtns.forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Save preference
    localStorage.setItem(FILTER_KEY, selectedFilter);

    // Apply filter with animation
    filterProjects(selectedFilter);
  }

  /**
   * Filter and display projects
   */
  function filterProjects(filter) {
    projectCards.forEach((card, index) => {
      const cardCategory = card.dataset.category;
      const isMatch = filter === 'all' || cardCategory === filter;

      if (isMatch) {
        // Show project
        setTimeout(() => {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          
          // Trigger reflow for animation
          void card.offsetWidth;
          
          card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 50);
      } else {
        // Hide project
        card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });

    // Scroll to projects section
    scrollToProjects();
  }

  /**
   * Smooth scroll to projects section
   */
  function scrollToProjects() {
    const projectsSection = document.querySelector('.projects-section');
    if (projectsSection) {
      const headerHeight = 80; // Adjust based on your header height
      const offsetTop = projectsSection.offsetTop - headerHeight;
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Add keyboard navigation
   */
  function handleKeyboardNav(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      const activeBtn = document.querySelector('.filter-btn.active');
      const btnArray = Array.from(filterBtns);
      const currentIndex = btnArray.indexOf(activeBtn);
      
      let nextIndex;
      if (event.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % btnArray.length;
      } else {
        nextIndex = (currentIndex - 1 + btnArray.length) % btnArray.length;
      }
      
      btnArray[nextIndex].click();
      btnArray[nextIndex].focus();
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Add keyboard navigation
  document.addEventListener('keydown', handleKeyboardNav);

  // Handle scroll animations for cards
  function observeCards() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'slideInUp 0.6s ease forwards';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    projectCards.forEach(card => {
      observer.observe(card);
    });
  }

  observeCards();

})();
