// Vanilla ClickSpark: draws radial spark lines on a full-screen canvas when the user clicks.
(function(){
  const DURATION = 420; // ms
  const SPARKS_PER_CLICK = 10;
  const SPARK_LENGTH = 18;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  function resize(){
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.ceil(window.innerWidth * dpr);
    canvas.height = Math.ceil(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];

  function rand(min,max){ return Math.random()*(max-min)+min }

  function spawn(x,y){
    const now = performance.now();
    for(let i=0;i<SPARKS_PER_CLICK;i++){
      const angle = (Math.PI*2)*(i/SPARKS_PER_CLICK) + rand(-0.2,0.2);
      particles.push({
        x, y,
        angle,
        start: now,
        color: `hsl(${Math.floor(rand(0,360))} 90% 60%)`,
        length: rand(SPARK_LENGTH*0.6, SPARK_LENGTH*1.2),
      });
    }
  }

  function tick(now){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      const t = (now - p.start)/DURATION;
      if(t>=1){ particles.splice(i,1); continue }
      const ease = 1 - Math.pow(1-t,2);
      const dist = p.length * ease * 1.6;
      const opacity = 1 - t;
      const x1 = p.x;
      const y1 = p.y;
      const x2 = x1 + Math.cos(p.angle)*dist;
      const y2 = y1 + Math.sin(p.angle)*dist;
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1,y1);
      ctx.lineTo(x2,y2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  document.addEventListener('click', function(e){
    spawn(e.clientX, e.clientY);
  }, {passive:true});

  // Expose a small API
  window.ClickSpark = { spawn };
})();
