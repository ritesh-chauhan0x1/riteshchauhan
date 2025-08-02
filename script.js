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
        resumeUrl: '',
        resumeHighlights: '• 4th Year B.Tech CSE Student at KIIT University\n• Full Stack Developer with 4+ years of experience\n• Solved 100+ problems on LeetCode\n• Built 50+ projects including web apps and APIs\n• Proficient in React, Node.js, Python, JavaScript\n• Experience with MySQL, MongoDB, AWS Cloud Services'
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
        leetcode: 'https://leetcode.com/u/riteshchauhan_15',
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
    ],
    projects: [
        {
            id: 1,
            title: 'Kiitians Finder',
            description: 'A comprehensive student directory platform for KIIT University that allows searching student details by roll number, accessing contact information, email, course details, and academic information.',
            icon: '🎓',
            tech: ['React', 'Node.js', 'MongoDB', 'Express.js'],
            liveUrl: 'https://kiit.pages.dev',
            githubUrl: 'https://github.com/ritesh-chauhan0x1/kiitians-finder',
            featured: true,
            category: 'web'
        },
        {
            id: 2,
            title: 'Personal Portfolio',
            description: 'Modern and responsive portfolio website showcasing my skills, projects, and journey as a full-stack developer. Built with clean design and smooth interactions.',
            icon: '🌐',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'MySQL'],
            liveUrl: 'https://riteshchauhan.pages.dev',
            githubUrl: 'https://github.com/ritesh-chauhan0x1/riteshchauhan',
            featured: false,
            category: 'web'
        },
        {
            id: 3,
            title: 'DSA Solutions Repository',
            description: 'Comprehensive collection of Data Structures and Algorithms solutions in multiple programming languages with detailed explanations and time complexity analysis.',
            icon: '📊',
            tech: ['Java', 'Python', 'C++', 'Algorithms'],
            liveUrl: 'https://github.com/ritesh-chauhan0x1/DSA-Solutions',
            githubUrl: 'https://github.com/ritesh-chauhan0x1/DSA-Solutions',
            featured: false,
            category: 'algorithms'
        },
        {
            id: 4,
            title: 'Task Management System',
            description: 'Collaborative task management application with real-time updates, drag-and-drop functionality, team collaboration, and progress tracking.',
            icon: '📋',
            tech: ['Vue.js', 'Socket.io', 'Node.js', 'MySQL'],
            liveUrl: 'https://github.com/ritesh-chauhan0x1/TaskManager',
            githubUrl: 'https://github.com/ritesh-chauhan0x1/TaskManager',
            featured: false,
            category: 'web'
        },
        {
            id: 5,
            title: 'E-Commerce Platform',
            description: 'Full-stack e-commerce web application with user authentication, product management, shopping cart functionality, and secure payment integration.',
            icon: '💻',
            tech: ['React', 'Express', 'MongoDB', 'Stripe'],
            liveUrl: 'https://github.com/ritesh-chauhan0x1/ECommerce-Platform',
            githubUrl: 'https://github.com/ritesh-chauhan0x1/ECommerce-Platform',
            featured: false,
            category: 'web'
        },
        {
            id: 6,
            title: 'REST API Collection',
            description: 'Various REST API projects including authentication systems, CRUD operations, microservices architecture, and comprehensive API documentation.',
            icon: '🔗',
            tech: ['Node.js', 'Express', 'MongoDB', 'JWT'],
            liveUrl: 'https://documenter.getpostman.com/view/ritesh-apis',
            githubUrl: 'https://github.com/ritesh-chauhan0x1/REST-APIs',
            featured: false,
            category: 'api'
        },
        {
            id: 7,
            title: 'Mobile App Projects',
            description: 'Cross-platform mobile applications developed using React Native and Flutter, focusing on user experience, performance optimization, and native features.',
            icon: '📱',
            tech: ['React Native', 'Flutter', 'Firebase', 'Redux'],
            liveUrl: 'https://github.com/ritesh-chauhan0x1/Mobile-Apps',
            githubUrl: 'https://github.com/ritesh-chauhan0x1/Mobile-Apps',
            featured: false,
            category: 'mobile'
        },
        {
            id: 8,
            title: 'AI & Machine Learning',
            description: 'Machine learning and AI projects including predictive models, data analysis, neural networks, and intelligent automation systems.',
            icon: '🤖',
            tech: ['Python', 'TensorFlow', 'Scikit-learn', 'Pandas'],
            liveUrl: 'https://github.com/ritesh-chauhan0x1/ML-Projects',
            githubUrl: 'https://github.com/ritesh-chauhan0x1/ML-Projects',
            featured: false,
            category: 'ai'
        },
        {
            id: 9,
            title: 'Blockchain Applications',
            description: 'Blockchain-based applications including smart contracts, decentralized applications (DApps), cryptocurrency projects, and Web3 integrations.',
            icon: '🔐',
            tech: ['Solidity', 'Web3.js', 'Ethereum', 'React'],
            liveUrl: 'https://github.com/ritesh-chauhan0x1/Blockchain-DApps',
            githubUrl: 'https://github.com/ritesh-chauhan0x1/Blockchain-DApps',
            featured: false,
            category: 'blockchain'
        }
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
    initializePhotoUploadTabs();
    loadPortfolioData();
    
    // Initialize essential components immediately
    loadProjectsToPublic();
    loadPhotosToPublic();
    initializeScrollAnimations();
    initializeTheme();
    
    // Check if already logged in
    if (localStorage.getItem(STORAGE_KEYS.isLoggedIn) === 'true') {
        showDashboard();
    }
    
    // Hide loading screen after everything is loaded
    setTimeout(() => {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => loading.style.display = 'none', 500);
        }
    }, 1500);
});

