// Enhanced Portfolio JavaScript

// Admin System Configuration
const ADMIN_CREDENTIALS = {
    username: 'Ritesh',
    password: 'Ritesh@4368@'
};

// Data Storage Keys
const STORAGE_KEYS = {
    profile: 'portfolio_profile',
    content: 'portfolio_content',
    projects: 'portfolio_projects',
    skills: 'portfolio_skills',
    social: 'portfolio_social',
    hobbies: 'portfolio_hobbies',
    achievements: 'portfolio_achievements',
    isLoggedIn: 'portfolio_admin_logged_in'
};

// Initialize default data
const DEFAULT_DATA = {
    profile: {
        name: 'Ritesh Chauhan',
        title: 'Full Stack Developer & CSE Student',
        location: 'Birgunj, Nepal',
        education: '4th Year B.Tech CSE at KIIT',
        photo: '',
        bio: '🎓 4th Year B.Tech CSE Student at KIIT University | 🇳🇵 Born in Birgunj, Nepal\nPassionate about creating innovative digital solutions and bringing ideas to life through code.',
        resumeUrl: ''
    },
    content: {
        about: 'Hello! I\'m Ritesh, a passionate Computer Science Engineering student from Nepal, currently pursuing my B.Tech at KIIT University. Born and raised in the vibrant city of Birgunj, I discovered my love for technology and programming during my early college years.',
        stats: {
            yearsInTech: 4,
            projects: 50,
            leetcode: 100
        }
    },
    social: {
        instagram: 'https://instagram.com/riteshchauhan_15',
        facebook: 'https://facebook.com/riteshchauhan_15',
        github: 'https://github.com/ritesh-chauhan0x1',
        leetcode: 'https://leetcode.com/u/riteshchauhn_15',
        whatsapp: 'https://wa.me/+919337940768',
        email: '22054368@kiit.ac.in'
    },
    hobbies: [
        { icon: '🎮', name: 'Gaming', description: 'Love playing strategic and adventure games' },
        { icon: '💻', name: 'Coding', description: 'Building cool projects and learning new technologies' },
        { icon: '📚', name: 'Reading', description: 'Technical blogs and sci-fi novels' },
        { icon: '🏃', name: 'Fitness', description: 'Regular exercise and staying healthy' }
    ],
    achievements: [
        { title: 'Dean\'s List', description: 'Academic Excellence at KIIT University', date: '2023' },
        { title: '100+ LeetCode Problems', description: 'Solved complex algorithmic challenges', date: '2024' },
        { title: 'Hackathon Participant', description: 'Multiple coding competitions', date: '2023-2024' },
        { title: 'Open Source Contributor', description: 'Contributing to various projects', date: '2024' }
    ]
};

// Initialize data if not exists
function initializeData() {
    Object.keys(DEFAULT_DATA).forEach(key => {
        if (!localStorage.getItem(STORAGE_KEYS[key])) {
            localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(DEFAULT_DATA[key]));
        }
    });
}

// Admin System
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    initializeAdminSystem();
    loadPortfolioData();
    
    // Check if already logged in
    if (localStorage.getItem(STORAGE_KEYS.isLoggedIn) === 'true') {
        showDashboard();
    }
});

function initializeAdminSystem() {
    const adminIcon = document.getElementById('adminIcon');
    const loginModal = document.getElementById('loginModal');
    const closeLogin = document.getElementById('closeLogin');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');

    // Admin icon click
    adminIcon.addEventListener('click', () => {
        loginModal.style.display = 'block';
        createParticlesBurst(
            adminIcon.getBoundingClientRect().left + 25,
            adminIcon.getBoundingClientRect().top + 25
        );
    });

    // Close modal
    closeLogin.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            localStorage.setItem(STORAGE_KEYS.isLoggedIn, 'true');
            loginModal.style.display = 'none';
            showDashboard();
            showMessage('Login successful! Welcome to admin dashboard.', 'success');
        } else {
            showMessage('Invalid credentials! Please try again.', 'error');
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEYS.isLoggedIn);
        hideDashboard();
        showMessage('Logged out successfully!', 'success');
    });

    // Initialize tabs
    initializeTabs();
}

