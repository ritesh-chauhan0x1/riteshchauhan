document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const dropdowns = Array.from(document.querySelectorAll('.nav-item'));
  const navbar = document.querySelector('.navbar');

  // Toggle mobile nav open/close
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('active');
    });
  }

  // Use event delegation for dropdown toggles so handlers persist across resizes
  navbar && navbar.addEventListener('click', function (e) {
    const target = e.target.closest('a');
    if (!target) return;

    const parentItem = target.closest('.nav-item');
    if (!parentItem) return;

    const submenu = parentItem.querySelector('.dropdown-menu');
    // If this item has a submenu and we're on small screens, toggle it on click
    if (submenu && window.innerWidth <= 780) {
      // If the click happened on a submenu link, allow navigation and close the menu
      if (target.closest('.dropdown-menu')) {
        // close mobile menu after navigation (gives a moment for the click to register)
        navMenu && navMenu.classList.remove('active');
        navToggle && navToggle.setAttribute('aria-expanded', 'false');
        // do not prevent default — allow the link to navigate
        return;
      }

      // Otherwise, this is the parent link: prevent navigation and toggle submenu
      e.preventDefault();
      parentItem.classList.toggle('active');
      // close other dropdowns (keep only one open at a time on mobile)
      const siblings = parentItem.parentElement.querySelectorAll('.nav-item');
      siblings.forEach(s => { if (s !== parentItem) s.classList.remove('active'); });
    }
  });

  // Keyboard accessibility: open/close with Enter/Space and close with Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      // close mobile menu and any open dropdowns
      navMenu && navMenu.classList.remove('active');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
      document.querySelectorAll('.nav-item.active').forEach(i => i.classList.remove('active'));
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      const focused = document.activeElement;
      if (!focused) return;
      const parentItem = focused.closest('.nav-item');
      if (!parentItem) return;
      const submenu = parentItem.querySelector('.dropdown-menu');
      if (submenu) {
        // prevent scrolling on space
        if (e.key === ' ') e.preventDefault();
        parentItem.classList.toggle('active');
      }
    }
  });

  // Close nav when clicking outside the navbar
  document.addEventListener('click', function (e) {
    if (!navbar) return;
    if (!navbar.contains(e.target)) {
      // close mobile menu
      navMenu && navMenu.classList.remove('active');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
      // collapse any active dropdowns
      document.querySelectorAll('.nav-item.active').forEach(i => i.classList.remove('active'));
    }
  });

  // On resize, remove mobile-only states when moving to desktop width
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 780) {
        // ensure mobile menu closed and no active classes remain
        navMenu && navMenu.classList.remove('active');
        navToggle && navToggle.setAttribute('aria-expanded', 'false');
        document.querySelectorAll('.nav-item.active').forEach(i => i.classList.remove('active'));
      }
    }, 120);
  });

  // Social icon pop on touch/click/focus for mobile friendliness (for static socials on homepage)
  document.querySelectorAll('.social').forEach(s => {
    let timeout;
    function triggerPop() {
      s.classList.remove('pop');
      void s.offsetWidth; // reflow to restart animation
      s.classList.add('pop');
      clearTimeout(timeout);
      timeout = setTimeout(() => s.classList.remove('pop'), 320);
    }
    s.addEventListener('touchstart', function () { triggerPop(); }, {passive:true});
    s.addEventListener('mousedown', function () { triggerPop(); });
    s.addEventListener('focus', function () { triggerPop(); });
  });

});