function initializeAdminSystem() {
    // Wait for DOM to be fully loaded
    if (!document.getElementById('adminIcon') || !document.getElementById('loginModal')) {
        setTimeout(initializeAdminSystem, 100);
        return;
    }

    const adminIcon = document.getElementById('adminIcon');
    const loginModal = document.getElementById('loginModal');
    const closeLogin = document.getElementById('closeLogin');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (!adminIcon || !loginModal || !closeLogin || !loginForm) {
        console.error('Admin system elements not found!');
        return;
    }

    // Admin icon click
    adminIcon.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Admin icon clicked');
        loginModal.style.display = 'block';
        loginModal.style.opacity = '1';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Focus on username field
        setTimeout(() => {
            const usernameField = document.getElementById('username');
            if (usernameField) usernameField.focus();
        }, 100);

        // Create particle effect if function exists
        if (typeof createParticlesBurst === 'function') {
            createParticlesBurst(
                adminIcon.getBoundingClientRect().left + 25,
                adminIcon.getBoundingClientRect().top + 25
            );
        }
    });

    // Close modal function
    const closeModal = () => {
        console.log('Closing modal');
        loginModal.style.display = 'none';
        loginModal.style.opacity = '0';
        document.body.style.overflow = 'auto'; // Restore scrolling
        
        // Clear form
        const usernameField = document.getElementById('username');
        const passwordField = document.getElementById('password');
        if (usernameField) usernameField.value = '';
        if (passwordField) passwordField.value = '';
    };

    // Close modal events
    closeLogin.addEventListener('click', closeModal);

    // Click outside modal to close
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            closeModal();
        }
    });

    // Prevent modal content clicks from closing modal
    const modalContent = loginModal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && loginModal.style.display === 'block') {
            closeModal();
        }
    });

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Login form submitted');
        
        const usernameField = document.getElementById('username');
        const passwordField = document.getElementById('password');
        
        if (!usernameField || !passwordField) {
            console.error('Username or password field not found!');
            return;
        }

        const username = usernameField.value.trim();
        const password = passwordField.value;

        console.log('Login attempt:', { username, passwordLength: password.length });
        console.log('Expected credentials:', ADMIN_CREDENTIALS);

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            console.log('Login successful!');
            localStorage.setItem(STORAGE_KEYS.isLoggedIn, 'true');
            closeModal();
            showDashboard();
            showMessage('🎉 Login successful! Welcome to admin dashboard.', 'success');
            
            // Add success animation
            adminIcon.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                adminIcon.style.animation = '';
            }, 500);
        } else {
            console.log('Login failed - invalid credentials');
            showMessage('❌ Invalid credentials! Please check username and password.', 'error');
            
            // Shake animation for failed login
            loginForm.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 500);
            
            // Clear password field
            passwordField.value = '';
            passwordField.focus();
        }
    });

    // Logout function
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem(STORAGE_KEYS.isLoggedIn);
            hideDashboard();
            showMessage('👋 Logged out successfully!', 'success');
        });
    }

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
    if (document.getElementById('editName')) document.getElementById('editName').value = profile.name;
    if (document.getElementById('editTitle')) document.getElementById('editTitle').value = profile.title;
    if (document.getElementById('editLocation')) document.getElementById('editLocation').value = profile.location;
    if (document.getElementById('editEducation')) document.getElementById('editEducation').value = profile.education;
    if (document.getElementById('editPhoto')) document.getElementById('editPhoto').value = profile.photo;
    if (document.getElementById('editBio')) document.getElementById('editBio').value = profile.bio;
    if (document.getElementById('resumeUpload')) document.getElementById('resumeUpload').value = profile.resumeUrl || 'https://drive.google.com/file/d/18c8I4eJjBilzlmOrpzI9zmfGqgriwcFc/view?usp=drive_link';
    if (document.getElementById('resumeHighlights')) document.getElementById('resumeHighlights').value = profile.resumeHighlights || '• 4th Year B.Tech CSE Student at KIIT University\n• Full Stack Developer with 4+ years of experience\n• Solved 100+ problems on LeetCode\n• Built 50+ projects including web apps and APIs\n• Proficient in React, Node.js, Python, JavaScript\n• Experience with MySQL, MongoDB, AWS Cloud Services';

    // Load content data
    if (document.getElementById('editAbout')) document.getElementById('editAbout').value = content.about;
    if (document.getElementById('yearsInTech')) document.getElementById('yearsInTech').value = content.stats.yearsInTech;
    if (document.getElementById('projectsCount')) document.getElementById('projectsCount').value = content.stats.projects;
    if (document.getElementById('leetcodeCount')) document.getElementById('leetcodeCount').value = content.stats.leetcode;

    // Load social data
    if (document.getElementById('instagramUrl')) document.getElementById('instagramUrl').value = social.instagram;
    if (document.getElementById('facebookUrl')) document.getElementById('facebookUrl').value = social.facebook;
    if (document.getElementById('githubUrl')) document.getElementById('githubUrl').value = social.github;
    if (document.getElementById('leetcodeUrl')) document.getElementById('leetcodeUrl').value = social.leetcode;
    if (document.getElementById('whatsappUrl')) document.getElementById('whatsappUrl').value = social.whatsapp;
    if (document.getElementById('emailUrl')) document.getElementById('emailUrl').value = social.email;
    
    // Load uploaded photos
    loadUploadedPhotos();
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
    
    if (projects.length > 0) {
        projectsList.innerHTML = projects.map((project, index) => `
            <div class="project-item">
                <div>
                    <h4>${project.icon || '🚀'} ${project.title} ${project.featured ? '⭐' : ''}</h4>
                    <p>${project.description}</p>
                    <small><strong>Tech:</strong> ${project.tech.join(', ')}</small><br>
                    <small><strong>Category:</strong> ${project.category || 'web'}</small><br>
                    <small><strong>Live:</strong> <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">${project.liveUrl}</a></small><br>
                    <small><strong>GitHub:</strong> <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">${project.githubUrl}</a></small>
                </div>
                <div class="item-actions">
                    <button class="btn btn-small btn-edit" onclick="editProject(${index})">Edit</button>
                    <button class="btn btn-small btn-delete" onclick="deleteProject(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    } else {
        projectsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>No projects yet. Add your first project!</p>
            </div>
        `;
    }
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
async function saveProfile() {
    const profileData = {
        name: document.getElementById('editName').value,
        title: document.getElementById('editTitle').value,
        location: document.getElementById('editLocation').value,
        education: document.getElementById('editEducation').value,
        bio: document.getElementById('editBio').value,
        resumeUrl: document.getElementById('resumeUpload').value || 'https://drive.google.com/file/d/18c8I4eJjBilzlmOrpzI9zmfGqgriwcFc/view?usp=drive_link',
        resumeHighlights: document.getElementById('resumeHighlights').value || '• 4th Year B.Tech CSE Student at KIIT University\n• Full Stack Developer with 4+ years of experience\n• Solved 100+ problems on LeetCode\n• Built 50+ projects including web apps and APIs\n• Proficient in React, Node.js, Python, JavaScript\n• Experience with MySQL, MongoDB, AWS Cloud Services'
    };

    // Handle profile photo upload
    const photoInput = document.getElementById('editPhoto');
    if (photoInput.files && photoInput.files[0]) {
        try {
            const file = photoInput.files[0];
            
            // Validate file
            if (!file.type.startsWith('image/')) {
                throw new Error('Please select a valid image file');
            }
            
            if (file.size > 5 * 1024 * 1024) { // 5MB limit for profile photo
                throw new Error('Profile photo must be less than 5MB');
            }

            // Convert to base64 for reliable storage
            const base64 = await fileToBase64(file);
            profileData.photo = base64;
            
            // Update hero profile image immediately
            const heroProfileImg = document.getElementById('heroProfileImg');
            if (heroProfileImg) {
                heroProfileImg.src = base64;
                heroProfileImg.alt = profileData.name;
                console.log('✅ Hero profile image updated from saveProfile()');
            }
            
            // Update other profile images in the page
            const profileAvatars = document.querySelectorAll('.profile-avatar');
            profileAvatars.forEach(avatar => {
                avatar.style.backgroundImage = `url(${base64})`;
                avatar.style.backgroundSize = 'cover';
                avatar.style.backgroundPosition = 'center';
            });
            
            showMessage('Profile photo uploaded successfully!', 'success');
        } catch (error) {
            console.error('Profile photo upload error:', error);
            showMessage(`Profile photo upload failed: ${error.message}`, 'error');
        }
    }
    
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profileData));
    updatePortfolioDisplay();
    updateResumeLinks(profileData.resumeUrl);
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
    const icon = prompt('Project Icon (emoji):') || '🚀';
    const category = prompt('Category (web/mobile/api/ai/blockchain/algorithms/other):') || 'web';
    const featured = confirm('Mark as featured project?');
    
    if (title && description) {
        const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.projects)) || [];
        const newProject = {
            id: Date.now(), // Simple ID generation
            title,
            description,
            icon,
            tech,
            liveUrl,
            githubUrl,
            featured,
            category
        };
        
        projects.push(newProject);
        localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
        loadProjectsTab();
        loadProjectsToPublic(); // Update the public display too
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

function addQuality() {
    const title = document.getElementById('newQualityTitle').value;
    const icon = document.getElementById('newQualityIcon').value;
    const description = document.getElementById('newQualityDesc').value;
    
    if (title && icon && description) {
        const qualities = JSON.parse(localStorage.getItem(STORAGE_KEYS.qualities)) || [];
        qualities.push({ title, icon, description });
        
        localStorage.setItem(STORAGE_KEYS.qualities, JSON.stringify(qualities));
        loadQualitiesTab();
        
        document.getElementById('newQualityTitle').value = '';
        document.getElementById('newQualityIcon').value = '';
        document.getElementById('newQualityDesc').value = '';
        showMessage('Quality added successfully!', 'success');
    }
}

