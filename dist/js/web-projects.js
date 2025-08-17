(()=>{document.addEventListener("DOMContentLoaded",function(){d()});function d(){c(),m(),u(),h()}function c(){let a=document.querySelectorAll(".filter-btn"),t=document.querySelectorAll(".project-card");a.forEach(s=>{s.addEventListener("click",()=>{a.forEach(e=>e.classList.remove("active")),s.classList.add("active");let i=s.dataset.filter;t.forEach(e=>{i==="all"||e.dataset.category.split(" ").includes(i)?n(e):r(e)})})})}function n(a){a.classList.remove("hidden"),a.style.display="block",setTimeout(()=>{a.style.opacity="1",a.style.transform="translateY(0)"},10)}function r(a){a.style.opacity="0",a.style.transform="translateY(20px)",setTimeout(()=>{a.classList.add("hidden"),a.style.display="none"},300)}function m(){let a=document.querySelectorAll(".btn-demo"),t=document.getElementById("demoModal"),s=document.getElementById("modalTitle"),i=document.getElementById("demoContainer");a.forEach(e=>{e.addEventListener("click",o=>{o.preventDefault();let l=e.dataset.demo;p(l)})})}function p(a){let t=document.getElementById("demoModal"),s=document.getElementById("modalTitle"),i=document.getElementById("demoContainer"),e=v(a);s.textContent=e.title,i.innerHTML=e.content,t.classList.add("active"),document.body.style.overflow="hidden"}function f(){document.getElementById("demoModal").classList.remove("active"),document.body.style.overflow="auto"}function v(a){return{netflix:{title:"Netflix Clone Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fab fa-netflix"></i> Netflix Clone</h4>
                    <p>Experience the full Netflix interface with movie browsing, trailers, and user authentication.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-film"></i>
                            <span>Movie Database Integration</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-user"></i>
                            <span>User Authentication</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-heart"></i>
                            <span>Favorites & Watchlist</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://netflix-clone-demo.netlify.app" target="_blank" class="demo-link">
                            <i class="fas fa-external-link-alt"></i> View Live Demo
                        </a>
                        <span class="demo-note">Demo credentials: demo@example.com / demo123</span>
                    </div>
                </div>
            `},youtube:{title:"YouTube Clone Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fab fa-youtube"></i> YouTube Clone</h4>
                    <p>Full-featured YouTube replica with video streaming, comments, and channel management.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-video"></i>
                            <span>Video Streaming</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-comments"></i>
                            <span>Comment System</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-search"></i>
                            <span>Advanced Search</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://youtube-clone-demo.netlify.app" target="_blank" class="demo-link">
                            <i class="fas fa-external-link-alt"></i> View Live Demo
                        </a>
                        <span class="demo-note">Full video upload and streaming functionality</span>
                    </div>
                </div>
            `},instagram:{title:"Instagram Clone Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fab fa-instagram"></i> Instagram Clone</h4>
                    <p>Social media platform with photo sharing, stories, and real-time messaging.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-camera"></i>
                            <span>Photo Sharing</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-eye"></i>
                            <span>Stories Feature</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-paper-plane"></i>
                            <span>Direct Messaging</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://instagram-clone-demo.netlify.app" target="_blank" class="demo-link">
                            <i class="fas fa-external-link-alt"></i> View Live Demo
                        </a>
                        <span class="demo-note">Test account: testuser / password123</span>
                    </div>
                </div>
            `},whatsapp:{title:"WhatsApp Clone Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fab fa-whatsapp"></i> WhatsApp Clone</h4>
                    <p>Real-time messaging application with group chats and media sharing.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-bolt"></i>
                            <span>Real-time Messaging</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-users"></i>
                            <span>Group Chats</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-file"></i>
                            <span>Media Sharing</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://whatsapp-clone-demo.netlify.app" target="_blank" class="demo-link">
                            <i class="fas fa-external-link-alt"></i> View Live Demo
                        </a>
                        <span class="demo-note">Open in multiple tabs to test real-time features</span>
                    </div>
                </div>
            `},discord:{title:"Discord Clone Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fab fa-discord"></i> Discord Clone</h4>
                    <p>Gaming communication platform with voice channels and server management.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-microphone"></i>
                            <span>Voice Channels</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-server"></i>
                            <span>Server Management</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-desktop"></i>
                            <span>Screen Sharing</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://discord-clone-demo.netlify.app" target="_blank" class="demo-link">
                            <i class="fas fa-external-link-alt"></i> View Live Demo
                        </a>
                        <span class="demo-note">Voice features require microphone permission</span>
                    </div>
                </div>
            `},ecommerce:{title:"E-Commerce Platform Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fas fa-shopping-cart"></i> E-Commerce Platform</h4>
                    <p>Complete online shopping solution with payment integration and admin dashboard.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-credit-card"></i>
                            <span>Secure Payments</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-chart-bar"></i>
                            <span>Admin Dashboard</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-truck"></i>
                            <span>Order Tracking</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://ecommerce-demo.netlify.app" target="_blank" class="demo-link">
                            <i class="fas fa-external-link-alt"></i> View Live Demo
                        </a>
                        <span class="demo-note">Use test card: 4242 4242 4242 4242</span>
                    </div>
                </div>
            `},taskmanager:{title:"Task Manager Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fas fa-tasks"></i> Advanced Task Manager</h4>
                    <p>Comprehensive productivity app with team collaboration and analytics.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-users"></i>
                            <span>Team Collaboration</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-clock"></i>
                            <span>Time Tracking</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-chart-line"></i>
                            <span>Analytics Dashboard</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://taskmanager-demo.netlify.app" target="_blank" class="demo-link">
                            <i class="fas fa-external-link-alt"></i> View Live Demo
                        </a>
                        <span class="demo-note">Demo workspace with sample projects loaded</span>
                    </div>
                </div>
            `},weather:{title:"Weather Dashboard Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fas fa-cloud-sun"></i> Weather Dashboard</h4>
                    <p>Beautiful weather app with real-time data and interactive maps.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-thermometer-half"></i>
                            <span>Real-time Weather</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-map"></i>
                            <span>Interactive Maps</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-calendar"></i>
                            <span>7-Day Forecast</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://weather-dashboard-demo.netlify.app" target="_blank" class="demo-link">
                            <i class="fas fa-external-link-alt"></i> View Live Demo
                        </a>
                        <span class="demo-note">Allow location access for personalized weather</span>
                    </div>
                </div>
            `},portfolio:{title:"Portfolio Website Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fas fa-user"></i> Personal Portfolio</h4>
                    <p>Professional portfolio with dark/light theme and smooth animations.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-moon"></i>
                            <span>Dark/Light Theme</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-magic"></i>
                            <span>Smooth Animations</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-search"></i>
                            <span>SEO Optimized</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://ritesh-portfolio-demo.netlify.app" target="_blank" class="demo-link">
                            <i class="fas fa-external-link-alt"></i> View Live Demo
                        </a>
                        <span class="demo-note">Fully responsive design with contact form</span>
                    </div>
                </div>
            `},spotify:{title:"Spotify Clone Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fab fa-spotify"></i> Spotify Clone</h4>
                    <p>Music streaming platform with playlists and recommendations.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-music"></i>
                            <span>Music Streaming</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-list"></i>
                            <span>Playlist Management</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-search"></i>
                            <span>Music Discovery</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://spotify-clone-demo.netlify.app" target="_blank" class="demo-link">
                            <i class="fas fa-external-link-alt"></i> View Live Demo
                        </a>
                        <span class="demo-note">Connect your Spotify account for full features</span>
                    </div>
                </div>
            `},blog:{title:"Blog Platform Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fas fa-blog"></i> Modern Blog Platform</h4>
                    <p>Feature-rich blogging platform with markdown editor and analytics.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-edit"></i>
                            <span>Markdown Editor</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-comments"></i>
                            <span>Comment System</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-chart-bar"></i>
                            <span>Analytics</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://blog-platform-demo.netlify.app" target="_blank" class="demo-link">
                            <i class="fas fa-external-link-alt"></i> View Live Demo
                        </a>
                        <span class="demo-note">Author login: author@demo.com / password123</span>
                    </div>
                </div>
            `},chat:{title:"Chat Application Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fas fa-comments"></i> Real-time Chat App</h4>
                    <p>Instant messaging with private and group chats, file sharing.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-bolt"></i>
                            <span>Real-time Messaging</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-file"></i>
                            <span>File Sharing</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-users"></i>
                            <span>Group Chats</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://chat-app-demo.netlify.app" target="_blank" class="demo-link">
                            <i class="fas fa-external-link-alt"></i> View Live Demo
                        </a>
                        <span class="demo-note">Open multiple windows to test real-time features</span>
                    </div>
                </div>
            `},quiz:{title:"Quiz Platform Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fas fa-question-circle"></i> Interactive Quiz Platform</h4>
                    <p>Educational quiz platform with progress tracking and analytics.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-question"></i>
                            <span>Multiple Question Types</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-chart-line"></i>
                            <span>Progress Tracking</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-trophy"></i>
                            <span>Leaderboards</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://quiz-platform-demo.netlify.app" target="_blank" class="demo-link">
                            <i class="fas fa-external-link-alt"></i> View Live Demo
                        </a>
                        <span class="demo-note">Try the JavaScript fundamentals quiz</span>
                    </div>
                </div>
            `},recipe:{title:"Recipe Finder Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fas fa-utensils"></i> Recipe Discovery App</h4>
                    <p>Find recipes by ingredients with nutritional information and meal planning.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-search"></i>
                            <span>Ingredient Search</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-chart-pie"></i>
                            <span>Nutrition Info</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Meal Planning</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://recipe-finder-demo.netlify.app" target="_blank" class="demo-link">
                            <i class="fas fa-external-link-alt"></i> View Live Demo
                        </a>
                        <span class="demo-note">Search for recipes using ingredients you have</span>
                    </div>
                </div>
            `}}[a]||{title:"Project Demo",content:`
            <div class="demo-preview">
                <h4>Demo Coming Soon</h4>
                <p>This project demo is currently being prepared. Check back soon!</p>
                <div class="demo-actions">
                    <span class="demo-note">Demo will be available shortly</span>
                </div>
            </div>
        `}}function u(){let a=document.getElementById("loadMoreBtn");!1||(a.style.display="none"),a.addEventListener("click",()=>{a.innerHTML='<i class="fas fa-spinner fa-spin"></i> Loading...',setTimeout(()=>{a.innerHTML='<i class="fas fa-plus"></i> Load More Projects'},1e3)})}function h(){let a={threshold:.1,rootMargin:"0px 0px -50px 0px"},t=new IntersectionObserver(s=>{s.forEach(i=>{i.isIntersecting&&(i.target.style.animationDelay=`${Math.random()*.3}s`,i.target.classList.add("animate-in"))})},a);document.querySelectorAll(".project-card").forEach(s=>{t.observe(s)})}window.closeDemoModal=f;})();
