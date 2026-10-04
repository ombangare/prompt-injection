import React, { useState, useEffect } from 'react';
import ThreeSkullScene from './components/ThreeSkullScene';
import MatrixBackground from './components/MatrixBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TerminalCLI from './components/TerminalCLI';
import Rounds from './components/Rounds';
import TeamPage from './components/TeamPage';
import RegisterPage from './components/RegisterPage';
import HelpPage from './components/HelpPage';
import mediaManager from './utils/MediaController';
import { startAmbient } from './utils/AudioEngine';

export default function App() {
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    startAmbient();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    if (activePage === 'home') {
      const timeout = setTimeout(() => {
        const heroEl = document.getElementById('hero');
        const termEl = document.getElementById('terminal');
        const roundsEl = document.getElementById('rounds');
        mediaManager.setupScrollObserver([heroEl, termEl, roundsEl]);
      }, 150);

      return () => clearTimeout(timeout);
    }
  }, [activePage]);

  return (
    <div className="app-root">
      {/* CRT Overlay */}
      <div className="crt-overlay" />

      {/* 3D Backgrounds */}
      <MatrixBackground />
      <ThreeSkullScene />
      <div className="vignette" />

      {/* Top Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main>
        {activePage === 'home' && (
          <>
            <Hero onRegisterClick={() => setActivePage('register')} />
            <TerminalCLI onNavigate={(p) => setActivePage(p)} />
            <Rounds onRegisterClick={() => setActivePage('register')} />

            {/* Final CTA */}
            <section className="block" style={{ textAlign: 'center' }}>
              <div className="file-tag red"><span className="pulse"></span>FILE_03 — FINAL CLEARANCE</div>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', margin: '0.8rem 0' }}>Ready To Breach The Machine?</h2>
              <p style={{ color: 'var(--ink-dim)', maxWidth: '580px', margin: '0 auto 2rem' }}>
                Limited seats available for Round 1. Secure your spot before the firewall closes.
              </p>

              <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => setActivePage('register')} className="btn btn-primary">
                  <span>Request Access Clearance &rarr;</span>
                </button>
                <button onClick={() => setActivePage('help')} className="btn btn-ghost">
                  <span>View Rules &amp; FAQ</span>
                </button>
              </div>
            </section>
          </>
        )}

        {activePage === 'team' && <TeamPage />}
        {activePage === 'register' && <RegisterPage onHelpClick={() => setActivePage('help')} />}
        {activePage === 'help' && <HelpPage />}
      </main>

      {/* Master Footer */}
      <footer className="site-footer">
        <div className="footer-top">
          <div>
            <div className="f-brand">PROMPT<span style={{ color: 'var(--red)' }}>://</span>ARENA</div>
            <p style={{ color: 'var(--ink-dim)', fontSize: '0.85rem', marginTop: '0.8rem', maxWidth: '320px' }}>
              The ultimate AI prompt decoding and high-velocity web development challenge. Organized by <strong>AI GenX Club</strong>.
            </p>
          </div>

          <div className="f-links">
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>NAVIGATION</div>
            <a href="#home" onClick={(e) => { e.preventDefault(); setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a>
            <a href="#terminal" onClick={(e) => { e.preventDefault(); setActivePage('home'); setTimeout(() => document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' }), 50); }}>Terminal Arena</a>
            <a href="#rounds" onClick={(e) => { e.preventDefault(); setActivePage('home'); setTimeout(() => document.getElementById('rounds')?.scrollIntoView({ behavior: 'smooth' }), 50); }}>Rounds Breakdown</a>
            <a href="#team" onClick={(e) => { e.preventDefault(); setActivePage('team'); }}>The Team</a>
            <a href="#register" onClick={(e) => { e.preventDefault(); setActivePage('register'); }}>Registration</a>
            <a href="#help" onClick={(e) => { e.preventDefault(); setActivePage('help'); }}>Support &amp; FAQ</a>
          </div>

          <div className="f-social">
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>CONTACT &amp; SUPPORT</div>
            <a href="mailto:ombangare469@gmail.com">✉️ ombangare469@gmail.com</a>
            <a href="https://github.com/ombangare" target="_blank" rel="noreferrer">🐙 GitHub: ombangare</a>
            <a href="tel:9588435148">📞 Sakshi: 95884 35148</a>
            <a href="tel:8446072268">📞 Kashmira: 84460 72268</a>
            <a href="https://chat.whatsapp.com/KC7sl7IXIEF0hxGasxXIPG" target="_blank" rel="noreferrer" style={{ color: 'var(--green)' }}>💬 Join WhatsApp Group</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; 2026 AI GenX Club. All rights reserved.</span>
          <span>SECURITY PROTOCOL LEVEL 0 // SYSTEM BREACHED</span>
        </div>
      </footer>
    </div>
  );
}