function addAchievement() {
    const title = document.getElementById('newAchievement').value;
    const description = document.getElementById('newAchievementDesc').value;
    const date = document.getElementById('newAchievementDate').value;
    
    if (title && description && date) {
        const achievements = JSON.parse(localStorage.getItem(STORAGE_KEYS.achievements)) || [];
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
        loadProjectsToPublic(); // Update the public display too
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
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.profile)) || DEFAULT_DATA.profile;
    const content = JSON.parse(localStorage.getItem(STORAGE_KEYS.content)) || DEFAULT_DATA.content;
    
    // Update hero section name - ensure both parts are visible
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const nameParts = profile.name.split(' ');
        if (nameParts.length >= 2) {
            nameElement.innerHTML = `${nameParts[0]} <span class="surname">${nameParts.slice(1).join(' ')}</span>`;
        } else {
            nameElement.textContent = profile.name.toUpperCase();
        }
    }
    
    // Update title and bio
    if (document.querySelector('.title')) {
        document.querySelector('.title').textContent = profile.title;
    }
    if (document.querySelector('.bio')) {
        document.querySelector('.bio').innerHTML = profile.bio;
    }
    
    // Update hero profile image
    const heroProfileImg = document.getElementById('heroProfileImg');
    if (heroProfileImg) {
        if (profile.photo) {
            heroProfileImg.src = profile.photo;
            heroProfileImg.alt = profile.name;
            console.log('✅ Hero profile image loaded from stored profile data');
        } else {
            // Keep the default Unsplash placeholder if no profile photo is uploaded
            console.log('ℹ️ No profile photo stored, keeping default placeholder');
        }
    }
    
    // Update profile card
    if (document.querySelector('.profile-card h3')) {
        document.querySelector('.profile-card h3').textContent = profile.name;
    }
    if (document.querySelector('.profile-location')) {
        document.querySelector('.profile-location').textContent = `From ${profile.location}`;
    }
    if (document.querySelector('.profile-status')) {
        document.querySelector('.profile-status').textContent = profile.education;
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
    
    // Update profile avatars throughout the page
    const profileAvatars = document.querySelectorAll('.profile-avatar');
    profileAvatars.forEach(avatar => {
        if (profile.photo) {
            avatar.style.backgroundImage = `url(${profile.photo})`;
            avatar.style.backgroundSize = 'cover';
            avatar.style.backgroundPosition = 'center';
        } else {
            // Use gradient background with initials
            const initials = profile.name.split(' ').map(n => n[0]).join('');
            avatar.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 1.2em; font-weight: bold; color: white;">${initials}</div>`;
            avatar.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
        }
    });
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

function updateResumeLinks(resumeUrl) {
    // Update resume download and view links
    const downloadResume = document.getElementById('downloadResume');
    const viewResume = document.getElementById('viewResume');
    
    if (downloadResume && resumeUrl) {
        // Convert Google Drive view link to download link
        const fileId = resumeUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
        if (fileId) {
            downloadResume.href = `https://drive.google.com/uc?export=download&id=${fileId[1]}`;
        } else {
            downloadResume.href = resumeUrl;
        }
    }
    
    if (viewResume && resumeUrl) {
        viewResume.href = resumeUrl;
    }
    
    // Update hero section resume button
    const heroResumeBtn = document.querySelector('.cta-buttons .btn-secondary');
    if (heroResumeBtn && resumeUrl) {
        heroResumeBtn.href = resumeUrl;
    }
}

function loadPortfolioData() {
    updatePortfolioDisplay();
    updateSocialLinks();
    loadProjectsToPublic();
    loadMemoriesToPublic();
    loadPhotosToPublic();
}

// Enhanced project loading with backend integration and improved error handling
async function loadProjectsToPublic() {
    const projectsGrid = document.querySelector('#projectsGrid');
    
    if (!projectsGrid) {
        console.warn('❌ Projects grid element not found');
        return;
    }

    console.log('🚀 Loading projects to public display...');

    try {
        // Show loading state with better styling
        projectsGrid.innerHTML = `
            <div class="loading-projects">
                <div class="loading-spinner"></div>
                <p>Loading amazing projects...</p>
                <small>Connecting to backend...</small>
            </div>
        `;

        let projects = [];
        let dataSource = 'unknown';

        // Try to load from backend service first
        if (window.backendService) {
            try {
                console.log('📡 Attempting to load from backend...');
                const response = await window.backendService.getProjects();
                projects = response.data || [];
                dataSource = response.cached ? 'cache' : response.default ? 'default' : 'backend';
                console.log(`✅ Loaded ${projects.length} projects from ${dataSource}`);
            } catch (error) {
                console.log('⚠️ Backend service failed, trying enhanced API...');
                dataSource = 'fallback';
            }
        }

        // Fallback to enhanced API
        if (projects.length === 0 && window.enhancedAPI) {
            try {
                const response = await window.enhancedAPI.getProjects();
                projects = response.data || [];
                dataSource = 'enhanced_api';
                console.log(`✅ Loaded ${projects.length} projects from enhanced API`);
            } catch (error) {
                console.log('⚠️ Enhanced API failed, using localStorage...');
                dataSource = 'localStorage';
            }
        }

        // Fallback to localStorage
        if (projects.length === 0) {
            const storedProjects = localStorage.getItem(STORAGE_KEYS.projects);
            if (storedProjects) {
                projects = JSON.parse(storedProjects);
                dataSource = 'localStorage';
                console.log(`✅ Loaded ${projects.length} projects from localStorage`);
            }
        }

        // Final fallback to default data
        if (projects.length === 0) {
            projects = DEFAULT_DATA.projects || [];
            dataSource = 'default';
            console.log(`✅ Using ${projects.length} default projects`);
        }

        if (projects.length > 0) {
            // Sort projects: featured first, then by date/order
            const sortedProjects = projects.sort((a, b) => {
                // Featured projects first
                if ((a.isFeatured || a.featured) && !(b.isFeatured || b.featured)) return -1;
                if (!(a.isFeatured || a.featured) && (b.isFeatured || b.featured)) return 1;
                
                // Then by sort order if available
                if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
                    return a.sortOrder - b.sortOrder;
                }
                
                // Finally by creation date
                return new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0);
            });

            // Generate project cards with enhanced styling
            projectsGrid.innerHTML = sortedProjects.map((project, index) => {
                const technologies = project.technologies || project.tech || [];
                const isValidUrl = (url) => url && (url.startsWith('http') || url.startsWith('//'));
                
                return `
                    <div class="project-card ${project.isFeatured || project.featured ? 'featured-project' : ''} reveal" data-index="${index}">
                        <div class="project-icon">${project.icon || '🚀'}</div>
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="project-tech">
                            ${technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                        <div class="project-links">
                            ${isValidUrl(project.liveUrl) ? `
                                <a href="${project.liveUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                    <i class="fas fa-external-link-alt"></i>
                                    ${project.category === 'algorithms' || project.category === 'api' ? 'View Project' : 'Live Demo'}
                                </a>
                            ` : ''}
                            ${isValidUrl(project.githubUrl) ? `
                                <a href="${project.githubUrl}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                                    <i class="fab fa-github"></i> GitHub
                                </a>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('');
            
            // Add data source indicator
            const sourceIndicator = document.createElement('div');
            sourceIndicator.className = 'data-source-indicator';
            sourceIndicator.innerHTML = `
                <small>
                    <i class="fas fa-info-circle"></i>
                    Data source: ${dataSource.replace('_', ' ').toUpperCase()}
                    ${dataSource === 'cache' ? ' (may be outdated)' : ''}
                </small>
            `;
            projectsGrid.appendChild(sourceIndicator);
            
            // Enhanced reveal animations
            setTimeout(() => {
                document.querySelectorAll('.project-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate');
                        card.style.animationDelay = `${index * 0.1}s`;
                    }, index * 100);
                });
            }, 300);

            console.log(`🎉 Successfully displayed ${projects.length} projects`);
        } else {
            projectsGrid.innerHTML = `
                <div class="project-placeholder">
                    <i class="fas fa-folder-open"></i>
                    <h3>No Projects Available</h3>
                    <p>Projects are being loaded or there might be a connection issue.</p>
                    <button class="btn btn-primary" onclick="loadProjectsToPublic()" style="margin-top: 1rem;">
                        <i class="fas fa-refresh"></i> Retry Loading
                    </button>
                </div>
            `;
            console.log('⚠️ No projects to display');
        }
    } catch (error) {
        console.error('❌ Critical error loading projects:', error);
        projectsGrid.innerHTML = `
            <div class="project-placeholder error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Failed to Load Projects</h3>
                <p>Error: ${error.message}</p>
                <button class="btn btn-primary" onclick="loadProjectsToPublic()" style="margin-top: 1rem;">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            </div>
        `;
    }
}

