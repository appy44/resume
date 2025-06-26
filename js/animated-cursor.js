
(function () {
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.id = 'cursor-dot';
  ring.id = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.top = `${mouseY}px`;
    dot.style.left = `${mouseX}px`;
  });

  function animate() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    const deltaX = mouseX - ringX;
    const deltaY = mouseY - ringY;
    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min(Math.hypot(deltaX, deltaY), 12);

    ring.style.top = `${ringY}px`;
    ring.style.left = `${ringX}px`;
    ring.style.transform = `translate(-50%, -50%) rotate(${angle}rad) scaleX(${1 + distance * 0.03}) scaleY(${1 - distance * 0.01})`;

    requestAnimationFrame(animate);
  }

  animate();
})();