function showDashboard() {
    document.getElementById('adminDashboard').classList.remove('hidden');
    loadDashboardData();
}

function hideDashboard() {
    document.getElementById('adminDashboard').classList.add('hidden');
}

function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to current
            btn.classList.add('active');
            document.getElementById(targetTab + '-tab').classList.add('active');
            
            // Load specific tab data
            loadTabData(targetTab);
        });
    });
}

function loadDashboardData() {
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.profile));
    const content = JSON.parse(localStorage.getItem(STORAGE_KEYS.content));
    const social = JSON.parse(localStorage.getItem(STORAGE_KEYS.social));

    // Load profile data
    document.getElementById('editName').value = profile.name;
    document.getElementById('editTitle').value = profile.title;
    document.getElementById('editLocation').value = profile.location;
    document.getElementById('editEducation').value = profile.education;
    document.getElementById('editPhoto').value = profile.photo;
    document.getElementById('editBio').value = profile.bio;

    // Load content data
    document.getElementById('editAbout').value = content.about;
    document.getElementById('yearsInTech').value = content.stats.yearsInTech;
    document.getElementById('projectsCount').value = content.stats.projects;
    document.getElementById('leetcodeCount').value = content.stats.leetcode;

    // Load social data
    document.getElementById('instagramUrl').value = social.instagram;
    document.getElementById('facebookUrl').value = social.facebook;
    document.getElementById('githubUrl').value = social.github;
    document.getElementById('leetcodeUrl').value = social.leetcode;
    document.getElementById('whatsappUrl').value = social.whatsapp;
    document.getElementById('emailUrl').value = social.email;
}

function loadTabData(tab) {
    switch (tab) {
        case 'projects':
            loadProjectsTab();
            break;
        case 'skills':
            loadSkillsTab();
            break;
        case 'hobbies':
            loadHobbiesTab();
            break;
        case 'achievements':
            loadAchievementsTab();
            break;
    }
}