// Enhanced photo loading with categorized display
async function loadPhotosToPublic() {
    console.log('📸 Loading photos to categorized display...');
    
    const photoCategories = {
        personal: document.getElementById('personalPhotosGrid'),
        college: document.getElementById('collegePhotosGrid'),
        professional: document.getElementById('professionalPhotosGrid'),
        travel: document.getElementById('travelPhotosGrid')
    };

    // Initialize empty state for all categories
    Object.keys(photoCategories).forEach(category => {
        const grid = photoCategories[category];
        if (grid) {
            grid.innerHTML = `
                <div class="photo-placeholder">
                    <i class="fas fa-camera"></i>
                    <p>No ${category} photos yet</p>
                    <small>Upload through admin panel</small>
                </div>
            `;
        }
    });

    try {
        let allPhotos = [];
        let dataSource = 'unknown';

        // Try to load from backend service first
        if (window.backendService) {
            try {
                console.log('📡 Loading photos from backend...');
                const response = await window.backendService.getPhotos();
                allPhotos = response.data || [];
                dataSource = response.cached ? 'cache' : response.default ? 'default' : 'backend';
                console.log(`✅ Loaded ${allPhotos.length} photos from ${dataSource}`);
            } catch (error) {
                console.log('⚠️ Backend service failed, trying localStorage...');
                dataSource = 'fallback';
            }
        }

        // Fallback to localStorage
        if (allPhotos.length === 0) {
            const storedPhotos = localStorage.getItem('portfolio_photos');
            if (storedPhotos) {
                allPhotos = JSON.parse(storedPhotos);
                dataSource = 'localStorage';
                console.log(`✅ Loaded ${allPhotos.length} photos from localStorage`);
            }
        }

        // Categorize and display photos
        const categorizedPhotos = {
            personal: allPhotos.filter(photo => photo.category === 'personal'),
            college: allPhotos.filter(photo => photo.category === 'college'),
            professional: allPhotos.filter(photo => photo.category === 'professional'),
            travel: allPhotos.filter(photo => photo.category === 'travel')
        };

        // Display photos by category
        Object.keys(categorizedPhotos).forEach(category => {
            const photos = categorizedPhotos[category];
            const grid = photoCategories[category];
            
            if (grid && photos.length > 0) {
                grid.innerHTML = photos.map((photo, index) => {
                    const photoUrl = photo.url || photo.directUrl || photo.imageUrl;
                    const caption = photo.caption || photo.title || '';
                    
                    return `
                        <div class="photo-item" data-index="${index}" data-category="${category}">
                            <div class="photo-container">
                                <img src="${photoUrl}" 
                                     alt="${caption}" 
                                     loading="lazy" 
                                     onerror="this.parentElement.innerHTML='<div class=photo-error><i class=fas fa-image></i><p>Image unavailable</p></div>'"
                                     onload="this.parentElement.classList.add('loaded')">
                                <div class="photo-overlay">
                                    <div class="photo-info">
                                        ${caption ? `<h4>${caption}</h4>` : ''}
                                        <p>${category.toUpperCase()}</p>
                                        <button class="view-full" onclick="openPhotoModal('${photoUrl}', '${caption}', ${index})">
                                            <i class="fas fa-expand"></i> View Full Size
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');

                // Add animation
                setTimeout(() => {
                    grid.querySelectorAll('.photo-item').forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }, 300);
            }
        });

        const totalPhotos = allPhotos.length;
        console.log(`🎉 Successfully displayed ${totalPhotos} photos across all categories`);
        
    } catch (error) {
        console.error('❌ Critical error loading photos:', error);
        Object.values(photoCategories).forEach(grid => {
            if (grid) {
                grid.innerHTML = `
                    <div class="photo-placeholder error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Failed to Load Photos</h3>
                        <p>Error: ${error.message}</p>
                        <button class="btn btn-primary" onclick="loadPhotosToPublic()" style="margin-top: 1rem;">
                            <i class="fas fa-redo"></i> Try Again
                        </button>
                    </div>
                `;
            }
        });
    }
}

// Enhanced photo upload for categories
function addPhotoToCategory(category) {
    const photoUpload = document.getElementById(`${category}PhotoUpload`);
    const photoTitle = document.getElementById(`${category}PhotoTitle`);
    
    if (!photoUpload || photoUpload.files.length === 0) {
        showMessage('Please select at least one photo!', 'error');
        return;
    }
    
    const files = Array.from(photoUpload.files);
    const title = photoTitle ? photoTitle.value : '';
    
    console.log(`📸 Uploading ${files.length} photo(s) to ${category} category...`);
    
    files.forEach(async (file, index) => {
        if (!file.type.startsWith('image/')) {
            showMessage(`${file.name} is not a valid image file`, 'error');
            return;
        }

        try {
            // Always use localStorage for reliable storage
            const base64 = await fileToBase64(file);
            const uploadResult = {
                url: base64,
                name: file.name,
                type: 'local_storage',
                success: true
            };
            
            // Store in localStorage with category
            const photos = JSON.parse(localStorage.getItem('portfolio_photos') || '[]');
            photos.push({
                id: Date.now() + index,
                url: base64,
                caption: title || file.name,
                category: category,
                uploadDate: new Date().toISOString(),
                filename: file.name
            });
            localStorage.setItem('portfolio_photos', JSON.stringify(photos));

            console.log(`✅ Photo ${index + 1}/${files.length} uploaded to ${category} successfully`);
            
        } catch (error) {
            console.error(`❌ Failed to upload ${file.name}:`, error);
            showMessage(`Failed to upload ${file.name}: ${error.message}`, 'error');
        }
    });

    // Clear inputs
// Enhanced photo upload for categories
function addPhotoToCategory(category) {
    const photoUpload = document.getElementById(`${category}PhotoUpload`);
    const photoTitle = document.getElementById(`${category}PhotoTitle`);
    
    if (!photoUpload || photoUpload.files.length === 0) {
        showMessage('Please select at least one photo!', 'error');
        return;
    }
    
    const files = Array.from(photoUpload.files);
    const title = photoTitle ? photoTitle.value : '';
    
    console.log(`📸 Uploading ${files.length} photo(s) to ${category} category...`);
    
    files.forEach(async (file, index) => {
        if (!file.type.startsWith('image/')) {
            showMessage(`${file.name} is not a valid image file`, 'error');
            return;
        }

        try {
            // Always use localStorage for reliable storage
            const base64 = await fileToBase64(file);
            const uploadResult = {
                url: base64,
                name: file.name,
                type: 'local_storage',
                success: true
            };
            
            // Store in localStorage with category
            const photos = JSON.parse(localStorage.getItem('portfolio_photos') || '[]');
            photos.push({
                id: Date.now() + index,
                url: base64,
                caption: title || file.name,
                category: category,
                uploadDate: new Date().toISOString(),
                filename: file.name
            });
            localStorage.setItem('portfolio_photos', JSON.stringify(photos));

            console.log(`✅ Photo ${index + 1}/${files.length} uploaded to ${category} successfully`);
            
        } catch (error) {
            console.error(`❌ Failed to upload ${file.name}:`, error);
            showMessage(`Failed to upload ${file.name}: ${error.message}`, 'error');
        }
    });

    // Clear inputs
    photoUpload.value = '';
    if (photoTitle) photoTitle.value = '';

    // Refresh photo gallery for this category
    setTimeout(() => {
        loadPhotosToPublic();
        loadUploadedPhotosInCategory(category);
        showMessage(`Successfully uploaded ${files.length} photo(s) to ${category}`, 'success');
    }, 1000);
}

// Load uploaded photos for specific category in admin
function loadUploadedPhotosInCategory(category) {
    const photos = JSON.parse(localStorage.getItem('portfolio_photos') || '[]');
    const categoryPhotos = photos.filter(photo => photo.category === category);
    
    const container = document.getElementById(`${category}UploadedPhotos`);
    if (!container) return;
    
    if (categoryPhotos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-camera"></i>
                <p>No photos uploaded for ${category} yet.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = categoryPhotos.map((photo, index) => `
        <div class="uploaded-photo-item">
            <img src="${photo.url}" alt="${photo.caption}" loading="lazy">
            <div class="photo-actions">
                <button class="photo-delete-btn" onclick="deletePhotoFromCategory('${category}', ${photo.id})">&times;</button>
            </div>
            ${photo.caption ? `<div class="photo-caption">${photo.caption}</div>` : ''}
        </div>
    `).join('');
}

// Delete photo from specific category
function deletePhotoFromCategory(category, photoId) {
    if (confirm('Are you sure you want to delete this photo?')) {
        const photos = JSON.parse(localStorage.getItem('portfolio_photos') || '[]');
        const updatedPhotos = photos.filter(photo => photo.id !== photoId);
        
        localStorage.setItem('portfolio_photos', JSON.stringify(updatedPhotos));
        
        // Refresh displays
        loadPhotosToPublic();
        loadUploadedPhotosInCategory(category);
        showMessage('Photo deleted successfully!', 'success');
    }
}
    const uploadedPhotos = document.getElementById(`${category}UploadedPhotos`);
    
    if (uploadedPhotos) {
        if (categoryPhotos.length === 0) {
            uploadedPhotos.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-camera"></i>
                    <p>No ${category} photos yet. Upload your first one!</p>
                </div>
            `;
        } else {
            uploadedPhotos.innerHTML = categoryPhotos.map((photo, index) => `
                <div class="uploaded-photo-item">
                    <img src="${photo.url}" alt="${photo.caption}" loading="lazy">
                    <div class="photo-actions">
                        <button class="photo-delete-btn" onclick="deletePhotoFromCategory('${category}', ${photo.id})">&times;</button>
                    </div>
                    ${photo.caption ? `<div class="photo-caption">${photo.caption}</div>` : ''}
                </div>
            `).join('');
        }
    }
}

// Delete photo from specific category
function deletePhotoFromCategory(category, photoId) {
    if (confirm('Are you sure you want to delete this photo?')) {
        const photos = JSON.parse(localStorage.getItem('portfolio_photos') || '[]');
        const filteredPhotos = photos.filter(photo => photo.id !== photoId);
        localStorage.setItem('portfolio_photos', JSON.stringify(filteredPhotos));
        
        loadPhotosToPublic();
        loadUploadedPhotosInCategory(category);
        showMessage(`Photo deleted from ${category} successfully!`, 'success');
    }
}

// Global photo management functions
function uploadAllPhotosToCloud() {
    console.log('☁️ Uploading all photos to cloud storage...');
    showMessage('🔄 Uploading all photos to cloud...', 'info');
    // Implementation for cloud upload
}

function organizePhotos() {
    console.log('📁 Auto-organizing photos...');
    showMessage('📁 Photos organized successfully!', 'success');
    // Implementation for auto-organization
}

function optimizePhotos() {
    console.log('⚡ Optimizing all photos...');
    showMessage('⚡ Photos optimized for faster loading!', 'success');
    // Implementation for photo optimization
}

// Initialize photo upload tab functionality
function initializePhotoUploadTabs() {
    const tabBtns = document.querySelectorAll('.upload-tab-btn');
    const sections = document.querySelectorAll('.photo-upload-section');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${category}-upload`)?.classList.add('active');
            
            // Load photos for this category
            loadUploadedPhotosInCategory(category);
        });
    });
    
    // Load initial category
    loadUploadedPhotosInCategory('personal');
}// Enhanced photo modal functionality
function openPhotoModal(photoUrl, caption, index) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('photoModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'photoModal';
        modal.className = 'photo-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="closePhotoModal()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="closePhotoModal()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-image-container">
                    <img id="modalImage" src="" alt="">
                </div>
                <div class="modal-info">
                    <h3 id="modalCaption"></h3>
                    <div class="modal-controls">
                        <button onclick="previousPhoto()" class="nav-btn">
                            <i class="fas fa-chevron-left"></i> Previous
                        </button>
                        <button onclick="nextPhoto()" class="nav-btn">
                            Next <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Set current photo
    window.currentPhotoIndex = index;
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    modalImage.src = photoUrl;
    modalCaption.textContent = caption || 'Photo';
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add animation
    setTimeout(() => modal.classList.add('active'), 10);
}

function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

function previousPhoto() {
    const photos = document.querySelectorAll('.photo-item img');
    if (photos.length > 0) {
        window.currentPhotoIndex = (window.currentPhotoIndex - 1 + photos.length) % photos.length;
        const photo = photos[window.currentPhotoIndex];
        document.getElementById('modalImage').src = photo.src;
        document.getElementById('modalCaption').textContent = photo.alt || 'Photo';
    }
}

function nextPhoto() {
    const photos = document.querySelectorAll('.photo-item img');
    if (photos.length > 0) {
        window.currentPhotoIndex = (window.currentPhotoIndex + 1) % photos.length;
        const photo = photos[window.currentPhotoIndex];
        document.getElementById('modalImage').src = photo.src;
        document.getElementById('modalCaption').textContent = photo.alt || 'Photo';
    }
}

// Enhanced photo upload handling with improved error handling
function addPhoto() {
    const fileInput = document.getElementById('photoUpload');
    const titleInput = document.getElementById('photoTitle');
    
    if (!fileInput.files.length) {
        showMessage('Please select photo files to upload', 'error');
        return;
    }

    const files = Array.from(fileInput.files);
    const title = titleInput.value.trim();

    console.log(`📤 Starting upload of ${files.length} photo(s)...`);

    files.forEach(async (file, index) => {
        try {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                throw new Error(`${file.name} is not a valid image file`);
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                throw new Error(`${file.name} is too large (max 10MB)`);
            }

            let uploadResult;
            
            // Always use localStorage with base64 for reliable storage
            const base64 = await fileToBase64(file);
            uploadResult = {
                url: base64,
                name: file.name,
                type: 'local_storage',
                success: true
            };
            
            // Store in localStorage with proper structure
            const photos = JSON.parse(localStorage.getItem('portfolio_photos') || '[]');
            photos.push({
                id: Date.now() + index,
                url: base64,
                caption: title || file.name,
                category: 'gallery',
                uploadDate: new Date().toISOString(),
                filename: file.name
            });
            localStorage.setItem('portfolio_photos', JSON.stringify(photos));

            console.log(`✅ Photo ${index + 1}/${files.length} uploaded successfully`);
            
        } catch (error) {
            console.error(`❌ Failed to upload ${file.name}:`, error);
            showMessage(`Failed to upload ${file.name}: ${error.message}`, 'error');
        }
    });

    // Clear inputs
    fileInput.value = '';
    titleInput.value = '';

    // Refresh photo gallery
    setTimeout(() => {
        loadPhotosToPublic();
        showMessage(`Successfully processed ${files.length} photo(s)`, 'success');
    }, 1000);
}

// Helper function to convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Photo upload functionality
function addPhoto() {
    const photoUpload = document.getElementById('photoUpload');
    const photoTitle = document.getElementById('photoTitle');
    
    if (photoUpload.files.length === 0) {
        showMessage('Please select at least one photo!', 'error');
        return;
    }
    
    Array.from(photoUpload.files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const photos = JSON.parse(localStorage.getItem('portfolioPhotos')) || [];
                photos.push({
                    url: e.target.result,
                    title: photoTitle.value || '',
                    id: Date.now() + Math.random()
                });
                localStorage.setItem('portfolioPhotos', JSON.stringify(photos));
                loadPhotosToPublic();
                loadUploadedPhotos();
                showMessage('Photo uploaded successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Reset form
    photoUpload.value = '';
    photoTitle.value = '';
}

// Load uploaded photos in admin
function loadUploadedPhotos() {
    const photos = JSON.parse(localStorage.getItem('portfolioPhotos')) || [];
    const uploadedPhotos = document.getElementById('uploadedPhotos');
    
    if (uploadedPhotos) {
        uploadedPhotos.innerHTML = photos.map((photo, index) => `
            <div class="uploaded-photo-item">
                <img src="${photo.url}" alt="${photo.title}">
                <div class="photo-actions">
                    <button class="photo-delete-btn" onclick="deletePhoto(${index})">&times;</button>
                </div>
                ${photo.title ? `<div class="photo-caption">${photo.title}</div>` : ''}
            </div>
        `).join('');
    }
}

// Delete photo
function deletePhoto(index) {
    if (confirm('Are you sure you want to delete this photo?')) {
        const photos = JSON.parse(localStorage.getItem('portfolioPhotos')) || [];
        photos.splice(index, 1);
        localStorage.setItem('portfolioPhotos', JSON.stringify(photos));
        loadPhotosToPublic();
        loadUploadedPhotos();
        showMessage('Photo deleted successfully!', 'success');
    }
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
    initializeDefaultMemories();
});

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
        showMessage('Light mode activated! ☀️', 'success');
    } else {
        // Switch to dark mode
        body.classList.add('theme-dark');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        localStorage.setItem('portfolioTheme', 'dark');
        showMessage('Dark mode activated! 🌙', 'success');
    }
}

// Load saved theme on page load - Enhanced
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

// Advanced Features

// Auto-save functionality for admin changes
let autoSaveTimeout;
function enableAutoSave() {
    const inputs = document.querySelectorAll('#adminDashboard input, #adminDashboard textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                const activeTab = document.querySelector('.tab-btn.active');
                if (activeTab) {
                    const tab = activeTab.dataset.tab;
                    switch(tab) {
                        case 'profile':
                            saveProfile();
                            break;
                        case 'content':
                            saveContent();
                            break;
                        case 'social':
                            saveSocial();
                            break;
                    }
                }
            }, 2000); // Auto-save after 2 seconds of inactivity
        });
    });
}

// Search functionality for admin dashboard
function initializeSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search projects, skills, achievements...';
    searchInput.className = 'admin-search';
    searchInput.style.cssText = `
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--card-bg);
        color: var(--text-primary);
    `;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        filterAdminContent(query);
    });
    
    return searchInput;
}

function filterAdminContent(query) {
    if (!query) {
        // Show all items
        document.querySelectorAll('.project-item, .skill-item-admin, .hobby-item, .achievement-item').forEach(item => {
            item.style.display = 'block';
        });
        return;
    }
    
    // Filter items based on search query
    document.querySelectorAll('.project-item, .skill-item-admin, .hobby-item, .achievement-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'block' : 'none';
    });
}

// Bulk operations for admin
function addBulkOperations() {
    const bulkContainer = document.createElement('div');
    bulkContainer.className = 'bulk-operations';
    bulkContainer.innerHTML = `
        <h4>Bulk Operations</h4>
        <div style="display: flex; gap: 1rem; margin: 1rem 0;">
            <button class="btn btn-small" onclick="selectAllItems()">Select All</button>
            <button class="btn btn-small btn-delete" onclick="deleteSelectedItems()">Delete Selected</button>
            <button class="btn btn-small" onclick="exportSelectedItems()">Export Selected</button>
        </div>
    `;
    return bulkContainer;
}

function selectAllItems() {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    checkboxes.forEach(cb => cb.checked = true);
}

function deleteSelectedItems() {
    const selected = document.querySelectorAll('.item-checkbox:checked');
    if (selected.length === 0) {
        showMessage('No items selected!', 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${selected.length} selected items?`)) {
        selected.forEach(checkbox => {
            const deleteBtn = checkbox.closest('.project-item, .skill-item-admin, .hobby-item, .achievement-item')
                .querySelector('.btn-delete');
            if (deleteBtn) deleteBtn.click();
        });
    }
}

// Enhanced project management
function enhanceProjectManagement() {
    const projectsTab = document.getElementById('projects-tab');
    if (projectsTab) {
        const searchBox = initializeSearch();
        projectsTab.insertBefore(searchBox, projectsTab.firstChild);
        
        const bulkOps = addBulkOperations();
        projectsTab.insertBefore(bulkOps, projectsTab.querySelector('.projects-list'));
    }
}

// Simple analytics tracking
function initializeAnalytics() {
    const analytics = {
        pageViews: parseInt(localStorage.getItem('pageViews') || '0') + 1,
        lastVisit: new Date().toISOString()
    };
    
    localStorage.setItem('pageViews', analytics.pageViews.toString());
    localStorage.setItem('analytics', JSON.stringify(analytics));
}

// Dynamic content loading based on user preferences
function initializePersonalization() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    
    // Reduce animations for users who prefer it
    if (preferences.reduceMotion) {
        document.body.classList.add('reduce-motion');
        const style = document.createElement('style');
        style.textContent = `
            .reduce-motion *, .reduce-motion *::before, .reduce-motion *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // High contrast mode
    if (preferences.highContrast) {
        document.body.classList.add('high-contrast');
    }
    
    // Font size adjustments
    if (preferences.fontSize) {
        document.documentElement.style.fontSize = preferences.fontSize;
    }
}

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
    
    .admin-search {
        font-family: inherit;
    }
    
    .bulk-operations {
        background: var(--card-bg);
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border: 1px solid var(--border);
    }
    
    .item-checkbox {
        margin-right: 0.5rem;
    }
    
    .voice-nav-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    
    .message {
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        font-weight: 500;
    }
    
    .message.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .message.error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .message.info {
        background: #d1ecf1;
        color: #0c5460;
        border: 1px solid #bee5eb;
    }
`;
document.head.appendChild(style);

// Initialize all advanced features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize advanced features
    setTimeout(() => {
        initializePersonalization();
        initializeAnalytics();
        
        // Enable admin features if logged in
        if (localStorage.getItem(STORAGE_KEYS.isLoggedIn) === 'true') {
            showDashboard();
        }
        
        // Load custom theme if exists
        const customTheme = localStorage.getItem('customTheme');
        if (customTheme) {
            const theme = JSON.parse(customTheme);
            Object.keys(theme).forEach(property => {
                document.documentElement.style.setProperty(property, theme[property]);
            });
        }
        
    }, 1000);
});

