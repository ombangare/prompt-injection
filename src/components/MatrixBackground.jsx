import React, { useEffect, useRef } from 'react';

export default function MatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const chars = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF{}<>/;=+*#$%_'.split('');
    let cols, drops, fontSize;
    let intervalId;

    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      fontSize = window.innerWidth < 700 ? 14 : 16;
      cols = Math.floor(canvas.width / fontSize);
      drops = new Array(cols).fill(0).map(() => Math.random() * -50);
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(4,4,5,0.16)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < cols; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const isGlitch = Math.random() < 0.015;
        ctx.fillStyle = isGlitch ? '#ff1f1f' : (Math.random() < 0.06 ? '#eafff2' : '#19ff6e');
        ctx.globalAlpha = isGlitch ? 0.95 : 0.7;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      ctx.globalAlpha = 1;
    };

    setup();
    window.addEventListener('resize', setup);
    intervalId = setInterval(draw, 50);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', setup);
    };
  }, []);

  return <canvas ref={canvasRef} id="matrix-bg" style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.35, pointerEvents: 'none' }} />;
}
