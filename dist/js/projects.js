(()=>{var o=class{constructor(){this.projects=[],this.currentFilter="all",this.init()}init(){this.loadProjects(),this.setupFilterButtons(),this.setupProjectModal(),this.renderProjects()}loadProjects(){this.projects=[{id:1,title:"E-Commerce Platform",description:"A full-stack e-commerce solution with React frontend and Node.js backend",longDescription:"Complete e-commerce platform with user authentication, product catalog, shopping cart, payment integration, and admin dashboard.",image:"./1.jpeg",technologies:["React","Node.js","MongoDB","Stripe","Express"],category:"web",status:"completed",liveUrl:"https://example.com",githubUrl:"https://github.com/ritesh-chauhan0x1/ecommerce",features:["User Authentication","Payment Gateway","Admin Dashboard","Responsive Design"]},{id:2,title:"Task Management App",description:"A mobile-first task management application with real-time updates",longDescription:"Collaborative task management app with real-time updates, team collaboration features, and intuitive drag-and-drop interface.",image:"./2.jpeg",technologies:["React Native","Firebase","Redux","TypeScript"],category:"mobile",status:"completed",liveUrl:"https://example.com",githubUrl:"https://github.com/ritesh-chauhan0x1/taskapp",features:["Real-time Updates","Team Collaboration","Drag & Drop","Push Notifications"]},{id:3,title:"Weather API Service",description:"RESTful API service providing weather data with caching and rate limiting",longDescription:"Scalable weather API service with advanced caching strategies, rate limiting, and comprehensive documentation.",image:"./3.jpeg",technologies:["Python","FastAPI","Redis","PostgreSQL","Docker"],category:"api",status:"completed",githubUrl:"https://github.com/ritesh-chauhan0x1/weather-api",features:["RESTful Design","Caching Layer","Rate Limiting","Auto Documentation"]},{id:4,title:"Code Generator Tool",description:"CLI tool for generating boilerplate code for various frameworks",longDescription:"Command-line tool that generates boilerplate code for React, Vue, Node.js projects with customizable templates.",image:"./1.jpeg",technologies:["Node.js","Commander.js","Handlebars","Jest"],category:"tools",status:"in-progress",githubUrl:"https://github.com/ritesh-chauhan0x1/code-generator",features:["Multiple Templates","CLI Interface","Customizable","Cross-platform"]},{id:5,title:"Portfolio Website",description:"Responsive portfolio website with dark mode and smooth animations",longDescription:"Personal portfolio website showcasing projects, skills, and experience with modern design principles.",image:"./2.jpeg",technologies:["HTML5","CSS3","JavaScript","GSAP"],category:"web",status:"completed",liveUrl:"https://riteshchauhan.com.np",githubUrl:"https://github.com/ritesh-chauhan0x1/portfolio",features:["Responsive Design","Dark Mode","Smooth Animations","SEO Optimized"]},{id:6,title:"Machine Learning Dashboard",description:"Interactive dashboard for visualizing ML model performance and data insights",longDescription:"Comprehensive dashboard for machine learning practitioners to visualize model performance, data insights, and training metrics.",image:"./3.jpeg",technologies:["Python","Streamlit","Pandas","Plotly","Scikit-learn"],category:"web",status:"planned",githubUrl:"https://github.com/ritesh-chauhan0x1/ml-dashboard",features:["Interactive Charts","Model Comparison","Data Visualization","Export Reports"]}]}setupFilterButtons(){let e=document.querySelectorAll(".filter-btn");e.forEach(a=>{a.addEventListener("click",t=>{e.forEach(s=>s.classList.remove("active")),t.target.classList.add("active"),this.currentFilter=t.target.getAttribute("data-filter"),this.renderProjects()})})}renderProjects(){let e=document.getElementById("projects-grid");e&&(e.innerHTML=`
            <div class="projects-loading">
                <div class="loading-spinner"></div>
                <p>Loading projects...</p>
            </div>
        `,setTimeout(()=>{let a=this.currentFilter==="all"?this.projects:this.projects.filter(t=>t.category===this.currentFilter);if(e.innerHTML="",a.length===0){e.innerHTML=`
                    <div class="no-projects">
                        <i class="fas fa-folder-open"></i>
                        <h3>No projects found</h3>
                        <p>No projects match the selected filter.</p>
                    </div>
                `;return}a.forEach((t,s)=>{let i=this.createProjectCard(t);e.appendChild(i),setTimeout(()=>{i.style.opacity="1",i.style.transform="translateY(0)"},s*100)})},500))}createProjectCard(e){let a=document.createElement("div");a.className="project-card",a.style.opacity="0",a.style.transform="translateY(20px)",a.style.transition="all 0.5s ease";let t=e.status==="completed"?"":e.status==="in-progress"?"in-progress":"planned";return a.innerHTML=`
            <div class="project-image">
                <img src="${e.image}" alt="${e.title}" loading="lazy">
            </div>
            <div class="project-content">
                <h3 class="project-title">${e.title}</h3>
                <p class="project-description">${e.description}</p>
                <div class="project-tech">
                    ${e.technologies.map(s=>`<span class="tech-tag">${s}</span>`).join("")}
                </div>
                <div class="project-links">
                    <div class="project-actions">
                        ${e.liveUrl?`<a href="${e.liveUrl}" class="project-link btn-primary" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>`:""}
                        <a href="${e.githubUrl}" class="project-link btn-outline" target="_blank">
                            <i class="fab fa-github"></i> Code
                        </a>
                    </div>
                    <div class="project-status">
                        <span class="status-dot ${t}"></span>
                        ${e.status.charAt(0).toUpperCase()+e.status.slice(1).replace("-"," ")}
                    </div>
                </div>
            </div>
        `,a.addEventListener("click",s=>{s.target.closest("a")||this.showProjectModal(e)}),a}setupProjectModal(){if(!document.getElementById("project-modal")){let e=document.createElement("div");e.id="project-modal",e.className="project-modal",e.innerHTML=`
                <div class="modal-content">
                    <button class="modal-close" id="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="modal-body" id="modal-body">
                        <!-- Modal content will be inserted here -->
                    </div>
                </div>
            `,document.body.appendChild(e),document.getElementById("modal-close").addEventListener("click",()=>this.closeProjectModal()),e.addEventListener("click",t=>{t.target===e&&this.closeProjectModal()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&this.closeProjectModal()})}}showProjectModal(e){let a=document.getElementById("project-modal"),t=document.getElementById("modal-body");t.innerHTML=`
            <div class="modal-project-header">
                <img src="${e.image}" alt="${e.title}">
                <div class="modal-project-info">
                    <h2>${e.title}</h2>
                    <p>${e.longDescription}</p>
                </div>
            </div>
            <div class="modal-project-details">
                <div class="modal-section">
                    <h3>Technologies Used</h3>
                    <div class="project-tech">
                        ${e.technologies.map(s=>`<span class="tech-tag">${s}</span>`).join("")}
                    </div>
                </div>
                <div class="modal-section">
                    <h3>Key Features</h3>
                    <ul class="features-list">
                        ${e.features.map(s=>`<li><i class="fas fa-check"></i> ${s}</li>`).join("")}
                    </ul>
                </div>
                <div class="modal-section">
                    <h3>Project Links</h3>
                    <div class="modal-links">
                        ${e.liveUrl?`<a href="${e.liveUrl}" class="btn-primary" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>`:""}
                        <a href="${e.githubUrl}" class="btn-outline" target="_blank">
                            <i class="fab fa-github"></i> View Code
                        </a>
                    </div>
                </div>
            </div>
        `,a.classList.add("active"),document.body.style.overflow="hidden"}closeProjectModal(){document.getElementById("project-modal").classList.remove("active"),document.body.style.overflow="auto"}setupSearch(){let e=document.createElement("input");e.type="text",e.placeholder="Search projects...",e.className="project-search";let a=document.querySelector(".filter-tabs");a.parentNode.insertBefore(e,a),e.addEventListener("input",t=>{let s=t.target.value.toLowerCase();this.filterProjectsBySearch(s)})}filterProjectsBySearch(e){document.querySelectorAll(".project-card").forEach(t=>{let s=t.querySelector(".project-title").textContent.toLowerCase(),i=t.querySelector(".project-description").textContent.toLowerCase(),r=Array.from(t.querySelectorAll(".tech-tag")).map(n=>n.textContent.toLowerCase()).join(" ");s.includes(e)||i.includes(e)||r.includes(e)?(t.style.display="block",t.classList.remove("hidden")):(t.style.display="none",t.classList.add("hidden"))})}};document.addEventListener("DOMContentLoaded",function(){setTimeout(()=>{window.projectsPage=new o},100)});})();