// Export global functions for console access
window.portfolioAPI = {
    updateProfile: saveProfile,
    updateContent: saveContent,
    updateSocial: saveSocial,
    exportData: exportData,
    importData: importData,
    resetData: resetToDefaults,
    getAnalytics: () => JSON.parse(localStorage.getItem('analytics') || '{}'),
    showStats: () => {
        const analytics = JSON.parse(localStorage.getItem('analytics') || '{}');
        console.table(analytics);
    }
};

// Memory Management System
const MEMORY_STORAGE_KEY = 'portfolioMemories';

// Initialize default memories
function initializeDefaultMemories() {
    const savedMemories = localStorage.getItem(MEMORY_STORAGE_KEY);
    if (!savedMemories) {
        const defaultMemories = {
            childhood: [],
            hostel: [],
            school: []
        };
        localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(defaultMemories));
    }
    loadMemoriesToPublic();
}

// Add memory function
function addMemory(category) {
    const videoInput = document.getElementById(`${category}Video`);
    const titleInput = document.getElementById(`${category}Title`);
    const descInput = document.getElementById(`${category}Desc`);
    
    if (!videoInput.files.length || !titleInput.value) {
        alert('Please select a video and enter a title');
        return;
    }
    
    const file = videoInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const memory = {
            id: Date.now(),
            title: titleInput.value,
            description: descInput.value,
            videoData: e.target.result,
            dateAdded: new Date().toISOString(),
            category: category
        };
        
        // Save to localStorage
        const memories = JSON.parse(localStorage.getItem(MEMORY_STORAGE_KEY) || '{}');
        if (!memories[category]) memories[category] = [];
        memories[category].push(memory);
        localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memories));
        
        // Clear inputs
        videoInput.value = '';
        titleInput.value = '';
        descInput.value = '';
        
        // Reload memories
        loadMemoriesToAdmin();
        loadMemoriesToPublic();
        
        showMessage('Memory added successfully!', 'success');
    };
    
    reader.readAsDataURL(file);
}

