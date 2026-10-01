// Matrix-style falling code rain — green with rare hot-red glitches.
(function () {
  const canvas = document.getElementById('matrix-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const chars = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF{}<>/;=+*#$%_'.split('');
  let cols, drops, fontSize;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    fontSize = window.innerWidth < 700 ? 14 : 16;
    cols = Math.floor(canvas.width / fontSize);
    drops = new Array(cols).fill(0).map(() => Math.random() * -50);
  }

  function draw() {
    ctx.fillStyle = 'rgba(6,6,7,0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < cols; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const isGlitch = Math.random() < 0.012; // rare hot-red flicker
      ctx.fillStyle = isGlitch ? '#ff2b2b' : (Math.random() < 0.05 ? '#eafff2' : '#19ff6e');
      ctx.globalAlpha = isGlitch ? 0.9 : 0.75;
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    ctx.globalAlpha = 1;
  }

  setup();
  window.addEventListener('resize', setup);

  if (!prefersReduced) {
    setInterval(draw, 55);
  } else {
    // static single frame for reduced-motion users
    draw();
  }
})();