function loadProjectsTab() {
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.projects)) || [];
    const projectsList = document.getElementById('projectsList');
    
    projectsList.innerHTML = projects.map((project, index) => `
        <div class="project-item">
            <div>
                <h4>${project.title}</h4>
                <p>${project.description}</p>
                <small>Tech: ${project.tech.join(', ')}</small>
            </div>
            <div class="item-actions">
                <button class="btn btn-small btn-edit" onclick="editProject(${index})">Edit</button>
                <button class="btn btn-small btn-delete" onclick="deleteProject(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

function loadSkillsTab() {
    const skills = JSON.parse(localStorage.getItem(STORAGE_KEYS.skills)) || [];
    const skillCategories = document.getElementById('skillCategories');
    
    skillCategories.innerHTML = skills.map((category, catIndex) => `
        <div class="skill-category-admin">
            <h4>${category.name}</h4>
            ${category.skills.map((skill, skillIndex) => `
                <div class="skill-item-admin">
                    <div>
                        <strong>${skill.name}</strong> - ${skill.level}%
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-small btn-edit" onclick="editSkill(${catIndex}, ${skillIndex})">Edit</button>
                        <button class="btn btn-small btn-delete" onclick="deleteSkill(${catIndex}, ${skillIndex})">Delete</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

function loadHobbiesTab() {
    const hobbies = JSON.parse(localStorage.getItem(STORAGE_KEYS.hobbies));
    const hobbiesList = document.getElementById('hobbiesList');
    
    hobbiesList.innerHTML = hobbies.map((hobby, index) => `
        <div class="hobby-item">
            <div>
                <h4>${hobby.icon} ${hobby.name}</h4>
                <p>${hobby.description}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-small btn-edit" onclick="editHobby(${index})">Edit</button>
                <button class="btn btn-small btn-delete" onclick="deleteHobby(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

function loadAchievementsTab() {
    const achievements = JSON.parse(localStorage.getItem(STORAGE_KEYS.achievements));
    const achievementsList = document.getElementById('achievementsList');
    
    achievementsList.innerHTML = achievements.map((achievement, index) => `
        <div class="achievement-item">
            <div>
                <h4>${achievement.title} (${achievement.date})</h4>
                <p>${achievement.description}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-small btn-edit" onclick="editAchievement(${index})">Edit</button>
                <button class="btn btn-small btn-delete" onclick="deleteAchievement(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Save Functions
function saveProfile() {
    const profileData = {
        name: document.getElementById('editName').value,
        title: document.getElementById('editTitle').value,
        location: document.getElementById('editLocation').value,
        education: document.getElementById('editEducation').value,
        photo: document.getElementById('editPhoto').value,
        bio: document.getElementById('editBio').value,
        resumeUrl: '' // Will be handled by file upload
    };
    
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profileData));
    updatePortfolioDisplay();
    showMessage('Profile updated successfully!', 'success');
}

function saveContent() {
    const contentData = {
        about: document.getElementById('editAbout').value,
        stats: {
            yearsInTech: parseInt(document.getElementById('yearsInTech').value),
            projects: parseInt(document.getElementById('projectsCount').value),
            leetcode: parseInt(document.getElementById('leetcodeCount').value)
        }
    };
    
    localStorage.setItem(STORAGE_KEYS.content, JSON.stringify(contentData));
    updatePortfolioDisplay();
    showMessage('Content updated successfully!', 'success');
}

function saveSocial() {
    const socialData = {
        instagram: document.getElementById('instagramUrl').value,
        facebook: document.getElementById('facebookUrl').value,
        github: document.getElementById('githubUrl').value,
        leetcode: document.getElementById('leetcodeUrl').value,
        whatsapp: document.getElementById('whatsappUrl').value,
        email: document.getElementById('emailUrl').value
    };
    
    localStorage.setItem(STORAGE_KEYS.social, JSON.stringify(socialData));
    updateSocialLinks();
    showMessage('Social links updated successfully!', 'success');
}

// Add Functions
function addNewProject() {
    const title = prompt('Project Title:');
    const description = prompt('Project Description:');
    const tech = prompt('Technologies (comma separated):').split(',').map(t => t.trim());
    const liveUrl = prompt('Live Demo URL:') || '#';
    const githubUrl = prompt('GitHub URL:') || '#';
    
    if (title && description) {
        const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.projects)) || [];
        projects.push({
            title,
            description,
            tech,
            liveUrl,
            githubUrl,
            icon: '🚀'
        });
        
        localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
        loadProjectsTab();
        showMessage('Project added successfully!', 'success');
    }
}

function addNewSkill() {
    const category = prompt('Skill Category:');
    const skillName = prompt('Skill Name:');
    const level = parseInt(prompt('Skill Level (0-100):'));
    
    if (category && skillName && level) {
        const skills = JSON.parse(localStorage.getItem(STORAGE_KEYS.skills)) || [];
        let categoryIndex = skills.findIndex(cat => cat.name === category);
        
        if (categoryIndex === -1) {
            skills.push({
                name: category,
                skills: []
            });
            categoryIndex = skills.length - 1;
        }
        
        skills[categoryIndex].skills.push({
            name: skillName,
            level: level
        });
        
        localStorage.setItem(STORAGE_KEYS.skills, JSON.stringify(skills));
        loadSkillsTab();
        showMessage('Skill added successfully!', 'success');
    }
}

function addHobby() {
    const name = document.getElementById('newHobby').value;
    const icon = document.getElementById('newHobbyIcon').value;
    const description = prompt('Hobby Description:');
    
    if (name && icon && description) {
        const hobbies = JSON.parse(localStorage.getItem(STORAGE_KEYS.hobbies));
        hobbies.push({ icon, name, description });
        
        localStorage.setItem(STORAGE_KEYS.hobbies, JSON.stringify(hobbies));
        loadHobbiesTab();
        
        document.getElementById('newHobby').value = '';
        document.getElementById('newHobbyIcon').value = '';
        showMessage('Hobby added successfully!', 'success');
    }
}

function addAchievement() {
    const title = document.getElementById('newAchievement').value;
    const description = document.getElementById('newAchievementDesc').value;
    const date = document.getElementById('newAchievementDate').value;
    
    if (title && description && date) {
        const achievements = JSON.parse(localStorage.getItem(STORAGE_KEYS.achievements));
        achievements.push({ title, description, date });
        
        localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(achievements));
        loadAchievementsTab();
        
        document.getElementById('newAchievement').value = '';
        document.getElementById('newAchievementDesc').value = '';
        document.getElementById('newAchievementDate').value = '';
        showMessage('Achievement added successfully!', 'success');
    }
}

// Delete Functions
function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.projects));
        projects.splice(index, 1);
        localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
        loadProjectsTab();
        showMessage('Project deleted successfully!', 'success');
    }
}

function deleteHobby(index) {
    if (confirm('Are you sure you want to delete this hobby?')) {
        const hobbies = JSON.parse(localStorage.getItem(STORAGE_KEYS.hobbies));
        hobbies.splice(index, 1);
        localStorage.setItem(STORAGE_KEYS.hobbies, JSON.stringify(hobbies));
        loadHobbiesTab();
        showMessage('Hobby deleted successfully!', 'success');
    }
}

function deleteAchievement(index) {
    if (confirm('Are you sure you want to delete this achievement?')) {
        const achievements = JSON.parse(localStorage.getItem(STORAGE_KEYS.achievements));
        achievements.splice(index, 1);
        localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(achievements));
        loadAchievementsTab();
        showMessage('Achievement deleted successfully!', 'success');
    }
}

// Update Portfolio Display
function updatePortfolioDisplay() {
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.profile));
    const content = JSON.parse(localStorage.getItem(STORAGE_KEYS.content));
    
    // Update name and title
    if (document.querySelector('.name')) {
        document.querySelector('.name').textContent = profile.name.toUpperCase();
    }
    if (document.querySelector('.title')) {
        document.querySelector('.title').textContent = profile.title;
    }
    if (document.querySelector('.description')) {
        document.querySelector('.description').innerHTML = profile.bio;
    }
    
    // Update profile card
    if (document.querySelector('.profile-card h3')) {
        document.querySelector('.profile-card h3').textContent = profile.name;
    }
    if (document.querySelector('.profile-location')) {
        document.querySelector('.profile-location').textContent = `📍 From ${profile.location}`;
    }
    if (document.querySelector('.profile-status')) {
        document.querySelector('.profile-status').textContent = `🎓 ${profile.education}`;
    }
    
    // Update stats
    const stats = document.querySelectorAll('.stat-number');
    if (stats[0]) stats[0].textContent = content.stats.yearsInTech;
    if (stats[1]) stats[1].textContent = content.stats.projects + '+';
    if (stats[2]) stats[2].textContent = content.stats.leetcode + '+';
    
    // Update about text
    const aboutText = document.querySelector('.about-text p');
    if (aboutText) {
        aboutText.textContent = content.about;
    }
    
    // Update profile photo if provided
    if (profile.photo) {
        const avatar = document.querySelector('.profile-avatar');
        if (avatar) {
            avatar.innerHTML = `<img src="${profile.photo}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        }
    }
}

function updateSocialLinks() {
    const social = JSON.parse(localStorage.getItem(STORAGE_KEYS.social));
    
    // Update social navigation links
    const socialLinks = {
        'instagram': social.instagram,
        'facebook': social.facebook,
        'github': social.github,
        'leetcode': social.leetcode,
        'whatsapp': social.whatsapp,
        'gmail': `mailto:${social.email}`
    };
    
    Object.keys(socialLinks).forEach(platform => {
        const link = document.querySelector(`.social-link.${platform}`);
        if (link) {
            link.href = socialLinks[platform];
        }
    });
    
    // Update contact section
    const contactLinks = document.querySelectorAll('.contact-item');
    if (contactLinks[0]) contactLinks[0].href = `mailto:${social.email}`;
    if (contactLinks[0] && contactLinks[0].querySelector('span')) {
        contactLinks[0].querySelector('span').textContent = social.email;
    }
}

function loadPortfolioData() {
    updatePortfolioDisplay();
    updateSocialLinks();
}

// Message System
function showMessage(text, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    const dashboardContent = document.querySelector('.dashboard-content');
    if (dashboardContent) {
        dashboardContent.insertBefore(message, dashboardContent.firstChild);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
}

// File Upload Handler
document.addEventListener('DOMContentLoaded', function() {
    const resumeUpload = document.getElementById('resumeUpload');
    if (resumeUpload) {
        resumeUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type === 'application/pdf') {
                // In a real implementation, you would upload this to a server
                // For now, we'll just show a success message
                showMessage('Resume uploaded successfully! (Note: In production, this would upload to a server)', 'success');
                
                // Update the display text
                const small = resumeUpload.parentNode.querySelector('small');
                if (small) {
                    small.textContent = `Current: ${file.name}`;
                }
            } else {
                showMessage('Please select a valid PDF file.', 'error');
            }
        });
    }
});

// Additional Admin Features
function previewChanges() {
    showMessage('Preview mode activated! Check your portfolio to see the changes.', 'info');
    updatePortfolioDisplay();
    updateSocialLinks();
}

function exportData() {
    const allData = {
        profile: JSON.parse(localStorage.getItem(STORAGE_KEYS.profile)),
        content: JSON.parse(localStorage.getItem(STORAGE_KEYS.content)),
        projects: JSON.parse(localStorage.getItem(STORAGE_KEYS.projects)),
        skills: JSON.parse(localStorage.getItem(STORAGE_KEYS.skills)),
        social: JSON.parse(localStorage.getItem(STORAGE_KEYS.social)),
        hobbies: JSON.parse(localStorage.getItem(STORAGE_KEYS.hobbies)),
        achievements: JSON.parse(localStorage.getItem(STORAGE_KEYS.achievements))
    };
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-backup.json';
    link.click();
    
    URL.revokeObjectURL(url);
    showMessage('Portfolio data exported successfully!', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validate and import data
                    Object.keys(data).forEach(key => {
                        if (STORAGE_KEYS[key]) {
                            localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data[key]));
                        }
                    });
                    
                    // Reload dashboard and portfolio
                    loadDashboardData();
                    updatePortfolioDisplay();
                    updateSocialLinks();
                    
                    showMessage('Portfolio data imported successfully!', 'success');
                } catch (error) {
                    showMessage('Error importing data. Please check the file format.', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

function resetToDefaults() {
    if (confirm('Are you sure you want to reset all data to defaults? This cannot be undone!')) {
        // Clear all data
        Object.values(STORAGE_KEYS).forEach(key => {
            if (key !== STORAGE_KEYS.isLoggedIn) {
                localStorage.removeItem(key);
            }
        });
        
        // Reinitialize with defaults
        initializeData();
        loadDashboardData();
        updatePortfolioDisplay();
        updateSocialLinks();
        
        showMessage('Portfolio reset to default values!', 'success');
    }
}

// Edit Functions (for inline editing)
function editProject(index) {
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.projects));
    const project = projects[index];
    
    const title = prompt('Project Title:', project.title);
    const description = prompt('Project Description:', project.description);
    const tech = prompt('Technologies (comma separated):', project.tech.join(', '));
    
    if (title && description && tech) {
        projects[index] = {
            ...project,
            title,
            description,
            tech: tech.split(',').map(t => t.trim())
        };
        
        localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
        loadProjectsTab();
        showMessage('Project updated successfully!', 'success');
    }
}