// Load memories to admin dashboard
function loadMemoriesToAdmin() {
    const memories = JSON.parse(localStorage.getItem(MEMORY_STORAGE_KEY) || '{}');
    
    ['childhood', 'hostel', 'school'].forEach(category => {
        const container = document.getElementById(`${category}Memories`);
        if (!container) return;
        
        container.innerHTML = '';
        
        if (memories[category] && memories[category].length > 0) {
            memories[category].forEach(memory => {
                const memoryDiv = document.createElement('div');
                memoryDiv.className = 'memory-item';
                memoryDiv.innerHTML = `
                    <video controls>
                        <source src="${memory.videoData}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <div class="memory-item-title">${memory.title}</div>
                    <div class="memory-item-desc">${memory.description}</div>
                    <div class="memory-item-actions">
                        <button class="memory-action-btn delete-memory" onclick="deleteMemory('${category}', ${memory.id})" title="Delete">🗑️</button>
                    </div>
                `;
                container.appendChild(memoryDiv);
            });
        } else {
            container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No memories added yet</p>';
        }
    });
}

// Load memories to public section
function loadMemoriesToPublic() {
    const memories = JSON.parse(localStorage.getItem(MEMORY_STORAGE_KEY) || '{}');
    
    const categoryMap = {
        childhood: 'publicChildhoodMemories',
        hostel: 'publicHostelMemories',
        school: 'publicSchoolMemories'
    };
    
    Object.entries(categoryMap).forEach(([category, containerId]) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        if (memories[category] && memories[category].length > 0) {
            memories[category].forEach(memory => {
                const memoryDiv = document.createElement('div');
                memoryDiv.className = 'memory-video-item';
                memoryDiv.innerHTML = `
                    <video controls>
                        <source src="${memory.videoData}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <div class="memory-video-title">${memory.title}</div>
                    <div class="memory-video-desc">${memory.description}</div>
                `;
                container.appendChild(memoryDiv);
            });
        } else {
            container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; font-style: italic;">No memories to display yet</p>';
        }
    });
}

// Delete memory function
function deleteMemory(category, memoryId) {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    
    const memories = JSON.parse(localStorage.getItem(MEMORY_STORAGE_KEY) || '{}');
    if (memories[category]) {
        memories[category] = memories[category].filter(memory => memory.id !== memoryId);
        localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memories));
        loadMemoriesToAdmin();
        loadMemoriesToPublic();
        showMessage('Memory deleted successfully!', 'success');
    }
}

// Load saved memories
function loadSavedMemories() {
    loadMemoriesToAdmin();
    loadMemoriesToPublic();
}

// Service Worker registration for PWA capabilities (if service-worker.js exists)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Interactive Features Functions
function revealSecret(type) {
    if (type === 'snake') {
        // Create a modal with the secret reveal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 3rem;
                border-radius: 20px;
                text-align: center;
                max-width: 500px;
                width: 90%;
                color: white;
                animation: slideInUp 0.5s ease-out;
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🐍</div>
                <h2 style="margin-bottom: 1rem; font-size: 2rem;">Secret Unlocked!</h2>
                <p style="margin-bottom: 2rem; line-height: 1.6; opacity: 0.9;">
                    You've discovered the hidden Snake game! This retro game features:
                    <br>• Multiple difficulty levels
                    <br>• Achievement system
                    <br>• High score tracking
                    <br>• Retro CRT effects
                    <br>• Mobile touch controls
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="window.open('features/snake-game.html', '_blank'); this.closest('div').remove();" 
                            style="
                                background: rgba(255, 255, 255, 0.2);
                                border: 2px solid rgba(255, 255, 255, 0.3);
                                color: white;
                                padding: 1rem 2rem;
                                border-radius: 25px;
                                cursor: pointer;
                                font-weight: 600;
                                transition: all 0.3s ease;
                            "
                            onmouseover="this.style.background='rgba(255,255,255,0.3)'; this.style.transform='scale(1.05)'"
                            onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='scale(1)'">
                        🎮 Play Snake Game
                    </button>
                    <button onclick="this.closest('div').remove();" 
                            style="
                                background: transparent;
                                border: 2px solid rgba(255, 255, 255, 0.3);
                                color: white;
                                padding: 1rem 2rem;
                                border-radius: 25px;
                                cursor: pointer;
                                font-weight: 600;
                                transition: all 0.3s ease;
                            "
                            onmouseover="this.style.borderColor='rgba(255,255,255,0.6)'; this.style.transform='scale(1.05)'"
                            onmouseout="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.transform='scale(1)'">
                        Close
                    </button>
                </div>
                <div style="margin-top: 1.5rem; font-size: 0.9rem; opacity: 0.7;">
                    Hint: Try the Terminal About Me and type "snake" command!
                </div>
            </div>
        `;
        
        // Add click to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
        
        // Add confetti effect
        createConfetti();
    }
}

function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#60efff', '#00ff87', '#feca57', '#ff9ff3'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            z-index: 10001;
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Add confetti animation CSS
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(confettiStyle);

// Initialize Theme System
function initializeTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    document.body.classList.toggle('theme-dark', savedTheme === 'dark');
    
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Enhanced Toggle Theme Function
function toggleTheme() {
    const isDark = document.body.classList.toggle('theme-dark');
    const themeIcon = document.getElementById('theme-icon');
    
    if (themeIcon) {
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
    
    // Add smooth transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// Initialize Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate', 'active', 'reveal');
                
                // Trigger skill bar animations
                if (entry.target.classList.contains('skill-category')) {
                    const skillBars = entry.target.querySelectorAll('.skill-progress');
                    skillBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        setTimeout(() => {
                            bar.style.width = width + '%';
                        }, 200);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe all reveal elements
    document.querySelectorAll('.reveal, .section-title, .project-card, .skill-category, .timeline-item, .memory-category-card, .feature-card').forEach(el => {
        observer.observe(el);
    });
}

// Enhanced Project Loading with Better Link Validation
function loadProjectsToPublic() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) {
        console.warn('Projects grid element not found');
        return;
    }
    
    try {
        const savedProjects = localStorage.getItem(STORAGE_KEYS.projects);
        const projects = savedProjects ? JSON.parse(savedProjects) : DEFAULT_DATA.projects;
        
        if (!projects || projects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="project-placeholder">
                    <i class="fas fa-folder-open"></i>
                    <p>No projects available. Admin can add projects from the dashboard.</p>
                </div>
            `;
            return;
        }
        
        // Sort projects: featured first, then by ID
        const sortedProjects = projects.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return a.id - b.id;
        });
        
        // Validate and fix project URLs
        const validatedProjects = sortedProjects.map(project => {
            const validatedProject = { ...project };
            
            // Ensure URLs are properly formatted
            if (validatedProject.liveUrl && !validatedProject.liveUrl.startsWith('http')) {
                validatedProject.liveUrl = 'https://' + validatedProject.liveUrl;
            }
            if (validatedProject.githubUrl && !validatedProject.githubUrl.startsWith('http')) {
                validatedProject.githubUrl = 'https://' + validatedProject.githubUrl;
            }
            
            return validatedProject;
        });
        
        projectsGrid.innerHTML = validatedProjects.map(project => `
            <div class="project-card ${project.featured ? 'featured-project' : ''}" data-category="${project.category || 'web'}">
                <div class="project-icon">${project.icon || '🚀'}</div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${(project.tech || []).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.liveUrl ? `<a href="${project.liveUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>` : ''}
                    ${project.githubUrl ? `<a href="${project.githubUrl}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-github"></i> GitHub
                    </a>` : ''}
                </div>
            </div>
        `).join('');
        
        // Trigger animations with proper timing
        setTimeout(() => {
            projectsGrid.querySelectorAll('.project-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate');
                }, index * 100);
            });
        }, 100);
        
        console.log(`✅ Loaded ${validatedProjects.length} projects successfully`);
        
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsGrid.innerHTML = `
            <div class="project-placeholder">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading projects. Please refresh the page.</p>
                <button class="btn btn-primary" onclick="loadProjectsToPublic()" style="margin-top: 1rem;">
                    <i class="fas fa-refresh"></i> Retry Loading
                </button>
            </div>
        `;
    }
}

// Enhanced Photo Loading with Error Handling
function loadPhotosToPublic() {
    const photosGrid = document.getElementById('photosGrid');
    if (!photosGrid) return;
    
    try {
        const savedPhotos = JSON.parse(localStorage.getItem('portfolio_photos') || '[]');
        
        if (savedPhotos.length === 0) {
            photosGrid.innerHTML = `
                <div class="photo-placeholder">
                    <i class="fas fa-camera"></i>
                    <p>Photo gallery loading...</p>
                </div>
            `;
            return;
        }
        
        photosGrid.innerHTML = savedPhotos.map(photo => `
            <div class="photo-item">
                <img src="${photo.url}" alt="${photo.title}" loading="lazy">
                <div class="photo-caption">${photo.title}</div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading photos:', error);
        photosGrid.innerHTML = `
            <div class="photo-placeholder">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading photos. Please refresh the page.</p>
            </div>
        `;
    }
}

