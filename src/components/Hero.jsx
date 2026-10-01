import React, { useState, useEffect, useRef } from 'react';
import mediaManager from '../utils/MediaController';

export default function Hero({ onRegisterClick }) {
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', mins: '00', secs: '00' });
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      mediaManager.register('hero', videoRef.current);
    }

    const handleVideoChange = () => {
      if (videoRef.current) {
        setIsVideoMuted(videoRef.current.muted);
      }
    };

    window.addEventListener('active-video-change', handleVideoChange);

    return () => {
      mediaManager.unregister('hero');
      window.removeEventListener('active-video-change', handleVideoChange);
    };
  }, []);

  useEffect(() => {
    const target = new Date('2026-10-07T13:00:00+05:30').getTime();
    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({
          days: String(days).padStart(2, '0'),
          hours: String(hours).padStart(2, '0'),
          mins: String(mins).padStart(2, '0'),
          secs: String(secs).padStart(2, '0')
        });
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const toggleVideoSound = () => {
    mediaManager.toggleMute('hero');
    if (videoRef.current) {
      setIsVideoMuted(videoRef.current.muted);
    }
  };

  const handleDetonation = () => {
    if (window.trigger3DGlitch) window.trigger3DGlitch(3.5);
    document.body.classList.add('blood-alert');
    setTimeout(() => document.body.classList.remove('blood-alert'), 3000);
  };

  return (
    <section className="hero" id="hero" data-video-id="hero">
      <div className="hero-grid">
        {/* LEFT COLUMN: Hero Copy & Actions */}
        <div style={{ textAlign: 'left', minWidth: 0 }}>
          <div className="hero-kicker" style={{ textAlign: 'left' }}>AI GenX Club presents</div>
          <h1 className="hero-title" style={{ textAlign: 'left' }}>
            <span className="glitch" data-text="PROMPT://INJECTION">PROMPT://INJECTION</span>
          </h1>
          <p className="hero-sub" style={{ margin: '0 0 1.8rem 0', textAlign: 'left' }}>
            Decode the machine's mind. Then build something a real business could ship.
            Three rounds, one breach: reverse-engineer secret AI prompts online, build live on 5 surprise themes on campus, and battle in the flagship finals.
          </p>

          {/* ZERO-DAY COUNTDOWN */}
          <div className="countdown-box" style={{ maxWidth: '440px', margin: '0 0 2rem 0' }}>
            <div className="clock-label">
              <div style={{ color: 'var(--red)', fontSize: '0.85rem' }}>REGISTRATION</div>
              <div>CLOSES IN</div>
            </div>
            <div className="countdown-digits">
              <div className="countdown-unit">
                <div className="val">{timeLeft.days}</div>
                <div className="lbl">Days</div>
              </div>
              <div className="countdown-unit">
                <div className="val">{timeLeft.hours}</div>
                <div className="lbl">Hours</div>
              </div>
              <div className="countdown-unit">
                <div className="val">{timeLeft.mins}</div>
                <div className="lbl">Mins</div>
              </div>
              <div className="countdown-unit">
                <div className="val">{timeLeft.secs}</div>
                <div className="lbl">Secs</div>
              </div>
            </div>
          </div>

          {/* 3D TACTILE HERO ACTIONS */}
          <div className="hero-actions" style={{ justifyContent: 'flex-start', margin: '0 0 2rem 0' }}>
            <button onClick={onRegisterClick} className="btn btn-primary">
              <span>Lock Your Slot &rarr;</span>
            </button>
            <a
              href="#terminal"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-ghost"
            >
              <span>Open Terminal</span>
            </a>
            <button onClick={handleDetonation} className="btn btn-green">
              <span>Trigger Detonation ⚡</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Cinematic Holographic Video Entity */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '520px', margin: '0 auto', minWidth: 0 }}>
          <div className="cyber-video-frame">
            {/* Corner HUD Markers */}
            <div style={{ position: 'absolute', top: '12px', left: '14px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red)', display: 'inline-block', boxShadow: '0 0 8px var(--red)' }}></span>
              <span style={{ fontSize: '0.72rem', color: 'var(--red)', letterSpacing: '0.12em', fontWeight: 700 }}>
                FILE_00 // AI ENTITY ACTIVE
              </span>
            </div>

            {/* Audio Toggle Button */}
            <button
              onClick={toggleVideoSound}
              style={{
                position: 'absolute',
                top: '10px',
                right: '12px',
                zIndex: 10,
                background: isVideoMuted ? 'rgba(0,0,0,0.7)' : 'rgba(25, 255, 110, 0.2)',
                border: isVideoMuted ? '1px solid var(--line-blood)' : '1px solid var(--green)',
                color: isVideoMuted ? 'var(--red)' : 'var(--green)',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.08em',
                backdropFilter: 'blur(6px)'
              }}
            >
              {isVideoMuted ? '🔇 UNMUTE AUDIO' : '🔊 AUDIO LIVE'}
            </button>

            {/* Video Player with Watermark-free Cropping */}
            <video
              ref={videoRef}
              src="/assets/welcome.mp4"
              autoPlay
              muted={isVideoMuted}
              playsInline
              className="cyber-video-element"
            />

            {/* Bottom Holographic HUD Bar */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '8px 14px',
              background: 'linear-gradient(180deg, transparent, rgba(4, 4, 5, 0.95))',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.7rem',
              color: 'var(--ink-dim)'
            }}>
              <span>TRANSMISSION: ONLINE</span>
              <span style={{ color: 'var(--green)' }}>LATENT SYNCHRONIZED</span>
            </div>
          </div>
        </div>
      </div>

      {/* EVENT METADATA FOOTER */}
      <div className="hero-meta reveal in" style={{ width: '100%', maxWidth: 'var(--maxw)', marginTop: '3.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="hero-meta-item">
          <div>REGISTRATION DEADLINE</div>
          <strong>07 OCT, 1:00 PM</strong>
        </div>
        <div className="hero-meta-item">
          <div>ROUND 01 (ONLINE)</div>
          <strong>07 OCT (4 PM) - 08 OCT (6 PM)</strong>
        </div>
        <div className="hero-meta-item">
          <div>ROUND 02 (IN COLLEGE)</div>
          <strong>10 OCT (10 AM - 1:30 PM)</strong>
        </div>
        <div className="hero-meta-item">
          <div>ROUND 03 (MAIN EVENT)</div>
          <strong>12 OCT, 11 AM ONWARDS</strong>
        </div>
      </div>
    </section>
  );
}
