(()=>{document.addEventListener("DOMContentLoaded",function(){d()});function d(){c(),p(),u(),h()}function c(){let a=document.querySelectorAll(".filter-btn"),o=document.querySelectorAll(".project-card");a.forEach(s=>{s.addEventListener("click",()=>{a.forEach(e=>e.classList.remove("active")),s.classList.add("active");let i=s.dataset.filter;o.forEach(e=>{i==="all"||e.dataset.category.split(" ").includes(i)?n(e):r(e)})})})}function n(a){a.classList.remove("hidden"),a.style.display="block",setTimeout(()=>{a.style.opacity="1",a.style.transform="translateY(0)"},10)}function r(a){a.style.opacity="0",a.style.transform="translateY(20px)",setTimeout(()=>{a.classList.add("hidden"),a.style.display="none"},300)}function p(){let a=document.querySelectorAll(".btn-demo"),o=document.getElementById("demoModal"),s=document.getElementById("modalTitle"),i=document.getElementById("demoContainer");a.forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();let l=e.dataset.demo;f(l)})})}function f(a){let o=document.getElementById("demoModal"),s=document.getElementById("modalTitle"),i=document.getElementById("demoContainer"),e=v(a);s.textContent=e.title,i.innerHTML=e.content,o.classList.add("active"),document.body.style.overflow="hidden"}function m(){document.getElementById("demoModal").classList.remove("active"),document.body.style.overflow="auto"}function v(a){return{"whatsapp-mobile":{title:"WhatsApp Mobile Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fab fa-whatsapp"></i> WhatsApp Clone Mobile</h4>
                    <p>Experience the full mobile messaging experience with real-time chat, voice messages, and video calls.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-comment"></i>
                            <span>Real-time Messaging</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-microphone"></i>
                            <span>Voice Messages</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-video"></i>
                            <span>Video Calls</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-users"></i>
                            <span>Group Chats</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://expo.dev/@ritesh-chauhan/whatsapp-clone" target="_blank" class="demo-link">
                            <i class="fas fa-mobile-alt"></i> Try on Mobile (Expo)
                        </a>
                        <span class="demo-note">Scan QR code with Expo Go app to test on your device</span>
                    </div>
                </div>
            `},"instagram-mobile":{title:"Instagram Mobile Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fab fa-instagram"></i> Instagram Clone Mobile</h4>
                    <p>Full-featured social media app with photo sharing, stories, and live streaming.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-camera"></i>
                            <span>Photo/Video Sharing</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-eye"></i>
                            <span>Stories & Reels</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-filter"></i>
                            <span>Camera Filters</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-broadcast-tower"></i>
                            <span>Live Streaming</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://expo.dev/@ritesh-chauhan/instagram-clone" target="_blank" class="demo-link">
                            <i class="fas fa-mobile-alt"></i> Try on Mobile (Expo)
                        </a>
                        <span class="demo-note">Camera permissions required for full functionality</span>
                    </div>
                </div>
            `},"tiktok-mobile":{title:"TikTok Mobile Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fab fa-tiktok"></i> TikTok Clone Mobile</h4>
                    <p>Short-form video sharing app with AI-powered feed and video editing tools.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-video"></i>
                            <span>Video Recording</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-robot"></i>
                            <span>AI-Powered Feed</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-magic"></i>
                            <span>Video Effects</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-music"></i>
                            <span>Music Integration</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://expo.dev/@ritesh-chauhan/tiktok-clone" target="_blank" class="demo-link">
                            <i class="fas fa-mobile-alt"></i> Try on Mobile (Expo)
                        </a>
                        <span class="demo-note">Swipe up/down to browse videos, record with camera</span>
                    </div>
                </div>
            `},"uber-mobile":{title:"Uber Mobile Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fas fa-car"></i> Uber Clone Mobile</h4>
                    <p>Complete ride-sharing app with real-time GPS tracking and driver matching.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Real-time Tracking</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-search"></i>
                            <span>Driver Matching</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-credit-card"></i>
                            <span>Payment Integration</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-history"></i>
                            <span>Trip History</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://expo.dev/@ritesh-chauhan/uber-clone" target="_blank" class="demo-link">
                            <i class="fas fa-mobile-alt"></i> Try on Mobile (Expo)
                        </a>
                        <span class="demo-note">Location permissions required for GPS functionality</span>
                    </div>
                </div>
            `},"spotify-mobile":{title:"Spotify Mobile Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fab fa-spotify"></i> Spotify Clone Mobile</h4>
                    <p>Full-featured music streaming app with offline downloads and personalized playlists.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-music"></i>
                            <span>Music Streaming</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-download"></i>
                            <span>Offline Downloads</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-list"></i>
                            <span>Playlist Management</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-podcast"></i>
                            <span>Podcasts</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://github.com/ritesh-chauhan0x1/spotify-flutter/releases" target="_blank" class="demo-link">
                            <i class="fas fa-download"></i> Download APK
                        </a>
                        <span class="demo-note">Flutter app - install APK on Android or build for iOS</span>
                    </div>
                </div>
            `},"weather-mobile":{title:"Weather Mobile Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fas fa-cloud-sun"></i> Advanced Weather App</h4>
                    <p>Beautiful weather app with animated backgrounds and detailed forecasts.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-thermometer-half"></i>
                            <span>Animated UI</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-map"></i>
                            <span>Weather Maps</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>Severe Alerts</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-th"></i>
                            <span>Home Widgets</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://github.com/ritesh-chauhan0x1/weather-flutter/releases" target="_blank" class="demo-link">
                            <i class="fas fa-download"></i> Download APK
                        </a>
                        <span class="demo-note">Allow location access for personalized weather data</span>
                    </div>
                </div>
            `},"ecommerce-mobile":{title:"E-Commerce Mobile Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fas fa-shopping-bag"></i> E-Commerce Mobile App</h4>
                    <p>Complete shopping experience with AR try-on and secure payments.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-cube"></i>
                            <span>AR Try-On</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-lock"></i>
                            <span>Secure Payments</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-truck"></i>
                            <span>Order Tracking</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-star"></i>
                            <span>Product Reviews</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://expo.dev/@ritesh-chauhan/ecommerce-app" target="_blank" class="demo-link">
                            <i class="fas fa-mobile-alt"></i> Try on Mobile (Expo)
                        </a>
                        <span class="demo-note">Test card: 4242 4242 4242 4242 for payments</span>
                    </div>
                </div>
            `},"fitness-mobile":{title:"Fitness Tracker Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fas fa-running"></i> Fitness Tracker App</h4>
                    <p>Comprehensive fitness app with workout tracking and social challenges.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-dumbbell"></i>
                            <span>Workout Tracking</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-apple-alt"></i>
                            <span>Nutrition Logging</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-chart-line"></i>
                            <span>Progress Analytics</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-trophy"></i>
                            <span>Social Challenges</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://fitness-tracker-demo.ionic.io" target="_blank" class="demo-link">
                            <i class="fas fa-globe"></i> Try Web Version
                        </a>
                        <span class="demo-note">Connect fitness trackers for automatic data sync</span>
                    </div>
                </div>
            `},"news-mobile":{title:"News Mobile Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fas fa-newspaper"></i> Personalized News App</h4>
                    <p>AI-powered news app with personalized feeds and offline reading.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-robot"></i>
                            <span>AI Personalization</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-download"></i>
                            <span>Offline Reading</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-bell"></i>
                            <span>Push Notifications</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-share"></i>
                            <span>Social Sharing</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://github.com/ritesh-chauhan0x1/news-flutter/releases" target="_blank" class="demo-link">
                            <i class="fas fa-download"></i> Download APK
                        </a>
                        <span class="demo-note">Personalized feed learns from your reading habits</span>
                    </div>
                </div>
            `},"food-delivery":{title:"Food Delivery Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fas fa-utensils"></i> Food Delivery App</h4>
                    <p>Complete food delivery platform with restaurant discovery and real-time tracking.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-search"></i>
                            <span>Restaurant Discovery</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-route"></i>
                            <span>Real-time Tracking</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-store"></i>
                            <span>Multi-vendor Support</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-star"></i>
                            <span>Review System</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://expo.dev/@ritesh-chauhan/food-delivery" target="_blank" class="demo-link">
                            <i class="fas fa-mobile-alt"></i> Try on Mobile (Expo)
                        </a>
                        <span class="demo-note">Use demo location for testing restaurant listings</span>
                    </div>
                </div>
            `},"task-manager-mobile":{title:"Task Manager Mobile Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fas fa-tasks"></i> Task Manager Mobile</h4>
                    <p>Advanced task management with team collaboration and analytics.</p>
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
                            <i class="fas fa-calendar-alt"></i>
                            <span>Calendar Sync</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-chart-bar"></i>
                            <span>Analytics</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://task-manager-mobile.ionic.io" target="_blank" class="demo-link">
                            <i class="fas fa-globe"></i> Try Web Version
                        </a>
                        <span class="demo-note">Sync across all devices with cloud storage</span>
                    </div>
                </div>
            `},"crypto-tracker":{title:"Crypto Tracker Demo",content:`
                <div class="demo-preview">
                    <h4><i class="fab fa-bitcoin"></i> Crypto Portfolio Tracker</h4>
                    <p>Native cryptocurrency tracking with real-time prices and portfolio management.</p>
                    <div class="demo-features">
                        <div class="demo-feature">
                            <i class="fas fa-chart-line"></i>
                            <span>Real-time Prices</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-briefcase"></i>
                            <span>Portfolio Tracking</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-bell"></i>
                            <span>Price Alerts</span>
                        </div>
                        <div class="demo-feature">
                            <i class="fas fa-chart-area"></i>
                            <span>Advanced Charts</span>
                        </div>
                    </div>
                    <div class="demo-actions">
                        <a href="https://github.com/ritesh-chauhan0x1/crypto-tracker/releases" target="_blank" class="demo-link">
                            <i class="fas fa-download"></i> Download APK
                        </a>
                        <span class="demo-note">Native Android/iOS app with offline data caching</span>
                    </div>
                </div>
            `}}[a]||{title:"App Demo",content:`
            <div class="demo-preview">
                <h4>Mobile Demo Coming Soon</h4>
                <p>This mobile app demo is currently being prepared. Check back soon!</p>
                <div class="demo-actions">
                    <span class="demo-note">Demo will be available on App Store and Google Play</span>
                </div>
            </div>
        `}}function u(){let a=document.getElementById("loadMoreBtn");!1||(a.style.display="none"),a.addEventListener("click",()=>{a.innerHTML='<i class="fas fa-spinner fa-spin"></i> Loading...',setTimeout(()=>{a.innerHTML='<i class="fas fa-plus"></i> Load More Apps'},1e3)})}function h(){let a={threshold:.1,rootMargin:"0px 0px -50px 0px"},o=new IntersectionObserver(s=>{s.forEach(i=>{i.isIntersecting&&(i.target.style.animationDelay=`${Math.random()*.3}s`,i.target.classList.add("animate-in"))})},a);document.querySelectorAll(".project-card").forEach(s=>{o.observe(s)})}window.closeDemoModal=m;})();
