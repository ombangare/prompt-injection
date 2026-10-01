import React, { useState } from 'react';
import { toggleAudioState, playKeyClick } from '../utils/AudioEngine';
import mediaManager from '../utils/MediaController';

export default function Navbar({ activePage, setActivePage }) {
  const [audioActive, setAudioActive] = useState(true);
  const [crtActive, setCrtActive] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAudioToggle = () => {
    const newState = toggleAudioState();
    setAudioActive(newState);
  };

  const handleCrtToggle = () => {
    document.body.classList.toggle('no-crt');
    setCrtActive(!document.body.classList.contains('no-crt'));
    playKeyClick();
  };

  const navTo = (page, anchor) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    playKeyClick();
    if (page === 'home' && anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        mediaManager.playAudioOnce(anchor);
      }, 60);
    } else if (page === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      mediaManager.playAudioOnce('hero');
    } else if (page === 'team') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => mediaManager.playAudioOnce('team'), 100);
    } else if (page === 'register') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => mediaManager.playAudioOnce('register'), 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Biohazard Bar */}
      <div className="biohazard-bar">
        <div className="biohazard-track">
          <span>⚠️ BIO-DIGITAL HORROR DETECTED</span>
          <span>• REVERSE PROMPT ENGINEERING • SPEED BUILD SPRINT</span>
          <span>• AI GENX CLUB PRESENTS: PROMPT://INJECTION 2026</span>
          <span>• ON-CAMPUS OFFLINE ISOLATION GRID</span>
          <span>⚠️ DO NOT DISCONNECT UNTIL DECRYPTED</span>
          <span>⚠️ BIO-DIGITAL HORROR DETECTED</span>
          <span>• REVERSE PROMPT ENGINEERING • SPEED BUILD SPRINT</span>
        </div>
      </div>

      <header className="site-nav">
        <div className="nav-logo" onClick={() => navTo('home')} style={{ cursor: 'pointer' }}>
          <span className="dot">&gt;</span>PROMPT<span style={{ color: 'var(--ink-faint)' }}>://</span>INJECTION
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="nav-toggle" 
          onClick={() => { playKeyClick(); setMobileMenuOpen(!mobileMenuOpen); }} 
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Mobile Backdrop Overlay */}
        {mobileMenuOpen && (
          <div 
            className="mobile-nav-backdrop active" 
            onClick={() => setMobileMenuOpen(false)} 
          />
        )}

        {/* Navigation Links & Controls */}
        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          {/* Mobile Drawer Header */}
          <div className="mobile-drawer-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--red)', fontWeight: 700, letterSpacing: '0.12em' }}>
              <span className="pulse" style={{ width: '8px', height: '8px', background: 'var(--red)', borderRadius: '50%' }}></span>
              SYSTEM DIRECTORY
            </div>
            <button 
              className="drawer-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <a
            href="#home"
            className={activePage === 'home' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); navTo('home'); }}
          >
            <span className="nav-num">01 //</span> Home
          </a>
          <a
            href="#terminal"
            onClick={(e) => { e.preventDefault(); navTo('home', 'terminal'); }}
          >
            <span className="nav-num">02 //</span> Terminal
          </a>
          <a
            href="#rounds"
            onClick={(e) => { e.preventDefault(); navTo('home', 'rounds'); }}
          >
            <span className="nav-num">03 //</span> Rounds
          </a>
          <a
            href="#team"
            className={activePage === 'team' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); navTo('team'); }}
          >
            <span className="nav-num">04 //</span> Team
          </a>
          <a
            href="#help"
            className={activePage === 'help' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); navTo('help'); }}
          >
            <span className="nav-num">05 //</span> Help
          </a>

          {/* Desktop HUD Controls */}
          <div className="nav-controls desktop-hud">
            <button
              onClick={handleAudioToggle}
              className={`hud-btn ${audioActive ? 'active' : ''}`}
              title="Toggle Audio Synthesizer"
            >
              <div className="eq-bars"><span></span><span></span><span></span></div>
              <span>{audioActive ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
            </button>

            <button
              onClick={handleCrtToggle}
              className={`hud-btn ${crtActive ? 'active' : ''}`}
              title="Toggle CRT Scanlines Filter"
            >
              <span>{crtActive ? 'CRT: ON' : 'CRT: OFF'}</span>
            </button>
          </div>

          <a
            href="#register"
            className={`cta ${activePage === 'register' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navTo('register'); }}
          >
            ⚡ Register For Round 1 &rarr;
          </a>

          {/* Mobile Sound & CRT Controls in Drawer */}
          <div className="mobile-drawer-controls">
            <button
              onClick={handleAudioToggle}
              className={`hud-btn ${audioActive ? 'active' : ''}`}
              style={{ flex: 1, padding: '8px 10px', fontSize: '0.72rem' }}
            >
              <div className="eq-bars"><span></span><span></span><span></span></div>
              <span>{audioActive ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
            </button>
            <button
              onClick={handleCrtToggle}
              className={`hud-btn ${crtActive ? 'active' : ''}`}
              style={{ flex: 1, padding: '8px 10px', fontSize: '0.72rem' }}
            >
              <span>{crtActive ? 'CRT: ON' : 'CRT: OFF'}</span>
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
