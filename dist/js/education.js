(()=>{var n=class{constructor(){this.init()}init(){this.setupAnimations(),this.setupInteractiveElements()}setupAnimations(){let a=document.querySelectorAll(".education-card"),o={threshold:.2,rootMargin:"0px 0px -50px 0px"},s=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&(t.target.style.opacity="1",t.target.style.transform="translateX(0)")})},o);a.forEach((e,t)=>{e.style.opacity="0",e.style.transform=t%2===0?"translateX(-50px)":"translateX(50px)",e.style.transition=`all 0.8s ease ${t*.2}s`,s.observe(e)})}setupInteractiveElements(){document.querySelectorAll(".education-icon").forEach(e=>{e.addEventListener("mouseenter",()=>{e.style.transform="scale(1.1) rotate(5deg)",e.style.transition="all 0.3s ease"}),e.addEventListener("mouseleave",()=>{e.style.transform="scale(1) rotate(0deg)"})}),document.querySelectorAll(".highlight").forEach(e=>{e.addEventListener("click",()=>{e.style.animation="highlightPulse 0.5s ease",setTimeout(()=>{e.style.animation=""},500)})});let s=document.createElement("style");s.textContent=`
            @keyframes highlightPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `,document.head.appendChild(s)}};document.addEventListener("DOMContentLoaded",function(){setTimeout(()=>{window.educationPage=new n},100)});})();