function editSkill(catIndex, skillIndex) {
    const skills = JSON.parse(localStorage.getItem(STORAGE_KEYS.skills));
    const skill = skills[catIndex].skills[skillIndex];
    
    const name = prompt('Skill Name:', skill.name);
    const level = parseInt(prompt('Skill Level (0-100):', skill.level));
    
    if (name && level) {
        skills[catIndex].skills[skillIndex] = { name, level };
        
        localStorage.setItem(STORAGE_KEYS.skills, JSON.stringify(skills));
        loadSkillsTab();
        showMessage('Skill updated successfully!', 'success');
    }
}

function deleteSkill(catIndex, skillIndex) {
    if (confirm('Are you sure you want to delete this skill?')) {
        const skills = JSON.parse(localStorage.getItem(STORAGE_KEYS.skills));
        skills[catIndex].skills.splice(skillIndex, 1);
        
        // Remove category if empty
        if (skills[catIndex].skills.length === 0) {
            skills.splice(catIndex, 1);
        }
        
        localStorage.setItem(STORAGE_KEYS.skills, JSON.stringify(skills));
        loadSkillsTab();
        showMessage('Skill deleted successfully!', 'success');
    }
}

function editHobby(index) {
    const hobbies = JSON.parse(localStorage.getItem(STORAGE_KEYS.hobbies));
    const hobby = hobbies[index];
    
    const name = prompt('Hobby Name:', hobby.name);
    const icon = prompt('Hobby Icon:', hobby.icon);
    const description = prompt('Hobby Description:', hobby.description);
    
    if (name && icon && description) {
        hobbies[index] = { name, icon, description };
        
        localStorage.setItem(STORAGE_KEYS.hobbies, JSON.stringify(hobbies));
        loadHobbiesTab();
        showMessage('Hobby updated successfully!', 'success');
    }
}

