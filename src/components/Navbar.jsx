import React, { useState } from 'react';
import { toggleAudioState, playKeyClick } from '../utils/AudioEngine';

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
    if (anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
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

        {/* HUD Controls */}
        <div className="nav-controls">
          <button
            onClick={handleAudioToggle}
            className={`hud-btn ${audioActive ? 'active' : ''}`}
            title="Toggle Audio Synthesizer"
          >
            <div className="eq-bars"><span></span><span></span><span></span></div>
            <span>{audioActive ? 'SOUND: ONLINE' : 'SOUND: MUTED'}</span>
          </button>

          <button
            onClick={handleCrtToggle}
            className={`hud-btn ${crtActive ? 'active' : ''}`}
            title="Toggle CRT Scanlines Filter"
          >
            <span>{crtActive ? 'CRT: ON' : 'CRT: OFF'}</span>
          </button>
        </div>

        <button className="nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          ☰
        </button>

        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
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
          <a
            href="#register"
            className={`cta ${activePage === 'register' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navTo('register'); }}
          >
            Register
          </a>
        </nav>
      </header>
    </>
  );
}
