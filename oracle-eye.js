'use strict';
(() => {
  const camera = document.querySelector('.oracle-camera');
  const pupil = document.querySelector('.oracle-pupil');
  if (!camera || !pupil) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let desiredX = 0, desiredY = 0, currentX = 0, currentY = 0, frameId = 0;
  function animate() {
    currentX += (desiredX - currentX) * .16;
    currentY += (desiredY - currentY) * .16;
    pupil.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;
    if (Math.abs(desiredX-currentX)+Math.abs(desiredY-currentY)>.15) frameId=requestAnimationFrame(animate);
    else frameId=0;
  }
  function aim(x,y) {
    if (reduced.matches) return;
    const rect = camera.getBoundingClientRect();
    const lensX = rect.left + rect.width*.73;
    const lensY = rect.top + rect.height*.65;
    const dx=x-lensX, dy=y-lensY;
    const length=Math.hypot(dx,dy)||1;
    const distance=Math.min(rect.width*.022,Math.hypot(dx,dy)*.035);
    desiredX=dx/length*distance;
    desiredY=dy/length*distance;
    if (!frameId) frameId=requestAnimationFrame(animate);
  }
  window.addEventListener('pointermove',event=>aim(event.clientX,event.clientY),{passive:true});
  document.addEventListener('pointerleave',()=>{desiredX=desiredY=0;if(!frameId)frameId=requestAnimationFrame(animate)});
  reduced.addEventListener('change',()=>{if(reduced.matches){desiredX=desiredY=0;if(!frameId)frameId=requestAnimationFrame(animate)}});
})();