function editAchievement(index) {
    const achievements = JSON.parse(localStorage.getItem(STORAGE_KEYS.achievements));
    const achievement = achievements[index];
    
    const title = prompt('Achievement Title:', achievement.title);
    const description = prompt('Achievement Description:', achievement.description);
    const date = prompt('Achievement Date:', achievement.date);
    
    if (title && description && date) {
        achievements[index] = { title, description, date };
        
        localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(achievements));
        loadAchievementsTab();
        showMessage('Achievement updated successfully!', 'success');
    }
}

// Enhanced particle system for admin interactions
function createParticlesBurst(x, y) {
    const colors = ['#007acc', '#00d9ff', '#ff6b6b', '#4ecdc4', '#45b7d1'];
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 15;
        const velocity = 2 + Math.random() * 3;
        
        let posX = 0;
        let posY = 0;
        let opacity = 1;
        
        const animate = () => {
            posX += Math.cos(angle) * velocity;
            posY += Math.sin(angle) * velocity;
            opacity -= 0.02;
            
            particle.style.transform = `translate(${posX}px, ${posY}px)`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }
}

// Initialize default skills if not present
function initializeDefaultSkills() {
    if (!localStorage.getItem(STORAGE_KEYS.skills)) {
        const defaultSkills = [
            {
                name: "Programming Languages",
                skills: [
                    { name: "JavaScript", level: 90 },
                    { name: "Python", level: 85 },
                    { name: "Java", level: 80 },
                    { name: "C++", level: 75 }
                ]
            },
            {
                name: "Web Technologies",
                skills: [
                    { name: "HTML5", level: 95 },
                    { name: "CSS3", level: 90 },
                    { name: "React", level: 85 },
                    { name: "Node.js", level: 80 }
                ]
            },
            {
                name: "Tools & Frameworks",
                skills: [
                    { name: "Git", level: 90 },
                    { name: "VS Code", level: 95 },
                    { name: "MongoDB", level: 75 },
                    { name: "Express.js", level: 80 }
                ]
            }
        ];
        
        localStorage.setItem(STORAGE_KEYS.skills, JSON.stringify(defaultSkills));
    }
}

