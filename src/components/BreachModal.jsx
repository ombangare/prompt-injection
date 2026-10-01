import React, { useState } from 'react';
import { speakHorrorWelcome } from '../utils/AudioEngine';

export default function BreachModal({ onEnter }) {
  const [dismissed, setDismissed] = useState(false);

  const handleEnter = () => {
    setDismissed(true);
    speakHorrorWelcome();
    if (window.trigger3DGlitch) window.trigger3DGlitch(3.0);
    if (onEnter) onEnter();
  };

  const handleBypass = () => {
    setDismissed(true);
    if (window.trigger3DGlitch) window.trigger3DGlitch(1.5);
    if (onEnter) onEnter();
  };

  if (dismissed) return null;

  return (
    <div id="breach-modal">
      <div className="breach-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'radial-gradient(circle, #ff1f1f 0%, #300 100%)',
            border: '2px solid var(--red)',
            boxShadow: '0 0 20px var(--red-glow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem'
          }}>
            ☠️
          </div>
          <div>
            <div className="breach-badge" style={{ marginBottom: 0 }}>
              <span className="radar"></span> CRITICAL SECURITY INTRUSION // LEVEL 0
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-faint)', marginTop: '2px' }}>
              TARGET: AI GENX NEURAL MAINFRAME
            </div>
          </div>
        </div>

        <h1 className="breach-title">WARNING: SYSTEM COMPROMISED</h1>
        <p style={{ color: 'var(--ink-dim)', fontSize: '0.9rem', lineHeight: '1.6' }}>
          An unauthorized bio-entity has breached the machine. You are now inside the <strong>PROMPT://INJECTION</strong> terminal. Click below to initialize the neural link.
        </p>

        <div className="breach-meta">
          <div>INTRUDER_IP: <span className="red">192.0.2.666 [PORT 666 OPEN]</span></div>
          <div>HOST: <span className="green">AI GenX Club Flagship Subsystem</span></div>
          <div>EVENT_ID: <span className="red">PROMPT://INJECTION (OCT 2026)</span></div>
          <div>DEFENSE_STATUS: <span className="red">CRITICAL BREACH — ENTER AT OWN RISK</span></div>
        </div>

        <div className="breach-actions">
          <button onClick={handleEnter} className="btn btn-primary">
            <span>ENTER THE BREACH ☠</span>
          </button>
          <button onClick={handleBypass} className="btn btn-ghost">
            <span>BYPASS WARNING [ESC]</span>
          </button>
        </div>
      </div>
    </div>
  );
}
