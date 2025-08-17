(()=>{var i=class{constructor(){this.currentPage=this.getCurrentPageName(),this.init()}init(){this.setupNavigation(),this.setupThemeToggle(),this.setupMobileMenu(),this.highlightActiveMenu(),this.setupSocialLinks(),this.initializeTheme()}getCurrentPageName(){let e=window.location.pathname,a=e.split("/").pop();return a==="index.html"||a===""||e==="/"?"home":a.replace(".html","")}setupNavigation(){document.querySelector(".navbar")||this.createNavigation();let a=document.querySelectorAll(".nav-link");a.forEach(t=>{t.addEventListener("click",n=>{a.forEach(o=>o.classList.remove("active")),n.target.classList.add("active")})})}createNavigation(){let e=document.createElement("nav");e.className="navbar",e.innerHTML=`
            <div class="nav-container">
                <a href="index.html" class="nav-brand">Ritesh Chauhan</a>
                <ul class="nav-menu" id="nav-menu">
                    <li class="nav-item">
                        <a href="index.html" class="nav-link" data-page="home">Home</a>
                    </li>
                    <li class="nav-item">
                        <a href="about.html" class="nav-link" data-page="about">About</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a href="career.html" class="nav-link" data-page="career">
                            Career <i class="fas fa-chevron-down dropdown-icon"></i>
                        </a>
                        <ul class="dropdown-menu">
                            <li><a href="career.html#internship" class="dropdown-link">Internship</a></li>
                            <li><a href="career.html#experience" class="dropdown-link">Job Experience</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a href="education.html" class="nav-link" data-page="education">
                            Education <i class="fas fa-chevron-down dropdown-icon"></i>
                        </a>
                        <ul class="dropdown-menu">
                            <li><a href="education.html#school" class="dropdown-link">School</a></li>
                            <li><a href="education.html#college" class="dropdown-link">College</a></li>
                            <li><a href="education.html#university" class="dropdown-link">University</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a href="achievements.html" class="nav-link" data-page="achievements">
                            Achievements <i class="fas fa-chevron-down dropdown-icon"></i>
                        </a>
                        <ul class="dropdown-menu">
                            <li><a href="certification.html" class="dropdown-link">Certificates</a></li>
                            <li><a href="awards.html" class="dropdown-link">Awards</a></li>
                            <li><a href="achievements.html#recognition" class="dropdown-link">Recognition</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="contact.html" class="nav-link" data-page="contact">Contact</a>
                    </li>
                </ul>
                <div class="nav-toggle" id="nav-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `,document.body.insertBefore(e,document.body.firstChild),this.setupDropdownMenus()}highlightActiveMenu(){document.querySelectorAll(".nav-link").forEach(a=>{let t=a.getAttribute("data-page");a.classList.remove("active"),t===this.currentPage&&a.classList.add("active")})}setupMobileMenu(){let e=document.getElementById("nav-toggle"),a=document.getElementById("nav-menu");e&&a&&(e.addEventListener("click",()=>{e.classList.toggle("active"),a.classList.toggle("active")}),document.querySelectorAll(".nav-link, .dropdown-link").forEach(n=>{n.addEventListener("click",()=>{e.classList.remove("active"),a.classList.remove("active")})}))}setupDropdownMenus(){let e=document.querySelectorAll(".nav-item.dropdown");e.forEach(a=>{let t=a.querySelector(".dropdown-menu"),n;a.addEventListener("mouseenter",()=>{clearTimeout(n),t.classList.add("show"),a.querySelector(".dropdown-icon").style.transform="rotate(180deg)"}),a.addEventListener("mouseleave",()=>{n=setTimeout(()=>{t.classList.remove("show"),a.querySelector(".dropdown-icon").style.transform="rotate(0deg)"},150)}),a.querySelector(".nav-link").addEventListener("click",c=>{if(window.innerWidth<=768){c.preventDefault();let r=t.classList.contains("show");e.forEach(l=>{l.querySelector(".dropdown-menu").classList.remove("show"),l.querySelector(".dropdown-icon").style.transform="rotate(0deg)"}),r||(t.classList.add("show"),a.querySelector(".dropdown-icon").style.transform="rotate(180deg)")}})}),document.addEventListener("click",a=>{a.target.closest(".nav-item.dropdown")||e.forEach(t=>{t.querySelector(".dropdown-menu").classList.remove("show"),t.querySelector(".dropdown-icon").style.transform="rotate(0deg)"})})}setupThemeToggle(){let e=document.querySelector(".theme-toggle");e||(e=document.createElement("div"),e.className="theme-toggle",e.innerHTML='<i class="fas fa-moon" id="theme-icon"></i>',document.body.appendChild(e)),e.addEventListener("click",()=>{this.toggleTheme()})}toggleTheme(){let e=document.body,a=document.getElementById("theme-icon");e.classList.contains("theme-dark")?(e.classList.remove("theme-dark"),a&&(a.className="fas fa-moon"),localStorage.setItem("portfolioTheme","light")):(e.classList.add("theme-dark"),a&&(a.className="fas fa-sun"),localStorage.setItem("portfolioTheme","dark"))}initializeTheme(){let e=localStorage.getItem("portfolioTheme"),a=document.body,t=document.getElementById("theme-icon");e==="dark"?(a.classList.add("theme-dark"),t&&(t.className="fas fa-sun")):(a.classList.remove("theme-dark"),t&&(t.className="fas fa-moon"))}setupSocialLinks(){let e=document.querySelector(".social-nav");e||(e=document.createElement("nav"),e.className="social-nav",e.innerHTML=`
                <a href="https://instagram.com/riteshchauhan_15" class="social-link instagram" target="_blank" title="Instagram">
                    <i class="fab fa-instagram"></i>
                </a>
                <a href="https://www.facebook.com/share/16oEJ9HJ6q/" class="social-link facebook" target="_blank" title="Facebook">
                    <i class="fab fa-facebook-f"></i>
                </a>
                <a href="https://github.com/ritesh-chauhan0x1" class="social-link github" target="_blank" title="GitHub">
                    <i class="fab fa-github"></i>
                </a>
                <a href="https://leetcode.com/u/riteshchauhn_15/" class="social-link leetcode" target="_blank" title="LeetCode">
                    <span class="leetcode-text">LC</span>
                </a>
                <a href="https://wa.me/+919337940768" class="social-link whatsapp" target="_blank" title="WhatsApp">
                    <i class="fab fa-whatsapp"></i>
                </a>
                <a href="mailto:22054368@kiit.ac.in" class="social-link gmail" target="_blank" title="Gmail">
                    <i class="far fa-envelope"></i>
                </a>
            `,document.body.appendChild(e)),document.querySelectorAll(".social-link").forEach(t=>{t.addEventListener("mouseenter",function(){this.style.transform="translateY(-3px) scale(1.1)"}),t.addEventListener("mouseleave",function(){this.style.transform="translateY(0) scale(1)"})})}animateContent(){let e=document.querySelector(".main-content");e&&e.classList.add("fade-in")}};document.addEventListener("DOMContentLoaded",function(){window.portfolioBase=new i,window.portfolioBase.animateContent()});document.addEventListener("keydown",function(s){(s.key==="t"||s.key==="T")&&window.portfolioBase&&window.portfolioBase.toggleTheme()});})();