// Initialize default projects if not present
function initializeDefaultProjects() {
    if (!localStorage.getItem(STORAGE_KEYS.projects)) {
        const defaultProjects = [
            {
                title: "E-Commerce Platform",
                description: "Full-stack e-commerce application with React frontend and Node.js backend, featuring user authentication, payment integration, and admin dashboard",
                tech: ["React", "Node.js", "MongoDB", "Stripe"],
                liveUrl: "#",
                githubUrl: "#",
                icon: "🌐"
            },
            {
                title: "Kiitians Finder",
                description: "A comprehensive student directory platform for KIIT University that allows searching student details by roll number, accessing contact information, email, course details, and academic information. Built specifically for the KIIT community.",
                tech: ["React", "Node.js", "MongoDB", "Express.js"],
                liveUrl: "https://kiit.pages.dev",
                githubUrl: "https://github.com/ritesh-chauhan0x1/kiitians-finder",
                icon: "�",
                featured: true
            },
            {
                title: "Task Management App",
                description: "Responsive task management application with real-time updates, drag-and-drop functionality, and team collaboration features",
                tech: ["Vue.js", "Express", "Socket.io", "PostgreSQL"],
                liveUrl: "#",
                githubUrl: "#",
                icon: "�"
            },
            {
                title: "Data Visualization Dashboard",
                description: "Interactive dashboard for data analysis and visualization with real-time charts, filters, and export functionality",
                tech: ["D3.js", "React", "Python", "Pandas"],
                liveUrl: "#",
                githubUrl: "#",
                icon: "📊"
            },
            {
                title: "Blockchain Voting System",
                description: "Secure voting system built on blockchain technology ensuring transparency and immutability of votes",
                tech: ["Solidity", "Web3.js", "React", "Ethereum"],
                liveUrl: "#",
                githubUrl: "#",
                icon: "🔐"
            },
            {
                title: "Interactive Portfolio",
                description: "This very portfolio you're viewing! Built with modern web technologies and featuring smooth animations and responsive design",
                tech: ["HTML5", "CSS3", "JavaScript", "Animations"],
                liveUrl: "#",
                githubUrl: "#",
                icon: "�"
            }
        ];
        
        localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(defaultProjects));
    }
}

