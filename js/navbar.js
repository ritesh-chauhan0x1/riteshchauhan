// navbar.js - injects a shared navbar + social icons into pages
function insertNavbar(basePath) {
  basePath = basePath || '';
  const nav = `
  <header class="site-header">
    <nav class="navbar">
      <div class="nav-left">
        <a class="brand" href="${basePath}index.html">Ritesh Chauhan</a>
      </div>

      <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>

      <div class="nav-menu" id="main-nav">
        <ul class="nav-list">
          <li><a href="${basePath}index.html" class="nav-link"><span class="nav-icon">${''}<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z"/></svg></span>Home</a></li>
          <li><a href="${basePath}pages/about.html" class="nav-link"><span class="nav-icon">${''}<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z"/></svg></span>About</a></li>
          <li class="nav-item dropdown"><a href="${basePath}pages/web-development.html" class="nav-link"><span class="nav-icon">${''}<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 6h18v2H3V6zm0 4h18v8H3v-8z"/></svg></span>Projects</a>
            <ul class="dropdown-menu">
              <li><a href="${basePath}pages/web-development.html">Web Development</a></li>
              <li><a href="${basePath}pages/mobile-apps.html">Mobile Apps</a></li>
              <li><a href="${basePath}pages/ui-ux-designs.html">UI/UX Designs</a></li>
              <li><a href="${basePath}pages/other-works.html">Other Works</a></li>
            </ul>
          </li>

          <li class="nav-item dropdown"><a href="${basePath}pages/programming-languages.html" class="nav-link"><span class="nav-icon">${''}<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 2l4 4-4 4-4-4 4-4zm0 6l4 4-4 4-4-4 4-4z"/></svg></span>Skills</a>
            <ul class="dropdown-menu">
              <li><a href="${basePath}pages/programming-languages.html">Programming Languages</a></li>
              <li><a href="${basePath}pages/frameworks-tools.html">Frameworks & Tools</a></li>
              <li><a href="${basePath}pages/certifications.html">Certifications</a></li>
            </ul>
          </li>

          <li class="nav-item dropdown"><a href="${basePath}pages/tech-blogs.html" class="nav-link"><span class="nav-icon">${''}<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M4 4h16v12H5.17L4 17.17V4zM6 6v8h12V6H6z"/></svg></span>Blog</a>
            <ul class="dropdown-menu">
              <li><a href="${basePath}pages/tech-blogs.html">Tech Blogs</a></li>
              <li><a href="${basePath}pages/personal-blogs.html">Personal Blogs</a></li>
            </ul>
          </li>

          <li class="nav-item dropdown"><a href="${basePath}pages/hackathons.html" class="nav-link"><span class="nav-icon">${''}<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 2l2.9 6.26L22 9.27l-5 3.64L18.18 21 12 17.77 5.82 21 7 12.91l-5-3.64 7.1-1.01L12 2z"/></svg></span>Achievements</a>
            <ul class="dropdown-menu">
              <li><a href="${basePath}pages/hackathons.html">Hackathons</a></li>
              <li><a href="${basePath}pages/competitions.html">Competitions</a></li>
              <li><a href="${basePath}pages/awards.html">Awards</a></li>
            </ul>
          </li>

          <li class="nav-item dropdown"><a href="${basePath}pages/email.html" class="nav-link"><span class="nav-icon">${''}<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M2 6l10 7 10-7v12H2V6zm10 5L2 4h20L12 11z"/></svg></span>Contact</a>
            <ul class="dropdown-menu">
              <li><a href="${basePath}pages/email.html">Email</a></li>
              <li><a href="${basePath}pages/social-links.html">Social Links</a></li>
              <li><a href="${basePath}pages/resume.html">Resume (Download)</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </header>

  <div class="social-icons" aria-hidden="false">
    <a class="social whatsapp" href="https://wa.me/919337940768" aria-label="WhatsApp" target="_blank" rel="noopener"><img src="${basePath}icons/whatsapp.svg" alt="WhatsApp"></a>
    <a class="social instagram" href="https://www.instagram.com/riteshchauhan_15/" aria-label="Instagram" target="_blank" rel="noopener"><img src="${basePath}icons/instagram.svg" alt="Instagram"></a>
    <a class="social github" href="https://github.com/ritesh-chauhan0x1" aria-label="GitHub" target="_blank" rel="noopener"><img src="${basePath}icons/github.svg" alt="GitHub"></a>
    <a class="social facebook" href="https://www.facebook.com/riteshkumar.mahato.18488/" aria-label="Facebook" target="_blank" rel="noopener"><img src="${basePath}icons/facebook.svg" alt="Facebook"></a>
    <a class="social leetcode" href="https://leetcode.com/u/riteshchauhn_15/" aria-label="LeetCode" target="_blank" rel="noopener"><img src="${basePath}icons/leetcode.svg" alt="LeetCode"></a>
    <a class="social linkedin" href="https://www.linkedin.com/in/ritesh-chauhan-79818a374/" aria-label="LinkedIn" target="_blank" rel="noopener"><img src="${basePath}icons/linkedin.svg" alt="LinkedIn"></a>
  </div>
`;

  // Inject into page
  const mount = document.getElementById('site-navbar');
  if (mount) {
    mount.innerHTML = nav;
    // small runtime behavior for toggles (mobile)
    setupNavbarBehavior();
  }
}

