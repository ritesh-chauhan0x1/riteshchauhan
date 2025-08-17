(()=>{var d=class{constructor(){this.particles=[],this.mouse={x:0,y:0},this.windowCenter={x:window.innerWidth/2,y:window.innerHeight/2},this.init()}init(){this.setupLoadingScreen(),this.createParticles(),this.setupMouseTracking(),this.setup3DInteractions(),this.setupAnimatedCounters(),this.setupScrollAnimations(),this.setupProfileCardInteractions(),this.enhanceButtons()}setupLoadingScreen(){setTimeout(()=>{let e=document.getElementById("loading-screen");e&&(e.style.opacity="0",e.style.transform="scale(0.8)",setTimeout(()=>{e.style.display="none",this.revealContentWith3D()},500))},2500)}revealContentWith3D(){let e=document.querySelector(".hero-section"),t=document.querySelector(".profile-card-3d");e&&(e.style.opacity="0",e.style.transform="translateY(50px) rotateX(10deg)",setTimeout(()=>{e.style.transition="all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",e.style.opacity="1",e.style.transform="translateY(0) rotateX(0deg)"},100)),t&&setTimeout(()=>{t.style.opacity="1",t.style.transform="translateY(0) rotateY(0deg)"},400)}createParticles(){let e=document.querySelector(".particles-container");if(e){for(let t=0;t<50;t++){let o=document.createElement("div");o.className="particle";let n=Math.random()*4+2,s=Math.random()*window.innerWidth,r=Math.random()*window.innerHeight,a=Math.random()*.5+.1;o.style.cssText=`
                position: absolute;
                left: ${s}px;
                top: ${r}px;
                width: ${n}px;
                height: ${n}px;
                background: rgba(255, 255, 255, ${a});
                border-radius: 50%;
                pointer-events: none;
                transition: transform 0.3s ease;
            `,e.appendChild(o),this.particles.push({element:o,x:s,y:r,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5,originalX:s,originalY:r})}this.animateParticles()}}animateParticles(){this.particles.forEach(e=>{e.x+=e.vx,e.y+=e.vy,(e.x<=0||e.x>=window.innerWidth)&&(e.vx*=-1),(e.y<=0||e.y>=window.innerHeight)&&(e.vy*=-1);let t=this.mouse.x-e.x,o=this.mouse.y-e.y,n=Math.sqrt(t*t+o*o);if(n<100){let s=(100-n)/100;e.x-=t*s*.01,e.y-=o*s*.01}e.element.style.transform=`translate(${e.x}px, ${e.y}px)`}),requestAnimationFrame(()=>this.animateParticles())}setupMouseTracking(){document.addEventListener("mousemove",e=>{this.mouse.x=e.clientX,this.mouse.y=e.clientY;let t=(e.clientX-this.windowCenter.x)/this.windowCenter.x,o=(e.clientY-this.windowCenter.y)/this.windowCenter.y,n=document.querySelector(".hero-content");if(n){let r=o*5,a=t*5;n.style.transform=`perspective(1000px) rotateX(${-r}deg) rotateY(${a}deg)`}let s=document.querySelector(".profile-card-3d");if(s){let r=o*10,a=t*10;s.style.transform=`perspective(1000px) rotateX(${-r}deg) rotateY(${a}deg) translateZ(50px)`}}),document.addEventListener("mouseleave",()=>{let e=document.querySelector(".hero-content"),t=document.querySelector(".profile-card-3d");e&&(e.style.transform="perspective(1000px) rotateX(0deg) rotateY(0deg)"),t&&(t.style.transform="perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(50px)")})}setup3DInteractions(){document.querySelectorAll(".stat-item, .featured-project").forEach(t=>{t.addEventListener("mouseenter",o=>{o.target.style.transform="perspective(1000px) rotateX(-5deg) rotateY(5deg) translateZ(20px)"}),t.addEventListener("mousemove",o=>{let n=o.target.getBoundingClientRect(),s=o.clientX-n.left,r=o.clientY-n.top,a=n.width/2,i=n.height/2,c=(r-i)/i*10,l=(a-s)/a*10;o.target.style.transform=`perspective(1000px) rotateX(${c}deg) rotateY(${l}deg) translateZ(20px)`}),t.addEventListener("mouseleave",o=>{o.target.style.transform="perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)"})})}setupAnimatedCounters(){let e=document.querySelectorAll(".stat-number"),t=(n,s)=>{let r=s/50,a=0,i=setInterval(()=>{a+=r,a>=s&&(a=s,clearInterval(i)),n.textContent=Math.floor(a)+(s>=100?"+":""),n.style.transform="scale(1.1)",setTimeout(()=>{n.style.transform="scale(1)"},100)},50)},o=new IntersectionObserver(n=>{n.forEach(s=>{if(s.isIntersecting){let r=s.target,a=parseInt(r.getAttribute("data-target")||r.textContent);t(r,a),o.unobserve(r)}})});e.forEach(n=>{n.setAttribute("data-target",parseInt(n.textContent)),n.textContent="0",o.observe(n)})}setupScrollAnimations(){let e=new IntersectionObserver(n=>{n.forEach(s=>{s.isIntersecting&&s.target.classList.add("animate-in")})},{threshold:.1});document.querySelectorAll(".stats-section, .featured-work, .cta-section").forEach(n=>{n.style.opacity="0",n.style.transform="translateY(50px) rotateX(10deg)",e.observe(n)});let o=document.createElement("style");o.textContent=`
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) rotateX(0deg) !important;
                transition: all 1s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
        `,document.head.appendChild(o)}setupProfileCardInteractions(){let e=document.querySelector(".profile-card-3d");e&&(e.addEventListener("mouseenter",()=>{e.style.transform="perspective(1000px) rotateY(10deg) rotateX(-5deg) translateZ(50px)",e.style.boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)"}),e.addEventListener("mouseleave",()=>{e.style.transform="perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(50px)",e.style.boxShadow="0 10px 20px rgba(0, 0, 0, 0.2)"}),setInterval(()=>{let t=Math.sin(Date.now()*.001)*10;e.style.transform+=` translateY(${t}px)`},50))}enhanceButtons(){document.querySelectorAll(".cta-btn, .btn-3d").forEach(o=>{o.addEventListener("click",n=>{let s=document.createElement("span"),r=o.getBoundingClientRect(),a=Math.max(r.width,r.height),i=n.clientX-r.left-a/2,c=n.clientY-r.top-a/2;s.style.cssText=`
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    left: ${i}px;
                    top: ${c}px;
                    width: ${a}px;
                    height: ${a}px;
                `,o.appendChild(s),setTimeout(()=>{s.remove()},600)}),o.addEventListener("mouseenter",()=>{o.style.transform="perspective(1000px) rotateX(-5deg) translateZ(10px)"}),o.addEventListener("mouseleave",()=>{o.style.transform="perspective(1000px) rotateX(0deg) translateZ(0px)"})});let t=document.createElement("style");t.textContent=`
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `,document.head.appendChild(t)}handleResize(){this.windowCenter={x:window.innerWidth/2,y:window.innerHeight/2},this.particles.forEach(e=>{e.x>window.innerWidth&&(e.x=window.innerWidth),e.y>window.innerHeight&&(e.y=window.innerHeight)})}};document.addEventListener("DOMContentLoaded",function(){setTimeout(()=>{window.homePage=new d,window.addEventListener("resize",()=>{window.homePage&&window.homePage.handleResize()})},100)});(navigator.hardwareConcurrency<4||navigator.connection?.effectiveType==="slow-2g")&&document.documentElement.style.setProperty("--reduce-motion","1");var m=class{constructor(){this.initGallery(),this.initImageInteractions(),this.initParallaxEffects()}initGallery(){document.querySelectorAll(".gallery-card").forEach((t,o)=>{t.style.animationDelay=`${o*.2}s`,t.addEventListener("mousemove",n=>{if(window.innerWidth<768)return;let s=t.getBoundingClientRect(),r=n.clientX-s.left,a=n.clientY-s.top,i=s.width/2,c=s.height/2,l=(a-c)/10,h=(i-r)/10;t.style.transform=`
                    translateY(-15px) 
                    rotateX(${l}deg) 
                    rotateY(${h}deg) 
                    scale(1.02)
                `}),t.addEventListener("mouseleave",()=>{t.style.transform=""}),t.addEventListener("click",()=>{this.expandImage(t)})})}initImageInteractions(){document.querySelectorAll(".gallery-image").forEach(t=>{t.addEventListener("load",()=>{t.style.opacity="0",t.style.transform="scale(1.1)",setTimeout(()=>{t.style.transition="all 0.6s ease",t.style.opacity="1",t.style.transform="scale(1)"},100)}),t.addEventListener("error",()=>{let o=t.closest(".image-container");o.innerHTML=`
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, var(--accent), var(--primary-color)); color: white;">
                        <div style="text-align: center;">
                            <i class="fas fa-image" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.7;"></i>
                            <p>Image Loading...</p>
                        </div>
                    </div>
                `})})}initParallaxEffects(){let e=document.querySelector(".gallery-section");e&&window.addEventListener("scroll",()=>{let t=window.pageYOffset,o=e.getBoundingClientRect();if(o.top<window.innerHeight&&o.bottom>0){let s=t*.5;e.style.transform=`translateY(${s*.1}px)`,document.querySelectorAll(".highlight-item").forEach((a,i)=>{let c=i*.1,l=Math.sin(t*.01+c)*5;a.style.transform=`translateY(${l}px)`})}})}expandImage(e){let t=e.querySelector(".gallery-image"),o=e.querySelector(".image-overlay"),n=document.createElement("div");n.className="image-modal",n.innerHTML=`
            <div class="modal-backdrop">
                <div class="modal-content">
                    <img src="${t.src}" alt="${t.alt}" class="modal-image">
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="modal-info">
                        <h4>${e.querySelector("h5").textContent}</h4>
                        <p>${o.querySelector("p").textContent}</p>
                    </div>
                </div>
            </div>
        `;let s=`
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: modalFadeIn 0.3s ease;
            }
            
            .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }
            
            .modal-content {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
                background: var(--card-background);
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
            }
            
            .modal-image {
                width: 100%;
                height: auto;
                max-height: 70vh;
                object-fit: contain;
                display: block;
            }
            
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover {
                background: rgba(0, 0, 0, 0.9);
                transform: scale(1.1);
            }
            
            .modal-info {
                padding: 1.5rem;
                text-align: center;
            }
            
            @keyframes modalFadeIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
        `;if(!document.querySelector("#modal-styles")){let i=document.createElement("style");i.id="modal-styles",i.textContent=s,document.head.appendChild(i)}document.body.appendChild(n);let r=()=>{n.style.animation="modalFadeIn 0.3s ease reverse",setTimeout(()=>{document.body.removeChild(n)},300)};n.querySelector(".modal-close").addEventListener("click",r),n.querySelector(".modal-backdrop").addEventListener("click",i=>{i.target===i.currentTarget&&r()});let a=i=>{i.key==="Escape"&&(r(),document.removeEventListener("keydown",a))};document.addEventListener("keydown",a)}};document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{new m},500)});})();