// Enhanced initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultSkills();
    initializeDefaultProjects();
});

// Theme System
const themeIcons = document.querySelectorAll('.theme-icon');
const body = document.body;

themeIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        const theme = this.dataset.theme;
        
        // Remove active class from all icons
        themeIcons.forEach(i => i.classList.remove('active'));
        // Add active class to clicked icon
        this.classList.add('active');
        
        // Remove all theme classes
        body.classList.remove('theme-dark', 'theme-neon', 'theme-ocean', 'theme-sunset');
        
        // Add new theme class (except for default)
        if (theme !== 'default') {
            body.classList.add(`theme-${theme}`);
        }

        // Add click animation
        this.style.transform = 'scale(0.8)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);

        // Trigger particles burst
        createParticlesBurst(
            this.getBoundingClientRect().left + 25,
            this.getBoundingClientRect().top + 25
        );
        
        // Save theme preference
        localStorage.setItem('portfolioTheme', theme);
    });

    // Hover effect
    icon.addEventListener('mouseenter', function() {
        createHoverParticles(this);
    });
});

// Load saved theme
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('portfolioTheme');
    if (savedTheme) {
        const themeIcon = document.querySelector(`[data-theme="${savedTheme}"]`);
        if (themeIcon) {
            themeIcon.click();
        }
    } else {
        // Set ocean theme as default
        const oceanTheme = document.querySelector('[data-theme="ocean"]');
        if (oceanTheme) {
            oceanTheme.click();
        }
    }
});

// Social Media Links Interactions
const socialLinks = document.querySelectorAll('.social-link');

socialLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
        createHoverParticles(this);
        this.style.boxShadow = '0 0 20px var(--accent)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
    
    link.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        createParticlesBurst(centerX, centerY);
        
        this.style.transform = 'translateY(-5px) scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// Smooth Scrolling for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Cursor Glow Effect - Disabled for cleaner look
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow) {
    cursorGlow.style.display = 'none';
}

// Dynamic Particles System - Simplified
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    // Reduce particle count significantly
    const particleCount = window.innerWidth < 768 ? 3 : 6;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 6 + 8) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Particles Burst Effect - Simplified
function createParticlesBurst(x, y) {
    const burstCount = 6; // Reduced from 12
    
    for (let i = 0; i < burstCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.background = 'var(--accent)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1001';
        
        const angle = (i / burstCount) * Math.PI * 2;
        const velocity = 50 + Math.random() * 25; // Reduced velocity
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        document.body.appendChild(particle);
        
        let particleX = x;
        let particleY = y;
        let opacity = 1;
        
        function animateParticle() {
            particleX += vx * 0.015; // Slower movement
            particleY += vy * 0.015;
            opacity -= 0.03; // Faster fade
            
            particle.style.left = particleX + 'px';
            particle.style.top = particleY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        }
        
        animateParticle();
    }
}