function setupNavbarBehavior() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navbar = document.querySelector('.navbar');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('active');
    });
  }

  // set ARIA attributes on dropdown parents
  document.querySelectorAll('.nav-item').forEach(item => {
    const link = item.querySelector('a');
    const submenu = item.querySelector('.dropdown-menu');
    if (link && submenu) {
      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', 'false');
      // prevent tabbing into submenu items until opened on mobile (visual only)
      submenu.querySelectorAll('a').forEach(s => s.setAttribute('tabindex', '-1'));
    }
  });

  // Delegated handling for mobile submenu toggling and link passthrough
  navbar && navbar.addEventListener('click', function (e) {
    const target = e.target.closest('a');
    if (!target) return;
    const parentItem = target.closest('.nav-item');
    if (!parentItem) return;
    const submenu = parentItem.querySelector('.dropdown-menu');
    if (submenu && window.innerWidth <= 780) {
      if (target.closest('.dropdown-menu')) {
        navMenu && navMenu.classList.remove('active');
        navToggle && navToggle.setAttribute('aria-expanded', 'false');
        return; // allow navigation
      }
      e.preventDefault();
      const isOpen = parentItem.classList.toggle('active');
      // update aria-expanded on the parent link
      const parentLink = parentItem.querySelector('a');
      parentLink && parentLink.setAttribute('aria-expanded', String(isOpen));
      // enable submenu tabbing when open
      submenu.querySelectorAll('a').forEach(s => s.setAttribute('tabindex', isOpen ? '0' : '-1'));
      const siblings = parentItem.parentElement.querySelectorAll('.nav-item');
      siblings.forEach(s => { if (s !== parentItem) s.classList.remove('active'); });
    }
  });

  // Keyboard handling for accessibility (Enter/Space opens, Escape closes)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      // close everything
      navMenu && navMenu.classList.remove('active');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const pl = item.querySelector('a');
        const sm = item.querySelector('.dropdown-menu');
        if (pl) pl.setAttribute('aria-expanded', 'false');
        if (sm) sm.querySelectorAll('a').forEach(s => s.setAttribute('tabindex', '-1'));
      });
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      const focused = document.activeElement;
      if (!focused) return;
      const pItem = focused.closest('.nav-item');
      if (!pItem) return;
      const sm = pItem.querySelector('.dropdown-menu');
      if (sm) {
        if (e.key === ' ') e.preventDefault();
        const open = pItem.classList.toggle('active');
        const pl = pItem.querySelector('a');
        pl && pl.setAttribute('aria-expanded', String(open));
        sm.querySelectorAll('a').forEach(s => s.setAttribute('tabindex', open ? '0' : '-1'));
      }
    }
  });

  // Close when clicking outside
  document.addEventListener('click', function (e) {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (!navbar.contains(e.target)) {
      const nm = document.querySelector('.nav-menu');
      nm && nm.classList.remove('active');
      document.querySelectorAll('.nav-item.active').forEach(i => i.classList.remove('active'));
      const nt = document.querySelector('.nav-toggle');
      nt && nt.setAttribute('aria-expanded', 'false');
    }
  });

  // Social icon pop on touch/click for mobile friendliness
  document.querySelectorAll('.social').forEach(s => {
    let timeout;
    function triggerPop() {
      s.classList.remove('pop');
      // retrigger animation
      void s.offsetWidth;
      s.classList.add('pop');
      clearTimeout(timeout);
      timeout = setTimeout(() => s.classList.remove('pop'), 320);
    }
    s.addEventListener('touchstart', function () { triggerPop(); }, {passive:true});
    s.addEventListener('mousedown', function () { triggerPop(); });
    s.addEventListener('focus', function () { triggerPop(); });
  });
}

// Expose for pages to call
window.insertNavbar = insertNavbar;
window.setupNavbarBehavior = setupNavbarBehavior;
