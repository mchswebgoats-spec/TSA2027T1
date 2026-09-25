'use strict';
(() => {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let stars = [], width = 0, height = 0, last = 0;
  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(160, Math.round(width * height / 7500));
    stars = Array.from({length: count}, () => ({x: Math.random()*width,y: Math.random()*height,r: .35+Math.random()*1.25,v: .9+Math.random()*3.6,phase: Math.random()*6.28}));
    draw(0);
  }
  function draw(time) {
    context.clearRect(0,0,width,height);
    stars.forEach(star => {
      const opacity = .27 + .48 * (.5 + .5 * Math.sin(time*.0007 + star.phase));
      context.fillStyle = `rgba(207,225,255,${opacity})`;
      context.beginPath();context.arc(star.x,star.y,star.r,0,Math.PI*2);context.fill();
    });
  }
  function frame(time) {
    const delta = Math.min((time-last)/1000 || 0,.05);last=time;
    if (!reduced.matches) {stars.forEach(star => {star.y+=star.v*delta;if(star.y>height+2){star.y=-2;star.x=Math.random()*width}});draw(time);requestAnimationFrame(frame)}
  }
  window.addEventListener('resize',resize,{passive:true});
  reduced.addEventListener('change',() => {if(!reduced.matches){last=0;requestAnimationFrame(frame)}else draw(0)});
  resize();if(!reduced.matches)requestAnimationFrame(frame);
})();
