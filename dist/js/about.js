(()=>{var c=class{constructor(){this.init()}init(){this.setupAnimations(),this.setupImageGallery(),this.setupSkillsAnimation(),this.setupTimelineAnimation(),this.setupInteractiveElements(),this.setupImageZoom(),this.setupProfessionalFeatures()}setupAnimations(){let s={threshold:.1,rootMargin:"0px 0px -50px 0px"},t=new IntersectionObserver(a=>{a.forEach(n=>{n.isIntersecting&&(n.target.style.opacity="1",n.target.style.transform="translateY(0)",n.target.querySelectorAll(".skill-tag, .achievement-card, .timeline-item").forEach((l,r)=>{setTimeout(()=>{l.style.opacity="1",l.style.transform="translateY(0)"},r*100)}))})},s);document.querySelectorAll(".profile-section, .about-content, .content-section, .image-gallery").forEach(a=>{a.style.opacity="0",a.style.transform="translateY(30px)",a.style.transition="all 0.6s ease",t.observe(a)}),document.querySelectorAll(".skill-tag, .achievement-card, .timeline-item").forEach(a=>{a.style.opacity="0",a.style.transform="translateY(20px)",a.style.transition="all 0.4s ease"})}setupImageGallery(){let s=document.querySelectorAll(".gallery-item"),t=document.querySelector(".profile-image");s.forEach((e,o)=>{let a=e.querySelector(".gallery-img");e.addEventListener("click",()=>{this.openImageModal(a.src,`Professional Photo ${o+2}`)}),e.setAttribute("data-title",`Professional Photo ${o+2}`)}),t&&t.addEventListener("click",()=>{let e=t.querySelector("img");this.openImageModal(e.src,"Ritesh Chauhan - Professional Photo")}),this.createImageModal()}createImageModal(){let s=document.createElement("div");s.className="image-modal",s.innerHTML=`
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <img class="modal-image" src="" alt="">
                <div class="modal-caption"></div>
            </div>
        `,document.body.appendChild(s);let t=document.createElement("style");t.textContent=`
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .image-modal.active {
                display: flex;
                opacity: 1;
            }

            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                cursor: pointer;
            }

            .modal-content {
                position: relative;
                margin: auto;
                max-width: 90%;
                max-height: 90%;
                display: flex;
                flex-direction: column;
                align-items: center;
                z-index: 1001;
            }

            .modal-close {
                position: absolute;
                top: -50px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 0.5rem;
                transition: color 0.3s ease;
            }

            .modal-close:hover {
                color: var(--accent);
            }

            .modal-image {
                max-width: 100%;
                max-height: 80vh;
                object-fit: contain;
                border-radius: 10px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }

            .modal-caption {
                color: white;
                text-align: center;
                margin-top: 1rem;
                font-size: 1.1rem;
                font-weight: 500;
            }
        `,document.head.appendChild(t);let e=s.querySelector(".modal-overlay"),o=s.querySelector(".modal-close");e.addEventListener("click",()=>this.closeImageModal()),o.addEventListener("click",()=>this.closeImageModal()),document.addEventListener("keydown",a=>{a.key==="Escape"&&s.classList.contains("active")&&this.closeImageModal()})}openImageModal(s,t){let e=document.querySelector(".image-modal"),o=e.querySelector(".modal-image"),a=e.querySelector(".modal-caption");o.src=s,a.textContent=t,e.classList.add("active"),document.body.style.overflow="hidden"}closeImageModal(){document.querySelector(".image-modal").classList.remove("active"),document.body.style.overflow=""}setupSkillsAnimation(){document.querySelectorAll(".skill-tag").forEach(e=>{e.addEventListener("click",()=>{e.style.animation="skillPulse 0.5s ease",setTimeout(()=>{e.style.animation=""},500)}),e.addEventListener("mouseenter",()=>{e.style.transform="translateY(-2px) scale(1.05)"}),e.addEventListener("mouseleave",()=>{e.style.transform="translateY(0) scale(1)"})});let t=document.createElement("style");t.textContent=`
            @keyframes skillPulse {
                0% { transform: translateY(-2px) scale(1); }
                50% { transform: translateY(-2px) scale(1.15); }
                100% { transform: translateY(-2px) scale(1); }
            }
        `,document.head.appendChild(t)}setupTimelineAnimation(){let s=document.querySelectorAll(".timeline-item"),t=new IntersectionObserver(e=>{e.forEach(o=>{o.isIntersecting&&(o.target.style.opacity="1",o.target.style.transform="translateX(0)")})},{threshold:.3});s.forEach((e,o)=>{e.style.opacity="0",e.style.transform="translateX(-30px)",e.style.transition=`all 0.6s ease ${o*.2}s`,t.observe(e)})}setupInteractiveElements(){document.querySelectorAll(".detail-item").forEach(e=>{e.addEventListener("click",()=>{let o=e.querySelector("span").textContent;(o.includes("@")||o.includes("+"))&&navigator.clipboard.writeText(o).then(()=>{this.showToast("Copied to clipboard!")}).catch(()=>{console.log("Could not copy to clipboard")})})}),document.querySelectorAll(".achievement-card").forEach(e=>{e.addEventListener("mouseenter",()=>{let o=e.querySelector(".achievement-icon");o.style.transform="scale(1.1) rotate(5deg)"}),e.addEventListener("mouseleave",()=>{let o=e.querySelector(".achievement-icon");o.style.transform="scale(1) rotate(0deg)"})})}setupImageZoom(){document.querySelectorAll(".profile-image img, .gallery-img").forEach(t=>{t.addEventListener("mouseenter",()=>{t.style.cursor="zoom-in"})})}showToast(s){let t=document.querySelector(".toast-notification");t&&t.remove();let e=document.createElement("div");e.className="toast-notification",e.textContent=s;let o=document.createElement("style");o.textContent=`
            .toast-notification {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: var(--accent);
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
                font-weight: 500;
            }

            .toast-notification.show {
                opacity: 1;
                transform: translateY(0);
            }
        `,document.head.appendChild(o),document.body.appendChild(e),setTimeout(()=>{e.classList.add("show")},100),setTimeout(()=>{e.classList.remove("show"),setTimeout(()=>{e.remove()},300)},3e3)}setupSectionNavigation(){let s=document.querySelectorAll(".content-section"),t=document.createElement("div");t.className="section-navigation",t.innerHTML=`
            <div class="nav-dots">
                ${Array.from(s).map((n,i)=>`<div class="nav-dot" data-section="${i}"></div>`).join("")}
            </div>
        `,document.body.appendChild(t);let e=document.createElement("style");e.textContent=`
            .section-navigation {
                position: fixed;
                right: 2rem;
                top: 50%;
                transform: translateY(-50%);
                z-index: 100;
            }

            .nav-dots {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .nav-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: rgba(var(--accent-rgb), 0.3);
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .nav-dot:hover,
            .nav-dot.active {
                background: var(--accent);
                transform: scale(1.2);
            }

            @media (max-width: 768px) {
                .section-navigation {
                    display: none;
                }
            }
        `,document.head.appendChild(e);let o=document.querySelectorAll(".nav-dot");o.forEach((n,i)=>{n.addEventListener("click",()=>{s[i].scrollIntoView({behavior:"smooth"})})});let a=new IntersectionObserver(n=>{n.forEach(i=>{if(i.isIntersecting){let l=Array.from(s).indexOf(i.target);o.forEach(r=>r.classList.remove("active")),o[l]&&o[l].classList.add("active")}})},{threshold:.5});s.forEach(n=>a.observe(n))}setupProfessionalFeatures(){this.setupContactInteractions(),this.setupSkillInteractions(),this.setupProfessionalAnimations(),this.setupSectionNavigation()}setupContactInteractions(){document.querySelectorAll(".detail-item").forEach(t=>{let o=t.querySelector("span").textContent;(o.includes("@")||o.includes("+91"))&&(t.style.cursor="pointer",t.title=`Click to copy ${o}`,t.addEventListener("click",()=>{navigator.clipboard.writeText(o).then(()=>{this.showToast(`${o} copied to clipboard!`),t.style.background="var(--accent)",t.style.color="white",setTimeout(()=>{t.style.background="",t.style.color=""},1e3)}).catch(()=>{this.showToast("Failed to copy to clipboard")})}))})}setupSkillInteractions(){document.querySelectorAll(".skill-tag").forEach(t=>{t.addEventListener("click",()=>{t.style.animation="skillPulse 0.6s ease-out",setTimeout(()=>{t.style.animation=""},600);let e=t.textContent;this.showToast(`${e} - One of my key technical skills!`)})})}setupProfessionalAnimations(){let s=document.querySelectorAll(".achievement-card"),t=new IntersectionObserver(e=>{e.forEach((o,a)=>{o.isIntersecting&&setTimeout(()=>{o.target.style.opacity="1",o.target.style.transform="translateY(0) scale(1)"},a*100)})},{threshold:.3});s.forEach(e=>{e.style.opacity="0",e.style.transform="translateY(30px) scale(0.95)",e.style.transition="all 0.6s ease",t.observe(e)})}};document.addEventListener("DOMContentLoaded",function(){setTimeout(()=>{window.aboutPage=new c},100)});})();
