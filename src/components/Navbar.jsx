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
    setMobileMenuOpen(false);
    playKeyClick();
    setActivePage(page);

    if (page === 'home' && anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          mediaManager.playAudioOnce(anchor);
        }
      }, 120);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (page === 'home') mediaManager.playAudioOnce('hero');
      if (page === 'team') mediaManager.playAudioOnce('team');
      if (page === 'register') mediaManager.playAudioOnce('register');
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
          type="button"
          onClick={() => { playKeyClick(); setMobileMenuOpen(!mobileMenuOpen); }} 
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <a
            href="#home"
            className={activePage === 'home' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); navTo('home'); }}
          >
            Home
          </a>
          <a
            href="#terminal"
            onClick={(e) => { e.preventDefault(); navTo('home', 'terminal'); }}
          >
            Terminal
          </a>
          <a
            href="#rounds"
            onClick={(e) => { e.preventDefault(); navTo('home', 'rounds'); }}
          >
            Rounds
          </a>
          <a
            href="#team"
            className={activePage === 'team' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); navTo('team'); }}
          >
            Team
          </a>
          <a
            href="#help"
            className={activePage === 'help' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); navTo('help'); }}
          >
            Help
          </a>

          {/* Desktop HUD Controls */}
          <div className="nav-controls desktop-hud">
            <button
              type="button"
              onClick={handleAudioToggle}
              className={`hud-btn ${audioActive ? 'active' : ''}`}
              title="Toggle Audio Synthesizer"
            >
              <div className="eq-bars"><span></span><span></span><span></span></div>
              <span>{audioActive ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
            </button>

            <button
              type="button"
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
        </nav>
      </header>

      {/* DEDICATED FULL-SCREEN TOP-LEVEL MOBILE DRAWER PORTAL */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-portal">
          <div 
            className="mobile-drawer-backdrop" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="mobile-drawer-panel">
            <div className="mobile-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--red)', fontWeight: 700, letterSpacing: '0.12em' }}>
                <span className="pulse" style={{ width: '8px', height: '8px', background: 'var(--red)', borderRadius: '50%' }}></span>
                SYSTEM DIRECTORY
              </div>
              <button 
                className="drawer-close-btn"
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="mobile-drawer-links">
              <button 
                type="button"
                className={`mobile-nav-item ${activePage === 'home' ? 'active' : ''}`}
                onClick={() => navTo('home')}
              >
                <span className="nav-num">01 //</span>
                <span className="nav-text">Home</span>
              </button>

              <button 
                type="button"
                className="mobile-nav-item"
                onClick={() => navTo('home', 'terminal')}
              >
                <span className="nav-num">02 //</span>
                <span className="nav-text">Terminal Arena</span>
              </button>

              <button 
                type="button"
                className="mobile-nav-item"
                onClick={() => navTo('home', 'rounds')}
              >
                <span className="nav-num">03 //</span>
                <span className="nav-text">The 3 Rounds</span>
              </button>

              <button 
                type="button"
                className={`mobile-nav-item ${activePage === 'team' ? 'active' : ''}`}
                onClick={() => navTo('team')}
              >
                <span className="nav-num">04 //</span>
                <span className="nav-text">The Team</span>
              </button>

              <button 
                type="button"
                className={`mobile-nav-item ${activePage === 'help' ? 'active' : ''}`}
                onClick={() => navTo('help')}
              >
                <span className="nav-num">05 //</span>
                <span className="nav-text">Support &amp; FAQ</span>
              </button>

              <button 
                type="button"
                className={`mobile-nav-item cta-item ${activePage === 'register' ? 'active' : ''}`}
                onClick={() => navTo('register')}
                style={{ marginTop: '8px' }}
              >
                <span>⚡ Register For Round 1 &rarr;</span>
              </button>
            </div>

            <div className="mobile-drawer-controls">
              <button
                type="button"
                onClick={handleAudioToggle}
                className={`hud-btn ${audioActive ? 'active' : ''}`}
                style={{ flex: 1, padding: '10px 8px', fontSize: '0.74rem', justifyContent: 'center' }}
              >
                <div className="eq-bars"><span></span><span></span><span></span></div>
                <span>{audioActive ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
              </button>
              <button
                type="button"
                onClick={handleCrtToggle}
                className={`hud-btn ${crtActive ? 'active' : ''}`}
                style={{ flex: 1, padding: '10px 8px', fontSize: '0.74rem', justifyContent: 'center' }}
              >
                <span>{crtActive ? 'CRT: ON' : 'CRT: OFF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
