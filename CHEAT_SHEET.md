# Projects Portfolio - Code Snippets & Cheat Sheet

## 🎨 CSS Customization Snippets

### Change Primary Color Theme
```css
/* In projects-style.css, replace :root section */
:root {
  --primary-color: #FF6B6B;      /* Change from cyan to red */
  --accent-purple: #9D4EDD;      /* Change purple */
  --accent-pink: #FF006E;        /* Keep or change pink */
  --accent-green: #06D6A0;       /* Keep or change green */
  /* ... rest of variables */
}
```

### Make Cards Wider
```css
.projects-grid {
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); /* was 340px */
  gap: 35px; /* Increase spacing */
}
```

### Slow Down Animations
```css
.project-card {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); /* was 0.3s */
}

.filter-btn:hover {
  transition: all 0.5s ease; /* was 0.3s */
}
```

### Softer Glassmorphism (More Subtle)
```css
.project-card {
  background: rgba(255, 255, 255, 0.02); /* was 0.05 */
  backdrop-filter: blur(10px); /* was 20px */
}

.filter-btn {
  backdrop-filter: blur(5px); /* was 10px */
}
```

### Stronger Glassmorphism (More Visible)
```css
.project-card {
  background: rgba(255, 255, 255, 0.1); /* was 0.05 */
  backdrop-filter: blur(30px); /* was 20px */
}
```

### Remove Featured Badge Animation
```css
.featured-badge {
  /* Remove this entire keyframe */
  animation: float 3s ease-in-out infinite;
  
  /* OR replace with: */
  animation: none;
}
```

### Make Mobile Layout Show 2 Cards
```css
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr); /* was 1 column */
    gap: 15px;
  }
}
```

### Increase Font Sizes
```css
.hero-content h1 {
  font-size: clamp(3rem, 10vw, 5rem); /* was 2.5-4rem */
}

.category-title {
  font-size: 2.5rem; /* was 2rem */
}

.project-header h3 {
  font-size: 1.3rem; /* was 1.5rem */
}
```

---

## 🔗 HTML Snippets for Common Needs

### Add a Project with All Features
```html
<div class="project-card glass-card featured" data-category="ai">
  <div class="featured-badge">⭐ Featured</div>
  
  <div class="project-header">
    <h3>Advanced Machine Learning</h3>
    <div class="project-badges">
      <span class="badge">ML</span>
      <span class="badge">Python</span>
      <span class="badge">TensorFlow</span>
    </div>
  </div>
  
  <p class="project-description">
    State-of-the-art machine learning model for predictive analytics.
    Trained on 100k+ samples with 94% accuracy on test set.
  </p>
  
  <div class="tech-stack">
    <span class="tech-tag">Python</span>
    <span class="tech-tag">TensorFlow</span>
    <span class="tech-tag">Pandas</span>
    <span class="tech-tag">Scikit-learn</span>
    <span class="tech-tag">Jupyter</span>
  </div>
  
  <div class="project-links">
    <a href="https://github.com/ritesh-chauhan/ml-project" 
       target="_blank" rel="noopener noreferrer" class="link-btn github-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      GitHub
    </a>
    <a href="https://ritesh-chauhan.github.io/ml-project" 
       target="_blank" rel="noopener noreferrer" class="link-btn demo-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="1"></circle>
        <path d="M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14"></path>
      </svg>
      Live Demo
    </a>
  </div>
</div>
```

### Simple Project (Minimal)
```html
<div class="project-card glass-card" data-category="web">
  <div class="project-header">
    <h3>Todo App</h3>
  </div>
  
  <p class="project-description">
    Simple todo list application with local storage.
  </p>
  
  <div class="tech-stack">
    <span class="tech-tag">React</span>
    <span class="tech-tag">CSS</span>
  </div>
  
  <div class="project-links">
    <a href="https://github.com/ritesh-chauhan/todo-app" 
       target="_blank" class="link-btn github-btn">
      GitHub
    </a>
    <a href="https://ritesh-chauhan.github.io/todo-app" 
       target="_blank" class="link-btn demo-btn">
      Live Demo
    </a>
  </div>
</div>
```

