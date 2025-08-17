(()=>{var i=class{constructor(){this.init()}init(){this.setupTimelineAnimations(),this.setupInteractiveElements()}setupTimelineAnimations(){let l=document.querySelectorAll(".timeline-item"),n={threshold:.3,rootMargin:"0px 0px -50px 0px"},t=new IntersectionObserver(e=>{e.forEach(s=>{s.isIntersecting&&(s.target.style.opacity="1",s.target.style.transform="translateY(0)")})},n);l.forEach((e,s)=>{e.style.opacity="0",e.style.transform="translateY(50px)",e.style.transition=`all 0.8s ease ${s*.2}s`,t.observe(e)})}setupInteractiveElements(){document.querySelectorAll(".skill-tag").forEach(t=>{t.addEventListener("click",()=>{t.style.animation="skillPulse 0.5s ease",setTimeout(()=>{t.style.animation=""},500)})});let n=document.createElement("style");n.textContent=`
            @keyframes skillPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `,document.head.appendChild(n)}};document.addEventListener("DOMContentLoaded",function(){setTimeout(()=>{window.careerPage=new i},100)});})();