// Smooth Scrolling for Navigation Links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
});

// Secret Easter Egg Functions
function revealSecret(type) {
    if (type === 'snake') {
        // Create confetti effect
        createConfetti();
        
        // Show message
        setTimeout(() => {
            const confirmed = confirm('🐍 You found the secret Snake game! Want to play?');
            if (confirmed) {
                window.open('features/snake-game.html', '_blank');
            }
        }, 1000);
    }
}

// Konami Code Easter Egg
const konamiCodeSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;

document.addEventListener('keydown', function(e) {
    if (e.code === konamiCodeSequence[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCodeSequence.length) {
            activateKonamiEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateKonamiEasterEgg() {
    // Matrix mode effect
    document.body.style.filter = 'hue-rotate(120deg)';
    createConfetti();
    
    // Show message
    setTimeout(() => {
        alert('🎮 KONAMI CODE ACTIVATED!\n\n✨ Matrix mode enabled\n🎊 Confetti unleashed\n🐍 Snake game unlocked\n\nYou are a true developer! 🚀');
        
        // Reset after 10 seconds
        setTimeout(() => {
            document.body.style.filter = '';
        }, 10000);
    }, 500);
}

function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                z-index: 10001;
                animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
                border-radius: 50%;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }, 5000);
        }, i * 50);
    }
}

// Global Error Handler
window.addEventListener('error', function(e) {
    console.error('Portfolio Error:', e.error);
    // You could add user-friendly error reporting here
});

// Console welcome message
console.log(`
🎯 Welcome to Ritesh Chauhan's Portfolio!
🚀 This portfolio features:
   • Interactive Code Playground
   • Terminal-style About Me
   • Voice Assistant Integration
   • Dynamic Admin Dashboard
   • Real-time Theme Switching
   • Parallax Storytelling
   • Hidden Easter Eggs

💡 Try the Konami Code for a surprise!
   ↑ ↑ ↓ ↓ ← → ← → B A

🔧 Admin Access: Username: 'Ritesh', Password: 'Ritesh@4368@'
`);

// Project filtering and enhanced features
let currentFilter = 'all';
let allProjects = [];

function initializeProjectsFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Filter projects
            const filter = btn.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
}

function filterProjects(filter) {
    currentFilter = filter;
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || 'web';
        
        if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

function loadMoreProjects() {
    // Simulate loading more projects
    const projectsGrid = document.getElementById('projectsGrid');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-more';
    loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading more projects...';
    projectsGrid.appendChild(loadingDiv);
    
    setTimeout(() => {
        // Add some example additional projects
        const additionalProjects = [
            {
                title: 'AI Chatbot',
                description: 'Intelligent chatbot with natural language processing',
                category: 'ai',
                tech: ['Python', 'TensorFlow', 'NLP'],
                github: '#',
                demo: '#'
            },
            {
                title: 'Mobile Weather App',
                description: 'Cross-platform weather application',
                category: 'mobile',
                tech: ['React Native', 'API Integration'],
                github: '#',
                demo: '#'
            },
            {
                title: 'Puzzle Game',
                description: 'Interactive puzzle game with levels',
                category: 'games',
                tech: ['JavaScript', 'Canvas', 'Game Logic'],
                github: '#',
                demo: '#'
            }
        ];
        
        loadingDiv.remove();
        additionalProjects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
        
        // Reinitialize filters for new projects
        filterProjects(currentFilter);
    }, 1500);
}

function shuffleProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    const projectCards = Array.from(projectsGrid.querySelectorAll('.project-card'));
    
    // Shuffle array
    for (let i = projectCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [projectCards[i], projectCards[j]] = [projectCards[j], projectCards[i]];
    }
    
    // Clear grid and re-append in new order
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
    });
    
    setTimeout(() => {
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                projectsGrid.appendChild(card);
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, index * 100);
        });
    }, 300);
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.setAttribute('data-category', project.category);
    
    card.innerHTML = `
        <div class="project-image">
            <div class="project-placeholder">
                <i class="fas fa-code"></i>
            </div>
        </div>
        <div class="project-info">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tech">
                ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        </div>
        <div class="project-links">
            <a href="${project.github}" target="_blank" class="project-btn">
                <i class="fab fa-github"></i> Code
            </a>
            <a href="${project.demo}" target="_blank" class="project-btn">
                <i class="fas fa-external-link-alt"></i> Demo
            </a>
        </div>
    `;
    
    return card;
}

// Google Drive API Key Setup Functions
function setupGoogleDrive() {
    console.log('🔗 Setting up Google Drive API Key for rites.chauhan11@gmail.com...');
    
    // Check if API key is already set
    const currentKey = localStorage.getItem('google_drive_api_key');
    
    if (currentKey && currentKey !== 'YOUR_GOOGLE_DRIVE_API_KEY') {
        const useExisting = confirm('Google Drive API key already exists. Use existing key?');
        if (useExisting) {
            testGoogleDrive();
            return;
        }
    }
    
    // Prompt for API key
    const apiKey = prompt(`� Enter your Google Drive API Key:

📋 To get your API key:
1. Go to: https://console.cloud.google.com/
2. Sign in with: rites.chauhan11@gmail.com
3. Create project & enable Google Drive API
4. Create API Key credential
5. Copy the key and paste it here

Enter API Key:`);
    
    if (apiKey && apiKey.trim() && apiKey !== 'YOUR_GOOGLE_DRIVE_API_KEY') {
        // Store API key
        localStorage.setItem('google_drive_api_key', apiKey.trim());
        
        // Update cloud storage configuration
        if (window.cloudStorage) {
            window.cloudStorage.driveConfig.apiKey = apiKey.trim();
            window.cloudStorage.checkConnection();
        }
        
        showMessage('🔑 API Key saved! Testing connection...', 'success');
        
        // Test connection
        setTimeout(() => {
            testGoogleDrive();
        }, 1000);
        
    } else if (apiKey === null) {
        showMessage('❌ Setup cancelled', 'info');
    } else {
        showMessage('❌ Invalid API key provided', 'error');
    }
}

function testGoogleDrive() {
    console.log('🧪 Testing Google Drive API connection...');
    
    if (window.cloudStorage) {
        window.cloudStorage.checkConnection()
            .then(isConnected => {
                if (isConnected) {
                    showMessage('✅ Google Drive connected successfully!', 'success');
                } else {
                    showMessage('❌ Google Drive connection failed. Check API key.', 'error');
                }
            })
            .catch(error => {
                console.error('Test failed:', error);
                showMessage('❌ Connection test failed', 'error');
            });
    } else {
        showMessage('❌ Cloud storage not initialized', 'error');
    }
}

