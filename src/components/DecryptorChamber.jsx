import React, { useState, useEffect, useRef } from 'react';
import { playKeyClick } from '../utils/AudioEngine';

export default function DecryptorChamber() {
  const [weight, setWeight] = useState(50);
  const [temp, setTemp] = useState(0.7);
  const [seed, setSeed] = useState(1337);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      canvas.width = canvas.parentElement.clientWidth || 400;
      canvas.height = canvas.parentElement.clientHeight || 250;

      const time = performance.now() * 0.002;
      ctx.fillStyle = '#040507';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw neural waveforms
      for (let j = 0; j < 6; j++) {
        ctx.beginPath();
        ctx.strokeStyle = j % 2 === 0 ? 'rgba(255, 31, 31, 0.45)' : 'rgba(25, 255, 110, 0.45)';
        ctx.lineWidth = 1.5;

        for (let x = 0; x < canvas.width; x += 5) {
          const y =
            canvas.height / 2 +
            Math.sin(x * 0.02 + time * (1 + temp) + j) * (weight * 0.45) +
            (Math.random() - 0.5) * (temp * 18);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [weight, temp, seed]);

  const getDecryptedOutput = () => {
    if (weight > 80 && temp < 0.35) {
      return (
        <span style={{ color: 'var(--green)' }}>
          [DECRYPTION 100% COMPLETE]: "Biomechanical cyber-deity emerging from red volumetric matrix firestorm, intricate chrome titanium cranium, glowing laser oculars, 8k octane render, cinematic dark lighting"
        </span>
      );
    } else if (weight > 50) {
      return (
        <span style={{ color: 'var(--amber)' }}>
          [PARTIAL RECONSTRUCTION 68%]: "Biomechanical [██████] emerging from red [████] matrix firestorm, glowing laser [██████], 8k render"
        </span>
      );
    } else {
      return (
        <span style={{ color: 'var(--red)' }}>
          [CORRUPTED LATENT CIPHER]: "[████████] [████] [████████████] [████] [██████] 8k [██████]"
        </span>
      );
    }
  };

  return (
    <section className="block" id="decrypt-chamber">
      <div className="section-head">
        <div className="file-tag"><span className="pulse"></span>FILE_01 — ROUND 1 SIMULATOR</div>
        <h2>Reverse Prompt Decryption Chamber</h2>
        <p>A live interactive demonstration of Round 1. Adjust the latent vector sliders to reconstruct the AI's hidden prompt from the corrupted noise matrix.</p>
      </div>

      <div className="decrypt-grid">
        <div className="latent-canvas-wrap">
          <canvas ref={canvasRef} id="latent-canvas" />
          <div className="latent-overlay">
            <div>[LATENT_VECTOR: 512-DIMENSIONAL SPACE]</div>
            <div style={{ textAlign: 'right' }}>NEURAL_FLUX: ACTIVE</div>
          </div>
        </div>

        <div className="decrypt-controls">
          <div className="slider-group">
            <div className="slider-label">
              <span>LATENT WEIGHT VECTOR</span>
              <strong>{weight}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weight}
              onChange={(e) => { setWeight(Number(e.target.value)); playKeyClick(); }}
            />
          </div>

          <div className="slider-group">
            <div className="slider-label">
              <span>TEMPERATURE (ENTROPY NOISE)</span>
              <strong>{temp.toFixed(2)}</strong>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temp}
              onChange={(e) => { setTemp(Number(e.target.value)); playKeyClick(); }}
            />
          </div>

          <div className="slider-group">
            <div className="slider-label">
              <span>SEED GENERATOR</span>
              <strong>{seed}</strong>
            </div>
            <input
              type="range"
              min="1000"
              max="9999"
              value={seed}
              onChange={(e) => { setSeed(Number(e.target.value)); playKeyClick(); }}
            />
          </div>

          <div className="cipher-output-box">
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-dim)', marginBottom: '4px' }}>RECONSTRUCTED AI PROMPT:</div>
            <div>{getDecryptedOutput()}</div>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--ink-faint)' }}>
            💡 <em>Tip: Increase Weight (&gt;80%) and lower Temperature (&lt;0.35) to synthesize the prompt.</em>
          </div>
        </div>
      </div>
    </section>
  );
}