### Project Without Demo Link
```html
<div class="project-card glass-card" data-category="ai">
  <div class="project-header">
    <h3>Private ML Research</h3>
  </div>
  
  <p class="project-description">
    Advanced research paper implementation for private project.
  </p>
  
  <div class="tech-stack">
    <span class="tech-tag">Python</span>
    <span class="tech-tag">PyTorch</span>
  </div>
  
  <div class="project-links">
    <a href="https://github.com/ritesh-chauhan/ml-research" 
       target="_blank" class="link-btn github-btn">
      GitHub
    </a>
  </div>
</div>
```

---

## 💾 JSON Snippets for Dynamic Version

### Add a Simple Project
```json
{
  "id": "simple-game",
  "title": "Flappy Bird Clone",
  "category": "games",
  "featured": false,
  "description": "Recreated the popular flappy bird game using Phaser.",
  "badges": ["JavaScript", "Game"],
  "technologies": ["JavaScript", "Phaser", "HTML5"],
  "github": "https://github.com/ritesh-chauhan/flappy-bird",
  "demo": "https://ritesh-chauhan.github.io/flappy-bird",
  "status": "active"
}
```

### Add a Featured Project
```json
{
  "id": "startup-saas",
  "title": "AI Startup Platform",
  "category": "web",
  "featured": true,
  "description": "Full-stack SaaS platform for AI-powered content generation. Multi-user, payment integration, real-time analytics.",
  "badges": ["Next.js", "Startup"],
  "technologies": ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "OpenAI"],
  "github": "https://github.com/ritesh-chauhan/ai-startup",
  "demo": "https://ritesh-chauhan.github.io/ai-startup",
  "status": "active"
}
```

### Add a WIP Project
```json
{
  "id": "blockchain-app",
  "title": "Blockchain Wallet (WIP)",
  "category": "web",
  "featured": false,
  "description": "Web3 wallet application with multi-chain support. Currently in development.",
  "badges": ["Web3", "WIP"],
  "technologies": ["React", "Web3.js", "Ethereum", "Solidity"],
  "github": "https://github.com/ritesh-chauhan/blockchain-wallet",
  "demo": "https://ritesh-chauhan.github.io/blockchain-wallet",
  "status": "in-development"
}
```

---

## ⌨️ JavaScript Snippets

### Custom Filter Logic
```javascript
// Add custom filtering beyond category in projects-filter.js
function filterByTech(tech) {
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    const technologies = card.textContent;
    if (technologies.includes(tech)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// Usage: filterByTech('React');
```

### Add Click Tracking
```javascript
// Add to projects-filter.js to track which projects are clicked
function trackProjectClick(projectTitle) {
  if (window.gtag) {
    gtag('event', 'project_click', {
      'project_name': projectTitle
    });
  }
}

// Add to link buttons:
// <a ... onclick="trackProjectClick('Project Name')">
```

### Add Search Functionality
```javascript
// Add search to projects
function searchProjects(query) {
  const projectCards = document.querySelectorAll('.project-card');
  const lowerQuery = query.toLowerCase();
  
  projectCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const desc = card.querySelector('.project-description').textContent.toLowerCase();
    
    if (title.includes(lowerQuery) || desc.includes(lowerQuery)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// Usage: searchProjects('react');
```

### Add Load More Button
```javascript
// Show limited projects, load more on click
function loadMoreProjects() {
  const hiddenCards = document.querySelectorAll('.project-card.hidden');
  hiddenCards.forEach((card, index) => {
    if (index < 3) { // Load 3 at a time
      card.classList.remove('hidden');
      card.style.animation = 'slideInUp 0.6s ease forwards';
    }
  });
}
```

---

## 🎯 Quick Customization Recipes

### Dark Theme to Light Theme
```css
:root {
  --primary-color: #0066CC; /* Blue */
  --accent-purple: #6600CC; /* Purple */
  --accent-pink: #CC0066; /* Pink */
  --bg-dark: #F5F5F5; /* Light gray */
  --bg-darker: #FFFFFF; /* White */
  --glass-bg: rgba(0, 0, 0, 0.03);
  --glass-border: rgba(0, 0, 0, 0.1);
  --text-primary: #000000; /* Black */
  --text-secondary: #333333; /* Dark gray */
  --text-tertiary: #666666; /* Medium gray */
}
```