// Hover Particles - Disabled for cleaner experience
function createHoverParticles(element) {
    // Disabled to reduce visual clutter
    return;
}

// Parallax Effect for Geometric Shapes - Disabled for cleaner look
// document.addEventListener('mousemove', (e) => {
//     const shapes = document.querySelectorAll('.shape');
//     const x = e.clientX / window.innerWidth;
//     const y = e.clientY / window.innerHeight;
//     
//     shapes.forEach((shape, index) => {
//         const speed = (index + 1) * 0.5;
//         const moveX = (x - 0.5) * speed * 50;
//         const moveY = (y - 0.5) * speed * 50;
//         
//         shape.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${index * 90}deg)`;
//     });
// });

// Scroll Reveal Animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Skill Progress Animation
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const width = bar.dataset.width;
            if (width && !bar.classList.contains('animated')) {
                bar.style.width = width + '%';
                bar.classList.add('animated');
            }
        }
    });
}

window.addEventListener('scroll', animateSkills);

// Resume Download Functionality
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadResume');
    const viewBtn = document.getElementById('viewResume');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create a mock PDF download (you would replace this with actual resume URL)
            const link = document.createElement('a');
            link.href = '#'; // Replace with actual resume PDF URL
            link.download = 'Ritesh_Chauhan_Resume.pdf';
            
            // Show download animation
            this.innerHTML = '⬇️ Downloading...';
            this.style.background = 'var(--accent-secondary)';
            
            setTimeout(() => {
                this.innerHTML = '📥 Download PDF';
                this.style.background = '';
                
                // Here you would trigger the actual download
                alert('Resume download would start here! Please add your actual resume PDF URL.');
            }, 1500);
            
            createParticlesBurst(
                this.getBoundingClientRect().left + this.offsetWidth / 2,
                this.getBoundingClientRect().top + this.offsetHeight / 2
            );
        });
    }
    
    if (viewBtn) {
        viewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // You can implement resume viewer here
            alert('Resume viewer would open here! You can implement a modal or redirect to resume page.');
        });
    }
});

// Text Animation on Click
const nameElement = document.querySelector('.name');
if (nameElement) {
    nameElement.addEventListener('click', function() {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'glow 0.5s ease-in-out';
        }, 10);
        
        createParticlesBurst(
            window.innerWidth / 2, 
            this.getBoundingClientRect().top + this.offsetHeight / 2
        );
    });
}

// Navigation Active State
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavigation);

// Project Card Interactions
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        createHoverParticles(this);
    });
    
    card.addEventListener('click', function() {
        const rect = this.getBoundingClientRect();
        createParticlesBurst(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
        );
    });
});

// Contact Form Enhancement (if you add a contact form later)
function enhanceContactForm() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            createHoverParticles(this);
        });
        
        item.addEventListener('click', function() {
            const rect = this.getBoundingClientRect();
            createParticlesBurst(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2
            );
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    revealOnScroll();
    animateSkills();
    enhanceContactForm();
    
    // Set default active navigation
    updateActiveNavigation();
    
    // Add loading screen fadeout
    setTimeout(() => {
        const loading = document.querySelector('.loading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 1000);
        }
    }, 2000);
});

// Performance optimization for mobile
if (window.innerWidth < 768) {
    // Reduce particles on mobile
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        if (index > 10) particle.remove();
    });
    
    // Disable some animations on mobile for better performance
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach(shape => {
        shape.style.animation = 'none';
    });
}

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        // Add visual focus indicators
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Easter Egg: Konami Code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((key, index) => key === konamiSequence[index])) {
        
        // Easter egg animation
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
        
        alert('🎉 Easter egg found! You discovered the Konami code!');
        konamiCode = [];
    }
});

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }
`;
document.head.appendChild(style);
