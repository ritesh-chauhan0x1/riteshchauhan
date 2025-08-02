class TerminalAbout {
    constructor() {
        this.terminal = document.getElementById('terminal');
        this.currentLine = this.terminal.querySelector('.terminal-line');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.isTyping = false;
        
        this.commands = {
            'help': this.showHelp.bind(this),
            'whoami': this.whoami.bind(this),
            'about': this.about.bind(this),
            'skills': this.skills.bind(this),
            'projects': this.projects.bind(this),
            'education': this.education.bind(this),
            'experience': this.experience.bind(this),
            'contact': this.contact.bind(this),
            'achievements': this.achievements.bind(this),
            'hobbies': this.hobbies.bind(this),
            'ls': this.listFiles.bind(this),
            'ls -la': this.listFilesDetailed.bind(this),
            'cat resume.pdf': this.showResume.bind(this),
            'cat': this.catFile.bind(this),
            'pwd': this.pwd.bind(this),
            'date': this.date.bind(this),
            'uptime': this.uptime.bind(this),
            'neofetch': this.neofetch.bind(this),
            'clear': this.clear.bind(this),
            'history': this.history.bind(this),
            'sudo make-me-coffee': this.makeCoffee.bind(this),
            'exit': this.exit.bind(this),
            'fortune': this.fortune.bind(this),
            'cowsay': this.cowsay.bind(this),
            'matrix': this.matrix.bind(this),
            'hack': this.hack.bind(this),
            'tree': this.tree.bind(this)
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showWelcome();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.isTyping) return;
            
            if (e.key === 'Enter') {
                this.handleCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            } else if (e.key === 'Backspace') {
                this.deletChar();
            } else if (e.key.length === 1) {
                this.addChar(e.key);
            }
        });

        // Focus terminal on click
        document.addEventListener('click', () => {
            if (!this.isTyping) {
                this.currentLine.scrollIntoView();
            }
        });
    }

    addChar(char) {
        const cursor = this.currentLine.querySelector('.cursor');
        const commandSpan = this.currentLine.querySelector('.command') || this.createCommandSpan();
        commandSpan.textContent += char;
    }

    deletChar() {
        const commandSpan = this.currentLine.querySelector('.command');
        if (commandSpan && commandSpan.textContent.length > 0) {
            commandSpan.textContent = commandSpan.textContent.slice(0, -1);
        }
    }

    createCommandSpan() {
        const commandSpan = document.createElement('span');
        commandSpan.className = 'command';
        const cursor = this.currentLine.querySelector('.cursor');
        this.currentLine.insertBefore(commandSpan, cursor);
        return commandSpan;
    }

    handleCommand() {
        const commandSpan = this.currentLine.querySelector('.command');
        const command = commandSpan ? commandSpan.textContent.trim() : '';
        
        if (command) {
            this.commandHistory.push(command);
            this.historyIndex = this.commandHistory.length;
        }

        // Remove cursor from current line
        const cursor = this.currentLine.querySelector('.cursor');
        if (cursor) cursor.remove();

        // Execute command
        if (command) {
            this.executeCommand(command);
        } else {
            this.createNewLine();
        }
    }

    executeCommand(command) {
        const [cmd, ...args] = command.split(' ');
        const fullCommand = command.toLowerCase();
        
        if (this.commands[fullCommand]) {
            this.commands[fullCommand](args);
        } else if (this.commands[cmd]) {
            this.commands[cmd](args);
        } else {
            this.addOutput(`Command not found: ${command}. Type 'help' for available commands.`, 'error');
            this.createNewLine();
        }
    }

    async typeOutput(text, className = '', delay = 30) {
        this.isTyping = true;
        this.showTypingIndicator();
        
        const outputDiv = document.createElement('div');
        outputDiv.className = `output ${className}`;
        this.terminal.appendChild(outputDiv);

        if (text.includes('\n')) {
            // Handle multi-line text
            const lines = text.split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (i > 0) {
                    outputDiv.appendChild(document.createElement('br'));
                }
                await this.typeText(outputDiv, lines[i], delay);
            }
        } else {
            await this.typeText(outputDiv, text, delay);
        }

        this.hideTypingIndicator();
        this.isTyping = false;
        this.createNewLine();
    }

    async typeText(element, text, delay) {
        for (let char of text) {
            element.textContent += char;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    addOutput(text, className = '') {
        const outputDiv = document.createElement('div');
        outputDiv.className = `output ${className}`;
        outputDiv.textContent = text;
        this.terminal.appendChild(outputDiv);
    }

    createNewLine() {
        const newLine = document.createElement('div');
        newLine.className = 'terminal-line';
        newLine.innerHTML = '<span class="prompt">ritesh@portfolio:~$</span> <span class="cursor">|</span>';
        this.terminal.appendChild(newLine);
        this.currentLine = newLine;
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    showTypingIndicator() {
        document.getElementById('typingIndicator').style.display = 'flex';
    }

    hideTypingIndicator() {
        document.getElementById('typingIndicator').style.display = 'none';
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;

        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
        }

        const commandSpan = this.currentLine.querySelector('.command') || this.createCommandSpan();
        
        if (this.historyIndex === this.commandHistory.length) {
            commandSpan.textContent = '';
        } else {
            commandSpan.textContent = this.commandHistory[this.historyIndex];
        }
    }

    // Command implementations
    showWelcome() {
        const welcomeText = `
╔══════════════════════════════════════════════════════════════╗
║                    Welcome to Ritesh's Terminal             ║
║                                                              ║
║  🚀 Computer Science Student | App Developer | Tech Enthusiast  ║
║                                                              ║
║  Type 'help' to see available commands                      ║
║  Type 'neofetch' for system info                           ║
║  Type 'whoami' to know more about me                       ║
╚══════════════════════════════════════════════════════════════╝

Terminal initialized successfully...
Loading user profile...
Ready for commands!
`;
        this.addOutput(welcomeText, 'ascii-art');
        this.createNewLine();
    }

    async showHelp() {
        const helpText = `Available Commands:

📊 INFORMATION
  whoami           - Display user information
  about            - Brief introduction
  neofetch         - System information with ASCII art
  
🎯 SKILLS & EXPERIENCE  
  skills           - Technical skills and proficiency
  projects         - Portfolio projects
  education        - Educational background
  experience       - Work experience and internships
  achievements     - Awards and accomplishments
  
📱 CONTACT & SOCIAL
  contact          - Contact information
  
📁 FILE OPERATIONS
  ls               - List files in current directory
  ls -la           - Detailed file listing
  cat <file>       - Display file contents
  cat resume.pdf   - View resume
  pwd              - Show current directory
  tree             - Show directory structure
  
🛠️ SYSTEM COMMANDS
  date             - Current date and time
  uptime           - System uptime
  history          - Command history
  clear            - Clear terminal
  
🎉 FUN COMMANDS
  fortune          - Random inspirational quote
  cowsay <text>    - ASCII cow says something
  matrix           - Matrix digital rain effect
  hack             - Simulate hacking (just for fun!)
  sudo make-me-coffee - Try it and see!
  
Type any command to get started! 🚀`;

        await this.typeOutput(helpText, 'info');
    }

    async whoami() {
        const whoamiText = `
┌─────────────────────────────────────────────────────────┐
│                      RITESH CHAUHAN                    │
├─────────────────────────────────────────────────────────┤
│ 🎓 Computer Science Student                            │
│ 💻 Full-Stack Developer                                │
│ 📱 Mobile App Developer                                │
│ 🚀 Tech Enthusiast & Problem Solver                   │
│                                                         │
│ 🌟 Passionate about creating innovative solutions      │
│ 🔧 Always learning new technologies                    │
│ 🎯 Goal: Make technology accessible and impactful      │
└─────────────────────────────────────────────────────────┘

Current Status: Building amazing projects and seeking opportunities! 🚀`;

        await this.typeOutput(whoamiText, 'success');
    }

    async about() {
        const aboutText = `Hey there! 👋

I'm Ritesh Chauhan, a passionate Computer Science student with a love for 
creating innovative solutions through technology. My journey in tech started 
with curiosity and has evolved into a deep passion for full-stack development.

🔍 What drives me:
• Building user-centric applications that solve real problems
• Exploring new technologies and frameworks
• Contributing to open-source projects
• Continuous learning and growth

🌱 Currently focusing on:
• Advanced web development with React and Node.js
• Mobile app development
• Data structures and algorithms
• System design principles

When I'm not coding, you'll find me exploring new tech trends, reading about 
emerging technologies, or working on personal projects that challenge my skills.

Let's connect and build something amazing together! 🚀`;

        await this.typeOutput(aboutText, 'info');
    }

    async skills() {
        await this.typeOutput('Loading skills profile...', 'info', 20);
        
        const skillsData = [
            { name: 'JavaScript', level: 90 },
            { name: 'Python', level: 85 },
            { name: 'React.js', level: 88 },
            { name: 'Node.js', level: 82 },
            { name: 'HTML/CSS', level: 95 },
            { name: 'Git/GitHub', level: 87 },
            { name: 'SQL/NoSQL', level: 80 },
            { name: 'Java', level: 78 },
            { name: 'Mobile Dev', level: 75 },
            { name: 'Cloud/AWS', level: 70 }
        ];

        let skillsHTML = `
<div class="skills-container">
📊 TECHNICAL SKILLS PROFICIENCY

`;

        skillsData.forEach(skill => {
            skillsHTML += `
<div class="skill-bar">
    <span class="skill-name">${skill.name}</span>
    <div class="skill-progress">
        <div class="skill-fill" style="width: ${skill.level}%"></div>
    </div>
    <span class="skill-percentage">${skill.level}%</span>
</div>`;
        });

        skillsHTML += `
</div>

🛠️ FRAMEWORKS & TOOLS:
Express.js, MongoDB, MySQL, Firebase, Docker, VS Code, 
Figma, Postman, Jest, Webpack

🌐 CURRENTLY LEARNING:
TypeScript, GraphQL, AWS, Kubernetes, Machine Learning`;

        // Create skills display manually
        const outputDiv = document.createElement('div');
        outputDiv.className = 'output success';
        outputDiv.innerHTML = skillsHTML;
        this.terminal.appendChild(outputDiv);
        
        // Animate skill bars
        setTimeout(() => {
            const skillFills = outputDiv.querySelectorAll('.skill-fill');
            skillFills.forEach(fill => {
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.width = fill.getAttribute('style').match(/\d+/)[0] + '%';
                }, 100);
            });
        }, 500);

        this.createNewLine();
    }

    async projects() {
        const projectsText = `
🚀 FEATURED PROJECTS

┌─────────────────────────────────────────────────────────────┐
│ 1. Personal Portfolio Website                               │
│    • Responsive design with dark/light theme toggle        │
│    • Interactive animations and micro-interactions         │
│    • Backend API with authentication and file uploads      │
│    • Tech: HTML, CSS, JavaScript, Node.js, MySQL          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. E-Commerce Platform                                      │
│    • Full-stack web application with payment integration   │
│    • User authentication and product management            │
│    • Real-time inventory tracking                          │
│    • Tech: React, Node.js, MongoDB, Stripe API             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. Task Management Mobile App                              │
│    • Cross-platform mobile application                     │
│    • Offline functionality and cloud synchronization       │
│    • Collaborative features and notifications              │
│    • Tech: React Native, Firebase, Redux                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 4. Weather Dashboard                                        │
│    • Real-time weather data with beautiful visualizations  │
│    • Location-based forecasts and alerts                   │
│    • PWA with offline capabilities                         │
│    • Tech: Vue.js, Chart.js, Service Workers, Weather API  │
└─────────────────────────────────────────────────────────────┘

🔗 View all projects: github.com/ritesh-chauhan0x1
📊 Total repositories: 25+ | Stars received: 150+`;

        await this.typeOutput(projectsText, 'success');
    }

    async education() {
        const educationText = `
🎓 EDUCATIONAL BACKGROUND

┌─────────────────────────────────────────────────────────────┐
│ Bachelor of Technology - Computer Science Engineering       │
│ 📍 [Your University Name]                                  │
│ 📅 2021 - 2025 (Expected)                                  │
│ 📊 CGPA: 8.5/10                                           │
│                                                             │
│ 🏆 Key Achievements:                                       │
│ • Dean's List for Academic Excellence (3 semesters)        │
│ • Winner of Inter-College Coding Competition               │
│ • Lead developer for final year project                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Higher Secondary Education                                  │
│ 📍 [Your School Name]                                      │
│ 📅 2019 - 2021                                            │
│ 📊 Percentage: 92%                                         │
│ 🎯 Stream: Science (PCM + Computer Science)                │
└─────────────────────────────────────────────────────────────┘

📚 RELEVANT COURSEWORK:
• Data Structures and Algorithms
• Object-Oriented Programming
• Database Management Systems
• Computer Networks
• Operating Systems
• Software Engineering
• Web Development
• Mobile Application Development

🏅 CERTIFICATIONS:
• AWS Cloud Practitioner
• Google Analytics Certified
• Meta Front-End Developer Professional Certificate
• HackerRank Problem Solving (Gold Badge)`;

        await this.typeOutput(educationText, 'info');
    }

    async experience() {
        const experienceText = `
💼 PROFESSIONAL EXPERIENCE

┌─────────────────────────────────────────────────────────────┐
│ Frontend Developer Intern                                   │
│ 🏢 TechStart Solutions                                      │
│ 📅 June 2024 - August 2024                                │
│                                                             │
│ 🎯 Key Responsibilities:                                    │
│ • Developed responsive web components using React.js        │
│ • Collaborated with UI/UX team to implement designs        │
│ • Optimized application performance by 40%                 │
│ • Participated in code reviews and agile development       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Web Development Freelancer                                  │
│ 🏢 Self-Employed                                           │
│ 📅 January 2023 - Present                                  │
│                                                             │
│ 🎯 Key Projects:                                           │
│ • Built 10+ websites for small businesses                  │
│ • Developed e-commerce solutions with payment integration   │
│ • Created custom web applications for clients              │
│ • Maintained 100% client satisfaction rate                 │
└─────────────────────────────────────────────────────────────┘

🌟 VOLUNTEER EXPERIENCE:
• Coding Mentor at Local Community Center (2023-Present)
• Technical Lead for College Tech Fest (2023)
• Open Source Contributor (50+ contributions)

💡 IMPACT METRICS:
• Reduced load times by 40% across client projects
• Mentored 25+ students in web development
• Contributed to 5+ open-source projects`;

        await this.typeOutput(experienceText, 'success');
    }

    async achievements() {
        const achievementsText = `
🏆 ACHIEVEMENTS & AWARDS

🥇 CODING COMPETITIONS:
• 1st Place - Inter-College Hackathon 2024
• 2nd Place - Regional Programming Contest 2023
• Top 10 - National Coding Championship 2023
• 3rd Place - University Tech Symposium 2022

🌟 ACADEMIC HONORS:
• Dean's List of Academic Excellence (3 consecutive semesters)
• Best Final Year Project Award 2024
• Outstanding Student in Computer Science 2023
• Perfect Attendance Award 2022-2023

💻 TECHNICAL ACHIEVEMENTS:
• 1000+ problems solved on LeetCode (Rating: 1850+)
• 5-star rating in Problem Solving on HackerRank
• 25+ GitHub repositories with 150+ total stars
• Contributed to 5+ major open-source projects

🎯 LEADERSHIP & IMPACT:
• Led development team of 8 members for college project
• Organized tech workshop attended by 200+ students
• Mentored 25+ junior students in programming
• Created coding tutorial series with 10k+ views

📊 CERTIFICATIONS:
• AWS Certified Cloud Practitioner
• Google Analytics Individual Qualification
• Meta Frontend Developer Professional Certificate
• IBM Data Science Professional Certificate (In Progress)

🌐 COMMUNITY CONTRIBUTIONS:
• Active Stack Overflow contributor (Reputation: 2.5k+)
• Technical blog writer with 50+ articles
• Regular speaker at local tech meetups`;

        await this.typeOutput(achievementsText, 'success');
    }

    async contact() {
        const contactText = `
📞 CONTACT INFORMATION

┌─────────────────────────────────────────────────────────────┐
│                    LET'S CONNECT!                          │
├─────────────────────────────────────────────────────────────┤
│ 📧 Email: ritesh.chauhan@email.com                         │
│ 📱 Phone: +91 XXXXX XXXXX                                  │
│ 🌐 Portfolio: https://riteshchauhan.dev                    │
│ 📍 Location: Delhi, India                                  │
└─────────────────────────────────────────────────────────────┘

🔗 SOCIAL LINKS:
• GitHub: github.com/ritesh-chauhan0x1
• LinkedIn: linkedin.com/in/ritesh-chauhan-dev
• Twitter: @riteshchauhan0x1
• Instagram: @ritesh.codes

💬 PREFERRED CONTACT METHODS:
• Email for professional inquiries
• LinkedIn for networking
• GitHub for code collaboration
• Twitter for tech discussions

🕒 AVAILABILITY:
• Open to full-time opportunities
• Available for freelance projects
• Interested in internships and collaborations
• Response time: Within 24 hours

Feel free to reach out for:
🚀 Job opportunities
🤝 Collaboration on projects
💡 Tech discussions
📚 Mentorship opportunities

Let's build something amazing together! 🌟`;

        await this.typeOutput(contactText, 'info');
    }

    async listFiles() {
        const files = `
📁 Current Directory: /home/ritesh/portfolio

drwxr-xr-x  2 ritesh ritesh  4096 Dec 15 10:30 projects/
drwxr-xr-x  2 ritesh ritesh  4096 Dec 15 10:28 skills/
drwxr-xr-x  2 ritesh ritesh  4096 Dec 15 10:25 education/
-rw-r--r--  1 ritesh ritesh  2048 Dec 15 10:20 resume.pdf
-rw-r--r--  1 ritesh ritesh  1024 Dec 15 10:15 about.txt
-rw-r--r--  1 ritesh ritesh   512 Dec 15 10:10 contact.txt
-rw-r--r--  1 ritesh ritesh  4096 Dec 15 10:05 achievements.md
drwxr-xr-x  2 ritesh ritesh  4096 Dec 15 10:00 certificates/
drwxr-xr-x  2 ritesh ritesh  4096 Dec 15 09:55 gallery/`;

        await this.typeOutput(files, 'success');
    }

    async listFilesDetailed() {
        const detailedFiles = `
📁 Detailed Directory Listing: /home/ritesh/portfolio

total 64K
drwxr-xr-x  8 ritesh ritesh  4.0K Dec 15 10:30 .
drwxr-xr-x  3 root   root    4.0K Dec 15 09:00 ..
-rw-r--r--  1 ritesh ritesh   220 Dec 15 09:00 .bash_logout
-rw-r--r--  1 ritesh ritesh  3.7K Dec 15 09:00 .bashrc
-rw-r--r--  1 ritesh ritesh   807 Dec 15 09:00 .profile
-rw-r--r--  1 ritesh ritesh  1.2K Dec 15 10:15 about.txt
-rw-r--r--  1 ritesh ritesh  3.8K Dec 15 10:05 achievements.md
drwxr-xr-x  2 ritesh ritesh  4.0K Dec 15 10:00 certificates/
-rw-r--r--  1 ritesh ritesh   845 Dec 15 10:10 contact.txt
drwxr-xr-x  2 ritesh ritesh  4.0K Dec 15 10:25 education/
drwxr-xr-x  2 ritesh ritesh  4.0K Dec 15 09:55 gallery/
drwxr-xr-x  2 ritesh ritesh  4.0K Dec 15 10:30 projects/
-rw-r--r--  1 ritesh ritesh  2.1K Dec 15 10:20 resume.pdf
drwxr-xr-x  2 ritesh ritesh  4.0K Dec 15 10:28 skills/

💡 Permissions: r(read) w(write) x(execute)
📊 Total size: 64KB | Files: 6 | Directories: 5`;

        await this.typeOutput(detailedFiles, 'success');
    }

    async showResume() {
        const resumeText = `
📄 RESUME.PDF - RITESH CHAUHAN
═══════════════════════════════════════════════════════════════

👤 PERSONAL INFORMATION
├─ Name: Ritesh Chauhan
├─ Email: ritesh.chauhan@email.com
├─ Phone: +91 XXXXX XXXXX
├─ Location: Delhi, India
└─ Portfolio: https://riteshchauhan.dev

🎓 EDUCATION
├─ B.Tech Computer Science Engineering (2021-2025)
├─ CGPA: 8.5/10
└─ Key Subjects: DSA, DBMS, OS, Networks, Software Engineering

💻 TECHNICAL SKILLS
├─ Languages: JavaScript, Python, Java, C++, SQL
├─ Frontend: React, Vue.js, HTML5, CSS3, Bootstrap, Tailwind
├─ Backend: Node.js, Express.js, Django, Flask
├─ Database: MySQL, MongoDB, Firebase, PostgreSQL
├─ Tools: Git, Docker, AWS, VS Code, Figma
└─ Mobile: React Native, Flutter

🚀 PROJECTS
├─ Portfolio Website - Full-stack with backend API
├─ E-commerce Platform - React + Node.js + MongoDB
├─ Task Manager App - React Native + Firebase
└─ Weather Dashboard - Vue.js + Chart.js + PWA

💼 EXPERIENCE
├─ Frontend Developer Intern - TechStart Solutions (Jun-Aug 2024)
├─ Freelance Web Developer - Self-employed (Jan 2023-Present)
└─ Coding Mentor - Community Center (2023-Present)

🏆 ACHIEVEMENTS
├─ 1st Place Inter-College Hackathon 2024
├─ Dean's List Academic Excellence (3 semesters)
├─ 1000+ LeetCode problems solved
└─ 25+ GitHub repositories with 150+ stars

📧 DOWNLOAD FULL RESUME
└─ Available at: https://riteshchauhan.dev/resume.pdf

[EOF - End of File]`;

        await this.typeOutput(resumeText, 'info');
    }

    async pwd() {
        await this.typeOutput('/home/ritesh/portfolio', 'success');
    }

    async date() {
        const now = new Date();
        const dateString = now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
        await this.typeOutput(dateString, 'info');
    }

    async uptime() {
        const uptimeText = `
🕒 SYSTEM UPTIME INFORMATION

Portfolio Terminal has been running for: 42 days, 13 hours, 37 minutes
System load averages: 0.52, 0.48, 0.51

📊 PERSONAL STATS:
• Coding streak: 180+ days
• Projects completed: 25+
• Coffee consumed: ∞ cups ☕
• Lines of code written: 100,000+
• Bugs fixed: 999+ (and counting...)
• Stack Overflow visits: Daily 😅

⚡ Current status: Actively seeking opportunities!`;

        await this.typeOutput(uptimeText, 'success');
    }

    async neofetch() {
        const neofetchText = `
                   .88888888:.                    ritesh@portfolio
                  88888888.88888.                 -----------------
                .8888888888888888.                OS: Ubuntu 22.04 LTS
                888888888888888888                Host: Developer Machine
                88' _\`88'\`_ \`88888               Kernel: 5.15.0-91-generic
                88 88 88 88  88888               Uptime: 42 days, 13 hours
                88_88_::_88_:88888               Packages: 2547 (apt)
                88:::,::,:::::8888               Shell: bash 5.1.16
                88\`::::::::::'\`8888              Resolution: 1920x1080
               .88\`:::::::::::'\`888.             Terminal: VS Code Integrated
              .8888\`:::::::::'\`88888.            CPU: Intel i7-12700H (12) @ 3.5GHz
             .8888888\`::::'\`888888888.           GPU: NVIDIA GeForce RTX 3060
            .888888888\`.\`88888888888.            Memory: 8192MiB / 16384MiB
           .888888888888888888888888.            
          .888888888888888888888888888.          
         .888888888888888888888888888888.        🚀 Currently: Building awesome projects
        .88888888888888888888888888888888.       💻 Favorite Language: JavaScript
                                                 🎯 Learning: TypeScript, GraphQL
                                                 ☕ Coffee Level: Maximum`;

        await this.typeOutput(neofetchText, 'ascii-art');
    }

    async clear() {
        this.terminal.innerHTML = '';
        this.createNewLine();
    }

    async history() {
        if (this.commandHistory.length === 0) {
            await this.typeOutput('No commands in history.', 'info');
            return;
        }

        let historyText = '📜 COMMAND HISTORY:\n\n';
        this.commandHistory.forEach((cmd, index) => {
            historyText += `${index + 1}  ${cmd}\n`;
        });

        await this.typeOutput(historyText, 'info');
    }

    async makeCoffee() {
        const coffeeText = `
☕ COFFEE BREWING INITIATED...

[████████████████████████████████████████] 100%

╔════════════════════════════════════════════════╗
║                                                ║
║      ☕ PERFECT COFFEE BREWED! ☕              ║
║                                                ║
║  Ingredients:                                  ║
║  • 1 cup of motivation                         ║
║  • 2 tablespoons of determination              ║
║  • A pinch of creativity                       ║
║  • Unlimited passion for coding                ║
║                                                ║
║  Error: sudo privileges cannot brew real       ║
║  coffee. Please use physical coffee machine.   ║
║                                                ║
║  Alternative: Try 'hire ritesh' command for    ║
║  someone who can make great code AND coffee! 😉 ║
╚════════════════════════════════════════════════╝

P.S: I'd be happy to discuss opportunities over coffee! ☕`;

        await this.typeOutput(coffeeText, 'warning');
    }

    async fortune() {
        const fortunes = [
            "The best time to plant a tree was 20 years ago. The second best time is now. (Same applies to learning programming!)",
            "Your limitation—it's only your imagination. Debug your doubts!",
            "Great things never come from comfort zones. Push your code boundaries!",
            "Don't stop when you're tired. Stop when you're done. (But also remember to take breaks!)",
            "The way to get started is to quit talking and begin doing. Start coding!",
            "Innovation distinguishes between a leader and a follower. - Steve Jobs",
            "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
            "First, solve the problem. Then, write the code. - John Johnson",
            "Code never lies, comments sometimes do. - Ron Jeffries",
            "The best error message is the one that never shows up. - Thomas Fuchs"
        ];

        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        await this.typeOutput(`🔮 Fortune Cookie:\n\n"${randomFortune}"`, 'success');
    }

    async cowsay(args) {
        const message = args.join(' ') || 'Hello from Ritesh!';
        const cowText = `
 ${'-'.repeat(message.length + 2)}
< ${message} >
 ${'-'.repeat(message.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;

        await this.typeOutput(cowText, 'ascii-art');
    }

    async matrix() {
        await this.typeOutput('Initializing Matrix digital rain...', 'success', 20);
        
        const matrixText = `
⢀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⣠⣤⣶⣶
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⢰⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣀⣀⣾⣿⣿⣿⣿
⣿⣿⣿⣿⣿⡏⠉⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿
⣿⣿⣿⣿⣿⣿⠀⠀⠀⠈⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠉⠁⠀⣿
⣿⣿⣿⣿⣿⣿⣧⡀⠀⠀⠀⠀⠙⠿⠿⠿⠻⠿⠿⠟⠿⠛⠉⠀⠀⠀⠀⠀⣸⣿
⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⣴⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⢰⣹⡆⠀⠀⠀⠀⠀⠀⣭⣷⠀⠀⠀⠸⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠈⠉⠀⠀⠤⠄⠀⠀⠀⠉⠁⠀⠀⠀⠀⢿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⢾⣿⣷⠀⠀⠀⠀⡠⠤⢄⠀⠀⠀⠠⣿⣿⣷⠀⢸⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⡀⠉⠀⠀⠀⠀⠀⢄⠀⢀⠀⠀⠀⠀⠉⠉⠁⠀⠀⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿

Welcome to the Matrix, Neo...
The code is everywhere. Can you see it?

01001000 01100101 01101100 01101100 01101111
01010111 01101111 01110010 01101100 01100100

You are the chosen one... to hire Ritesh! 😉`;

        await this.typeOutput(matrixText, 'success');
    }

    async hack() {
        await this.typeOutput('Initializing hacking sequence...', 'warning', 30);
        await this.typeOutput('Scanning network...', 'warning', 50);
        await this.typeOutput('Found target: hiring_manager.exe', 'success', 40);
        await this.typeOutput('Injecting resume.payload...', 'warning', 60);
        
        const hackText = `
[████████████████████████████████████████] 100%

🎯 HACK SUCCESSFUL! 

Target: HR Database
Payload: Ritesh's Resume
Status: Successfully injected impressive qualifications!

🚨 WARNING: This candidate is too good to ignore!

Attributes modified:
• Skill_Level: EXPERT
• Enthusiasm: MAXIMUM
• Availability: IMMEDIATE
• Hiring_Recommendation: STRONGLY_ADVISED

💡 Pro tip: The only way to defend against this hack is to 
hire Ritesh immediately! 😄

System message: "This was just for fun - I'm actually a 
very ethical developer who believes in responsible coding!"`;

        await this.typeOutput(hackText, 'error');
    }

    async tree() {
        const treeText = `
📁 PORTFOLIO DIRECTORY STRUCTURE

ritesh-portfolio/
├── 📁 frontend/
│   ├── 📄 index.html
│   ├── 📄 styles.css
│   ├── 📄 script.js
│   └── 📁 assets/
│       ├── 🖼️ profile.jpg
│       ├── 🖼️ project1.png
│       └── 🖼️ project2.png
├── 📁 backend/
│   ├── 📄 server.js
│   ├── 📄 package.json
│   ├── 📁 routes/
│   │   ├── 📄 projects.js
│   │   ├── 📄 memories.js
│   │   └── 📄 photos.js
│   └── 📁 database/
│       └── 📄 setup.js
├── 📁 features/
│   ├── 📄 live-playground.html
│   ├── 📄 terminal-about.html
│   └── 📄 voice-assistant.html
├── 📄 README.md
├── 📄 .gitignore
└── 📄 LICENSE

📊 Summary: 15 files, 6 directories
💾 Total size: ~2.5 MB
🚀 Status: Ready for production!`;

        await this.typeOutput(treeText, 'success');
    }

    async exit() {
        await this.typeOutput('Thank you for visiting my terminal! 👋', 'success', 30);
        await this.typeOutput('Feel free to reach out anytime!', 'info', 30);
        await this.typeOutput('Session ending...', 'warning', 50);
        
        setTimeout(() => {
            window.close();
        }, 2000);
    }
}

// Global function to execute commands from suggestion buttons
function executeCommand(command) {
    if (window.terminal && !window.terminal.isTyping) {
        const commandSpan = window.terminal.currentLine.querySelector('.command') || 
                           window.terminal.createCommandSpan();
        commandSpan.textContent = command;
        window.terminal.handleCommand();
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new TerminalAbout();
});