### Corporate Blue Theme
```css
:root {
  --primary-color: #1E90FF; /* Blue */
  --accent-purple: #4169E1; /* Royal blue */
  --accent-pink: #FF69B4; /* Hot pink */
  --bg-dark: #001F3F; /* Navy */
  --bg-darker: #000517; /* Dark navy */
  /* ... text colors ... */
}
```

### Neon Cyberpunk Theme
```css
:root {
  --primary-color: #00FF88; /* Neon green */
  --accent-purple: #FF00FF; /* Magenta */
  --accent-pink: #FF0080; /* Hot pink */
  --bg-dark: #0a0a0a; /* Black */
  --bg-darker: #000000; /* Pure black */
  --text-primary: #00FF88; /* Neon green */
  --text-secondary: #FF00FF; /* Magenta */
}
```

### No Animation Version (for performance)
```css
/* Add to projects-style.css */
.project-card,
.link-btn,
.filter-btn {
  transition: none !important;
  animation: none !important;
}
```

### Cards in Rows (Not Responsive)
```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Always 3 columns */
  gap: 30px;
}

@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 🔍 Common Issues & Fixes

### Issue: Cards Don't Filter
**Fix:**
```javascript
// Check data attributes match
// In HTML: data-category="ai"
// In Button: data-filter="ai"
// They must be identical!
```

### Issue: Styles Not Applied
**Fix:**
```html
<!-- Make sure CSS is linked correctly -->
<link rel="stylesheet" href="../css/projects-style.css">

<!-- Verify path matches your structure -->
```

### Issue: Links Open in Same Tab
**Fix:**
```html
<!-- Add target="_blank" to all links -->
<a href="..." target="_blank" rel="noopener noreferrer">
  Link
</a>
```

### Issue: JSON Doesn't Load
**Fix:**
```javascript
// Add error handling to projects-dynamic.js
async function loadProjectsData() {
  try {
    const response = await fetch('../data/projects.json');
    if (!response.ok) {
      console.error('HTTP error', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}
```

---

## 📊 Add Google Analytics

```html
<!-- Add to projects.html <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>

<!-- Track filter button clicks -->
<script>
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    gtag('event', 'filter_click', {
      'filter_type': btn.dataset.filter
    });
  });
});

// Track GitHub link clicks
document.querySelectorAll('.github-btn').forEach(link => {
  link.addEventListener('click', () => {
    gtag('event', 'github_click', {
      'project': link.href
    });
  });
});
</script>
```

---

## 🎁 Bonus: Copy-Paste Ready Icons

### GitHub Icon (Already Included)
Used in all GitHub buttons - no changes needed

### Demo Icon (Already Included)
Simple eye icon for live demo links

### Custom Icons
```html
<!-- Briefcase for work projects -->
<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20 6h-2.18c.11-.31.18-.645.18-1a2.996 2.996 0 0 0-5.362-1.646l-.324.682-.324-.682C11.112 2.045 9.966 1 8.5 1 7.12 1 6 2.12 6 3.5c0 .355.07.69.182 1H4c-1.105 0-2 .895-2 2v14c0 1.105.895 2 2 2h16c1.105 0 2-.895 2-2V8c0-1.105-.895-2-2-2zm-11-2c.828 0 1.5.672 1.5 1.5S9.828 5 9 5s-1.5-.672-1.5-1.5S8.172 4 9 4zm5 0c.828 0 1.5.672 1.5 1.5S14.828 5 14 5s-1.5-.672-1.5-1.5S13.172 4 14 4z"/>
</svg>
```

---

## 📁 File Organization Tips

```
projects/
├── Main Files
│   ├── projects.html
│   ├── projects-style.css
│   ├── projects-filter.js
│   └── projects.json
│
├── Documentation
│   ├── PROJECTS_README.md
│   ├── QUICK_REFERENCE.md
│   ├── IMPLEMENTATION_GUIDE.md
│   └── CHEAT_SHEET.md
│
└── Images (Optional)
    ├── project-thumbnail.jpg
    ├── logo.svg
    └── banner.jpg
```

---

**Quick Links**
- Main Page: `pages/projects.html`
- Styling: `css/projects-style.css`
- Logic: `js/projects-filter.js`
- Data: `data/projects.json`

**Created**: 2024 | **Version**: 1.0
