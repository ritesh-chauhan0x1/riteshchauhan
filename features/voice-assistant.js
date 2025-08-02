class VoiceAssistant {
    constructor() {
        this.isListening = false;
        this.isMuted = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.voices = [];
        this.currentVoice = null;
        
        this.conversationArea = document.getElementById('conversationArea');
        this.voiceBtn = document.getElementById('voiceBtn');
        this.muteBtn = document.getElementById('muteBtn');
        this.textInput = document.getElementById('textInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.statusText = document.getElementById('statusText');
        this.voiceIndicator = document.getElementById('voiceIndicator');
        
        this.knowledgeBase = {
            about: {
                keywords: ['about', 'who', 'introduction', 'tell me about', 'introduce'],
                responses: [
                    "I'd love to tell you about Ritesh! He's a passionate Computer Science student who loves creating innovative solutions through technology. He's particularly skilled in full-stack development and mobile app creation.",
                    "Ritesh is a tech enthusiast currently pursuing Computer Science. He's known for his problem-solving abilities and his passion for building user-centric applications that make a real impact.",
                    "Meet Ritesh Chauhan - a dedicated developer who combines technical expertise with creativity. He's always learning new technologies and working on exciting projects!"
                ]
            },
            skills: {
                keywords: ['skills', 'technologies', 'programming', 'languages', 'tech stack'],
                responses: [
                    "Ritesh has impressive technical skills! He's proficient in JavaScript, Python, React, Node.js, and database technologies. He's also experienced with mobile development and cloud platforms.",
                    "His skill set includes frontend technologies like React and Vue.js, backend development with Node.js and Express, and databases like MySQL and MongoDB. He's also learning cloud technologies like AWS.",
                    "Ritesh is well-versed in modern web technologies. JavaScript and Python are his strongest languages, and he's built several full-stack applications using React, Node.js, and various databases."
                ]
            },
            projects: {
                keywords: ['projects', 'portfolio', 'work', 'applications', 'apps'],
                responses: [
                    "Ritesh has worked on some amazing projects! His portfolio includes a full-stack e-commerce platform, a task management mobile app, and this very portfolio website with backend API integration.",
                    "Some of his notable projects include a weather dashboard with beautiful visualizations, an e-commerce platform with payment integration, and several mobile applications built with React Native.",
                    "His project portfolio showcases diverse skills - from web applications with React and Node.js to mobile apps with React Native. Each project demonstrates his ability to create complete, user-focused solutions."
                ]
            },
            contact: {
                keywords: ['contact', 'reach', 'email', 'phone', 'connect', 'hire'],
                responses: [
                    "You can reach Ritesh through his email at ritesh.chauhan@email.com, connect with him on LinkedIn, or check out his GitHub profile. He's always open to discussing new opportunities!",
                    "Ritesh is actively seeking opportunities! You can contact him via email, LinkedIn, or through his portfolio website. He typically responds within 24 hours.",
                    "Want to connect with Ritesh? He's available on multiple platforms - email, LinkedIn, GitHub, and Twitter. He'd love to hear about potential collaborations or job opportunities!"
                ]
            },
            education: {
                keywords: ['education', 'study', 'university', 'degree', 'college'],
                responses: [
                    "Ritesh is pursuing his Bachelor's degree in Computer Science Engineering with an impressive CGPA of 8.5. He's been on the Dean's List multiple times for academic excellence.",
                    "He's currently a Computer Science student with a strong academic record. His coursework covers data structures, algorithms, software engineering, and modern web technologies.",
                    "Ritesh is in his final year of Computer Science Engineering. He's excelled academically while also gaining practical experience through internships and personal projects."
                ]
            },
            achievements: {
                keywords: ['achievements', 'awards', 'accomplishments', 'recognition', 'honors'],
                responses: [
                    "Ritesh has some impressive achievements! He won first place in an inter-college hackathon, has been on the Dean's List multiple times, and has solved over 1000 problems on LeetCode.",
                    "His achievements include winning coding competitions, academic honors, and building a strong GitHub portfolio with 150+ stars. He's also mentored other students in programming.",
                    "Notable achievements include hackathon victories, academic excellence awards, and significant contributions to open-source projects. He's also received recognition for his problem-solving skills on various coding platforms."
                ]
            },
            fun: {
                keywords: ['fun fact', 'interesting', 'hobby', 'personal', 'unique'],
                responses: [
                    "Here's a fun fact: Ritesh can solve a Rubik's cube in under 2 minutes! He also loves creating mini-games and interactive demos, like the ones you might find on his portfolio.",
                    "Ritesh is not just about serious coding - he enjoys building fun projects like games and interactive tools. He once created a terminal-style interface just for fun!",
                    "Something interesting about Ritesh: he's built his own voice assistant (that's me!), loves experimenting with AI and machine learning, and has a collection of coding challenges he's solved."
                ]
            },
            why_hire: {
                keywords: ['why hire', 'unique', 'special', 'different', 'stands out'],
                responses: [
                    "What makes Ritesh special is his combination of technical skills and creativity. He doesn't just code - he creates solutions that users love. Plus, he's always learning and adapting to new technologies.",
                    "Ritesh stands out because he focuses on both technical excellence and user experience. He has a track record of completing projects successfully and is passionate about writing clean, maintainable code.",
                    "You should consider Ritesh because he brings enthusiasm, technical competence, and a problem-solving mindset. He's the kind of developer who will go the extra mile to ensure project success."
                ]
            },
            experience: {
                keywords: ['experience', 'internship', 'work experience', 'job', 'professional'],
                responses: [
                    "Ritesh has gained valuable experience through internships and freelance work. He's worked as a frontend developer intern and has built websites for multiple clients as a freelancer.",
                    "His professional experience includes a frontend development internship where he improved application performance by 40%, plus ongoing freelance work where he's maintained 100% client satisfaction.",
                    "Ritesh has hands-on experience from internships and freelance projects. He's worked on real-world applications, collaborated with teams, and delivered projects that meet client requirements."
                ]
            }
        };
        
        this.funResponses = [
            "Did you know Ritesh once debugged a program by talking to his rubber duck? It actually worked! 🦆",
            "Ritesh's code is so clean, even Marie Kondo would be proud! ✨",
            "Fun fact: Ritesh has written more 'Hello World' programs than there are stars in the sky! 🌟",
            "Ritesh can turn coffee into code more efficiently than any compiler! ☕➡️💻",
            "He's so good at problem-solving, he once fixed a bug just by staring at it intensely! 👀"
        ];
        
        this.init();
    }
    
    init() {
        this.setupSpeechRecognition();
        this.setupEventListeners();
        this.loadVoices();
        this.setupVisualizer();
    }
    
    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            this.recognition = new SpeechRecognition();
        }
        
        if (this.recognition) {
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateUI();
                this.updateStatus('Listening...');
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.handleUserInput(transcript);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.updateStatus('Sorry, I couldn\'t hear that clearly. Try again?');
                this.stopListening();
            };
            
            this.recognition.onend = () => {
                this.stopListening();
            };
        }
    }
    
    setupEventListeners() {
        this.voiceBtn.addEventListener('click', () => {
            if (this.isListening) {
                this.stopListening();
            } else {
                this.startListening();
            }
        });
        
        this.muteBtn.addEventListener('click', () => {
            this.toggleMute();
        });
        
        this.sendBtn.addEventListener('click', () => {
            const text = this.textInput.value.trim();
            if (text) {
                this.handleUserInput(text);
                this.textInput.value = '';
            }
        });
        
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendBtn.click();
            }
        });
    }
    
    loadVoices() {
        const loadVoices = () => {
            this.voices = this.synthesis.getVoices();
            // Prefer female voices for assistant
            this.currentVoice = this.voices.find(voice => 
                voice.name.includes('Female') || 
                voice.name.includes('Samantha') || 
                voice.name.includes('Karen') ||
                voice.gender === 'female'
            ) || this.voices[0];
        };
        
        loadVoices();
        this.synthesis.addEventListener('voiceschanged', loadVoices);
    }
    
    startListening() {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
        }
    }
    
    stopListening() {
        this.isListening = false;
        this.updateUI();
        this.updateStatus('Ready to assist');
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.muteBtn.classList.toggle('muted', this.isMuted);
        this.muteBtn.querySelector('.volume-icon').textContent = this.isMuted ? '🔇' : '🔊';
        this.updateStatus(this.isMuted ? 'Voice responses muted' : 'Voice responses enabled');
    }
    
    updateUI() {
        this.voiceBtn.classList.toggle('listening', this.isListening);
        this.voiceBtn.querySelector('.btn-text').textContent = 
            this.isListening ? 'Listening...' : 'Tap to speak';
        this.voiceIndicator.classList.toggle('active', this.isListening);
    }
    
    updateStatus(text) {
        this.statusText.textContent = text;
    }
    
    addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
        
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <p>${text}</p>
            </div>
            <div class="message-time">${time}</div>
        `;
        
        this.conversationArea.appendChild(messageDiv);
        this.conversationArea.scrollTop = this.conversationArea.scrollHeight;
    }
    
    handleUserInput(input) {
        this.addMessage(input, true);
        this.updateStatus('Thinking...');
        
        // Simulate thinking delay
        setTimeout(() => {
            const response = this.generateResponse(input.toLowerCase());
            this.addMessage(response);
            
            if (!this.isMuted) {
                this.speak(response);
            }
            
            this.updateStatus('Ready to assist');
        }, 1000);
    }
    
    generateResponse(input) {
        // Check for greeting
        if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
            return "Hello! I'm RIYA, Ritesh's AI assistant. I'm here to tell you all about his skills, projects, and achievements. What would you like to know?";
        }
        
        // Check for thanks
        if (input.includes('thank') || input.includes('thanks')) {
            return "You're very welcome! Is there anything else you'd like to know about Ritesh? I'm here to help!";
        }
        
        // Check for goodbye
        if (input.includes('bye') || input.includes('goodbye') || input.includes('see you')) {
            return "It was great talking with you! Don't forget to reach out to Ritesh - he'd love to hear from you. Have a wonderful day!";
        }
        
        // Check knowledge base
        for (const [category, data] of Object.entries(this.knowledgeBase)) {
            if (data.keywords.some(keyword => input.includes(keyword))) {
                const randomResponse = data.responses[Math.floor(Math.random() * data.responses.length)];
                return randomResponse;
            }
        }
        
        // Fun facts
        if (input.includes('fun') || input.includes('joke') || input.includes('funny')) {
            return this.funResponses[Math.floor(Math.random() * this.funResponses.length)];
        }
        
        // Default response
        const defaultResponses = [
            "That's an interesting question! While I focus on Ritesh's professional background, I'd suggest asking about his skills, projects, education, or how to contact him.",
            "I'd love to help you learn more about Ritesh! Try asking about his technical skills, project portfolio, achievements, or career background.",
            "Great question! I'm specifically designed to share information about Ritesh's professional journey. What aspect interests you most - his skills, projects, or experience?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    speak(text) {
        if (this.synthesis && !this.isMuted) {
            // Cancel any ongoing speech
            this.synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = this.currentVoice;
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            utterance.volume = 0.8;
            
            utterance.onstart = () => {
                this.updateStatus('Speaking...');
            };
            
            utterance.onend = () => {
                this.updateStatus('Ready to assist');
            };
            
            this.synthesis.speak(utterance);
        }
    }
    
    setupVisualizer() {
        const canvas = document.getElementById('visualizerCanvas');
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Simple particle system for voice visualization
        const particles = [];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

// Global function for suggestion chips
function askQuestion(question) {
    if (window.assistant) {
        window.assistant.handleUserInput(question);
    }
}

// Initialize assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.assistant = new VoiceAssistant();
    
    // Check for speech recognition support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        document.getElementById('statusText').textContent = 'Voice input not supported in this browser';
        document.getElementById('voiceBtn').disabled = true;
    }
    
    // Check for speech synthesis support
    if (!('speechSynthesis' in window)) {
        document.getElementById('muteBtn').style.display = 'none';
    }
});