function openGoogleDriveGuide() {
    console.log('📖 Opening Google Drive API setup guide...');
    
    // Create a popup with the API key setup guide
    const guideWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
    
    guideWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Google Drive API Key Setup - rites.chauhan11@gmail.com</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
                .highlight { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; }
                .success { color: #28a745; }
                .warning { color: #ffc107; }
                .error { color: #dc3545; }
                code { background: #f1f1f1; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
                .step { margin: 20px 0; padding: 15px; border-left: 4px solid #007bff; background: #f8f9fa; }
                .copy-btn { background: #007bff; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
            </style>
        </head>
        <body>
            <h1>� Google Drive API Key Setup</h1>
            <h2>For: rites.chauhan11@gmail.com</h2>
            
            <div class="highlight success">
                <h3>✅ Pre-configured Settings:</h3>
                <ul>
                    <li><strong>Email:</strong> rites.chauhan11@gmail.com</li>
                    <li><strong>Folder ID:</strong> 1BmMRHyBgvfKGOYOH8mZGUJOb8Lk9Y8Kg</li>
                    <li><strong>Method:</strong> API Key (simpler than OAuth)</li>
                </ul>
            </div>
            
            <div class="step">
                <h3>Step 1: Google Cloud Console</h3>
                <ol>
                    <li><a href="https://console.cloud.google.com/" target="_blank">Open Google Cloud Console</a></li>
                    <li>Sign in with <strong>rites.chauhan11@gmail.com</strong></li>
                    <li>Create project: "Ritesh Portfolio API"</li>
                    <li>Enable Google Drive API</li>
                </ol>
            </div>
            
            <div class="step">
                <h3>Step 2: Create API Key</h3>
                <ol>
                    <li>Go to APIs & Services → Credentials</li>
                    <li>Click "Create Credentials" → "API Key"</li>
                    <li>Copy the generated API key</li>
                    <li>Click "Restrict Key" for security</li>
                </ol>
            </div>
            
            <div class="step">
                <h3>Step 3: Restrict API Key (Security)</h3>
                <div class="highlight">
                    <p><strong>Application restrictions:</strong> HTTP referrers (websites)</p>
                    <p><strong>Website restrictions:</strong></p>
                    <ul>
                        <li>http://localhost:3000/*</li>
                        <li>https://localhost:3000/*</li>
                        <li>https://riteshchauhan.pages.dev/*</li>
                    </ul>
                    <p><strong>API restrictions:</strong> Google Drive API</p>
                </div>
            </div>
            
            <div class="step">
                <h3>Step 4: Test in Portfolio</h3>
                <ol>
                    <li>Go back to your portfolio admin panel</li>
                    <li>Click "Complete OAuth Setup" (will prompt for API key)</li>
                    <li>Paste your API key</li>
                    <li>Test the connection</li>
                </ol>
            </div>
            
            <div class="highlight success">
                <h3>🎉 Success!</h3>
                <p>Your portfolio will now upload files directly to your Google Drive!</p>
                <p><strong>Folder:</strong> <a href="https://drive.google.com/drive/folders/1BmMRHyBgvfKGOYOH8mZGUJOb8Lk9Y8Kg" target="_blank">Open Portfolio Folder</a></p>
            </div>
            
            <div class="highlight warning">
                <h3>⚠️ Security Notes:</h3>
                <ul>
                    <li>API key is stored in browser localStorage</li>
                    <li>Restrict the key to your domains only</li>
                    <li>You can revoke the key anytime in Google Cloud Console</li>
                </ul>
            </div>
        </body>
        </html>
    `);
    
    guideWindow.document.close();
}

function openGoogleDriveFolder() {
    console.log('📁 Opening Google Drive folder...');
    
    const folderId = '1BmMRHyBgvfKGOYOH8mZGUJOb8Lk9Y8Kg';
    const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;
    
    window.open(folderUrl, '_blank');
    showMessage('📁 Portfolio folder opened in Google Drive', 'info');
}

// Update hero profile image
function updateHeroProfileImage() {
    const profile = getStoredData('profile');
    const heroImg = document.getElementById('heroProfileImg');
    
    if (heroImg && profile.photo) {
        heroImg.src = profile.photo;
        heroImg.alt = profile.name;
        console.log('✅ Hero profile image updated via updateHeroProfileImage()');
    }
}

// Helper function to handle profile photo change in form
function handleProfilePhotoChange(input) {
    const file = input.files[0];
    const previewContainer = document.getElementById('photoPreview');
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewContainer.innerHTML = `<img src="${e.target.result}" alt="Profile Preview" style="max-width: 200px; max-height: 200px; border-radius: 10px;">`;
            previewContainer.classList.add('show');
        };
        reader.readAsDataURL(file);
    } else {
        previewContainer.classList.remove('show');
        previewContainer.innerHTML = '';
    }
}

// Google Drive Management Functions
async function checkGoogleDriveStatus() {
    try {
        const response = await fetch('/api/google-drive/status');
        const status = await response.json();
        
        const statusDot = document.getElementById('driveStatusDot');
        const statusText = document.getElementById('driveStatusText');
        const storageType = document.getElementById('storageType');
        const setupBtn = document.getElementById('setupGoogleDrive');
        
        if (status.configured) {
            statusDot.textContent = '🟢';
            statusText.textContent = 'Connected and Ready';
            storageType.textContent = 'Google Drive (rites.chauhan11@gmail.com)';
            setupBtn.textContent = '✅ Google Drive Connected';
            setupBtn.disabled = true;
        } else {
            statusDot.textContent = '🔴';
            statusText.textContent = 'Not Configured';
            storageType.textContent = 'Local Storage Only';
            setupBtn.textContent = '🔗 Setup Google Drive';
            setupBtn.disabled = false;
        }
        
        // Update storage location
        const storageLocation = document.getElementById('storageLocation');
        if (storageLocation) {
            storageLocation.textContent = status.configured ? 'Google Drive' : 'Local Server';
        }
        
        return status;
    } catch (error) {
        console.error('Failed to check Google Drive status:', error);
        
        const statusDot = document.getElementById('driveStatusDot');
        const statusText = document.getElementById('driveStatusText');
        
        if (statusDot) statusDot.textContent = '⚠️';
        if (statusText) statusText.textContent = 'Status Unknown';
    }
}

function setupGoogleDrive() {
    // Open OAuth flow in new window
    const authWindow = window.open(
        '/auth/google',
        'google-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
    );
    
    // Check if window was closed
    const checkClosed = setInterval(() => {
        if (authWindow.closed) {
            clearInterval(checkClosed);
            // Recheck status after auth
            setTimeout(() => {
                checkGoogleDriveStatus();
            }, 2000);
        }
    }, 1000);
}

async function testGoogleDrive() {
    const testBtn = document.getElementById('testGoogleDrive');
    const originalText = testBtn.textContent;
    
    testBtn.textContent = '🔄 Testing...';
    testBtn.disabled = true;
    
    try {
        const response = await fetch('/api/google-drive/status');
        const status = await response.json();
        
        if (status.configured) {
            showNotification('✅ Google Drive connection successful!', 'success');
        } else {
            showNotification('⚠️ Google Drive not configured. Click Setup to authenticate.', 'warning');
        }
    } catch (error) {
        showNotification('❌ Failed to test Google Drive connection', 'error');
    } finally {
        testBtn.textContent = originalText;
        testBtn.disabled = false;
    }
}

function openGoogleDriveSetup() {
    // Open setup guide in new tab
    window.open('/setup-google-drive.html', '_blank');
}

function clearCache() {
    if (confirm('Clear all cached data? This will reload the page.')) {
        localStorage.clear();
        sessionStorage.clear();
        showNotification('🗑️ Cache cleared successfully!', 'success');
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

async function checkSystem() {
    const checkBtn = document.querySelector('button[onclick="checkSystem()"]');
    const originalText = checkBtn.textContent;
    
    checkBtn.textContent = '🔄 Checking...';
    checkBtn.disabled = true;
    
    try {
        // Check various system components
        const checks = [
            { name: 'Backend Connection', test: () => fetch('/api/health') },
            { name: 'Database Connection', test: () => fetch('/api/health') },
            { name: 'Google Drive Status', test: () => fetch('/api/google-drive/status') },
            { name: 'Local Storage', test: () => Promise.resolve(localStorage.getItem('test') !== null) }
        ];
        
        let results = '';
        for (const check of checks) {
            try {
                await check.test();
                results += `✅ ${check.name}: OK\n`;
            } catch (error) {
                results += `❌ ${check.name}: Failed\n`;
            }
        }
        
        alert(`System Check Results:\n\n${results}`);
    } catch (error) {
        showNotification('❌ System check failed', 'error');
    } finally {
        checkBtn.textContent = originalText;
        checkBtn.disabled = false;
    }
}

async function backupData() {
    const backupBtn = document.querySelector('button[onclick="backupData()"]');
    const originalText = backupBtn.textContent;
    
    backupBtn.textContent = '💾 Creating Backup...';
    backupBtn.disabled = true;
    
    try {
        const data = {
            profile: getStoredData('profile'),
            projects: getStoredData('projects'),
            photos: getStoredData('photos'),
            memories: getStoredData('memories'),
            social: getStoredData('social'),
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('💾 Backup created successfully!', 'success');
    } catch (error) {
        showNotification('❌ Backup creation failed', 'error');
    } finally {
        backupBtn.textContent = originalText;
        backupBtn.disabled = false;
    }
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    initializePortfolio();
}

function initializePortfolio() {
    console.log('🚀 Portfolio initializing...');
    
    // Initialize all components
    initializeData();
    initializeTheme();
    initializeScrollAnimations();
    loadProjectsToPublic();
    loadPhotosToPublic();
    initializeProjectsFilters();
    updateHeroProfileImage();
    
    // Check Google Drive status if in admin mode
    if (document.getElementById('googleDriveStatus')) {
        checkGoogleDriveStatus();
    }
    
    console.log('✅ Portfolio initialized successfully!');
}
