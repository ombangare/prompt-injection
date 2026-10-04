import React, { useState, useEffect, useRef } from 'react';
import CyberBiometricScanner3D from './CyberBiometricScanner3D';
import mediaManager from '../utils/MediaController';
import { EVENT_CONFIG } from '../config/eventConfig';

export default function RegisterPage({ onHelpClick }) {
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    department: '',
    year: '1st Year'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPass, setSubmittedPass] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const videoRef = useRef(null);
  const accessGrantedRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    if (videoRef.current) {
      mediaManager.register('register', videoRef.current);
      mediaManager.setActive('register');
    }

    return () => {
      mediaManager.unregister('register');
    };
  }, []);

  useEffect(() => {
    if (submittedPass && accessGrantedRef.current) {
      mediaManager.register('access_granted', accessGrantedRef.current);
      mediaManager.setActive('access_granted');
    }
  }, [submittedPass]);

  // Compute live clearance percentage based on the 4 core fields
  const calculateProgress = () => {
    let score = 0;
    if (formData.fullname.trim().length >= 2) score += 25;
    if (formData.phone.trim().length >= 10) score += 25;
    if (formData.department.trim().length >= 2) score += 25;
    if (formData.year.trim().length > 0) score += 25;
    return score;
  };

  const progress = calculateProgress();

  const getClearanceLabel = () => {
    if (progress < 50) return { level: 'LEVEL 0', status: 'INCOMPLETE CREDENTIALS', color: 'var(--red)' };
    if (progress < 100) return { level: 'LEVEL 1', status: 'BIOMETRICS PARTIAL', color: 'var(--amber)' };
    return { level: 'LEVEL 2', status: 'VERIFIED // ROUND 1 READY', color: 'var(--green)' };
  };

  const clearance = getClearanceLabel();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const passId = 'GENX-R1-' + Math.floor(1000 + Math.random() * 9000);
    const applicantName = (formData.fullname || 'OPERATIVE').toUpperCase();
    const phoneNum = formData.phone.trim();
    const dept = (formData.department || 'COMPUTER SCIENCE').toUpperCase();
    const yr = formData.year;
    const timestamp = new Date().toLocaleString();

    const submissionPayload = {
      timestamp,
      passId,
      name: applicantName,
      phone: phoneNum,
      department: dept,
      year: yr
    };

    // 1. Instantly save to LocalStorage
    try {
      const existingEntries = JSON.parse(localStorage.getItem('genx_round1_entries') || '[]');
      existingEntries.push(submissionPayload);
      localStorage.setItem('genx_round1_entries', JSON.stringify(existingEntries));
    } catch (e) {
      // Local storage fallback
    }

    // 2. Post to Google Sheets in background without blocking UI
    if (EVENT_CONFIG.GOOGLE_SHEET_URL && EVENT_CONFIG.GOOGLE_SHEET_URL.trim().length > 10) {
      try {
        const formDataEncoded = new URLSearchParams();
        Object.entries(submissionPayload).forEach(([key, val]) => {
          formDataEncoded.append(key, val);
        });

        fetch(EVENT_CONFIG.GOOGLE_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formDataEncoded.toString()
        }).catch((err) => {
          console.warn('Google Sheets background sync notice:', err);
        });
      } catch (err) {
        console.warn('Google Sheets sync notice:', err);
      }
    }

    // 3. Instant UI response for lightning fast user experience
    setIsSubmitting(false);
    setSubmittedPass(submissionPayload);

    if (window.trigger3DGlitch) window.trigger3DGlitch(3.5);
    document.body.classList.add('blood-alert');
    setTimeout(() => document.body.classList.remove('blood-alert'), 2000);
  };

  const copyWhatsAppLink = () => {
    navigator.clipboard.writeText(EVENT_CONFIG.WHATSAPP_GROUP_URL);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="block" style={{ paddingTop: '20px' }}>
      <div className="page-head" style={{ paddingLeft: 0, paddingRight: 0, paddingTop: '20px' }}>
        <div className="file-tag red"><span className="pulse"></span>FILE_04 — ROUND 1 QUALIFIER ENTRY</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 3.4rem)' }}>Round 1 Access Clearance</h1>
        <p style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1rem)' }}>
          Submit your operative credentials below to register for <strong>Round 1: Online Qualifier (Reverse Prompt Engineering)</strong>. 
          Upon submission, you will instantly receive the direct <strong>WhatsApp Community link</strong> for secret photo drops.
        </p>
      </div>

      <div className="reg-wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
        {/* REGISTRATION FORM (Clean, Touch-Optimized) */}
        <form className="reg-form" onSubmit={handleSubmit}>
          <div style={{
            padding: '10px 14px',
            background: 'rgba(25, 255, 110, 0.08)',
            border: '1px solid rgba(25, 255, 110, 0.3)',
            borderRadius: '4px',
            marginBottom: '10px',
            fontSize: '0.8rem',
            color: 'var(--green)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span className="pulse" style={{ width: '6px', height: '6px', background: 'var(--green)', borderRadius: '50%' }}></span>
            <span>REGISTERING FOR: <strong>ROUND 1 (ONLINE QUALIFIER)</strong></span>
          </div>

          <div className="field">
            <label htmlFor="fullname">1. Full Name *</label>
            <input
              id="fullname"
              type="text"
              placeholder="e.g. Alex Mercer"
              required
              value={formData.fullname}
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="phone">2. WhatsApp / Contact Number *</label>
            <input
              id="phone"
              type="tel"
              placeholder="e.g. +91 9876543210 (For WhatsApp Group & Updates)"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="department">3. Department / Branch *</label>
              <input
                id="department"
                type="text"
                placeholder="e.g. AI & DS / CSE / IT"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="year">4. Academic Year *</label>
              <select
                id="year"
                value={formData.year}
                required
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isSubmitting}
            style={{ width: '100%', marginTop: '10px', padding: '1em 1.5rem', fontSize: '1rem' }}
          >
            <span>{isSubmitting ? 'SAVING ENTRY...' : 'CONFIRM ROUND 1 REGISTRATION →'}</span>
          </button>
        </form>

        {/* SIDEBAR: Cyber Entity Video & Biometric Scanner */}
        <div className="reg-notes">
          {/* Holographic Video Viewport */}
          <div className="cyber-video-frame" style={{ marginBottom: '16px' }}>
            <div style={{ position: 'absolute', top: '10px', left: '12px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }}></span>
              <span style={{ fontSize: '0.7rem', color: 'var(--red)', letterSpacing: '0.12em', fontWeight: 700 }}>
                ROUND 1 // REGISTRATION ENTITY
              </span>
            </div>

            <video
              ref={videoRef}
              src="/assets/register.mp4"
              muted
              playsInline
              webkit-playsinline="true"
              preload="auto"
              className="cyber-video-element"
            />
          </div>

          {/* 3D Fingerprint Matrix Scanner */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--ink-dim)', letterSpacing: '0.12em' }}>BIOMETRIC SCANNER</span>
              <span style={{ fontSize: '0.72rem', color: clearance.color, fontWeight: 700 }}>{clearance.level}</span>
            </div>

            <CyberBiometricScanner3D clearanceProgress={progress} />

            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: clearance.color, fontWeight: 700, letterSpacing: '0.05em' }}>
              STATUS: {clearance.status} ({progress}%)
            </div>
          </div>

          <h3>Round 1 Timeline &amp; Protocol</h3>
          <ul>
            <li><strong>Last day to register:</strong> 07 Oct, 1:00 PM</li>
            <li><strong>Secret Photos Release:</strong> 07 Oct, 4:00 PM (Online)</li>
            <li><strong>Submission Deadline:</strong> 08 Oct, 6:00 PM</li>
            <li><strong>Top 30 Shortlist Announced:</strong> 09 Oct, 8:00 PM</li>
          </ul>

          <h3 style={{ marginTop: '16px' }}>Need Assistance?</h3>
          <p style={{ color: 'var(--ink-dim)', fontSize: '.84rem', lineHeight: '1.6' }}>
            Consult the{' '}
            <a
              href="#help"
              onClick={(e) => { e.preventDefault(); if (onHelpClick) onHelpClick(); }}
              style={{ color: 'var(--green)', fontWeight: 700 }}
            >
              Support &amp; FAQ
            </a>{' '}
            or contact Student Coordinators:
          </p>
          <div style={{ marginTop: '8px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>• Sakshi: <a href="tel:9588435148" style={{ color: 'var(--amber)', textDecoration: 'none', fontWeight: 600 }}>95884 35148</a></div>
            <div>• Kashmira: <a href="tel:8446072268" style={{ color: 'var(--amber)', textDecoration: 'none', fontWeight: 600 }}>84460 72268</a></div>
            <div>• Email: <a href="mailto:ombangare469@gmail.com" style={{ color: 'var(--green)', textDecoration: 'none' }}>ombangare469@gmail.com</a></div>
          </div>
        </div>
      </div>

      {/* ROUND 1 CONFIRMATION & WHATSAPP JOIN MODAL */}
      {submittedPass && (
        <div id="reg-pass-modal" className="active">
          <div className="pass-card-3d" style={{ maxWidth: '520px', border: '2px solid var(--green)', padding: 'clamp(18px, 4vw, 28px)', width: 'min(94vw, 520px)' }}>
            <div className="pass-header" style={{ borderBottom: '1px solid rgba(25, 255, 110, 0.4)', paddingBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--green)', letterSpacing: '0.15em', fontWeight: 700 }}>
                  REGISTRATION CONFIRMED // ROUND 1 ENTRY LOGGED
                </div>
                <h2 style={{ color: '#fff', fontSize: '1.25rem', margin: '4px 0 0 0' }}>Welcome, {submittedPass.name}!</h2>
              </div>
              <div style={{ fontSize: '1.8rem' }}>✅</div>
            </div>

            {/* Visual feedback */}
            <div className="cyber-video-frame" style={{
              border: '1px solid var(--green)',
              margin: '0.8rem 0',
              maxHeight: '160px',
              aspectRatio: '16/9',
              boxShadow: '0 0 20px rgba(25, 255, 110, 0.25)'
            }}>
              <video
                ref={accessGrantedRef}
                src="/assets/access_granted.mp4"
                muted
                playsInline
                webkit-playsinline="true"
                preload="auto"
                className="cyber-video-element"
              />
            </div>

            {/* HIGH PRIORITY WHATSAPP INVITATION CARD */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(7, 31, 16, 0.95), rgba(4, 18, 10, 0.98))',
              border: '2px solid var(--green)',
              borderRadius: '8px',
              padding: '16px 14px',
              margin: '0.8rem 0',
              boxShadow: '0 0 25px rgba(25, 255, 110, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--green)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '4px' }}>
                <span className="pulse" style={{ width: '8px', height: '8px', background: 'var(--green)', borderRadius: '50%' }}></span>
                ACTION REQUIRED // ROUND 1 COMMUNICATIONS
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: '4px 0 6px 0' }}>Join The Official Event WhatsApp Group</h3>
              <p style={{ color: 'var(--ink-dim)', fontSize: '0.82rem', margin: '0 0 14px 0', lineHeight: 1.45 }}>
                Round 1 secret AI photos, prompt reverse-engineering guidelines, and submission links will be dropped directly in this group on <strong>07 Oct, 4:00 PM</strong>.
              </p>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={EVENT_CONFIG.WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-green"
                  style={{ flex: 1, minWidth: '200px', padding: '0.9em 1.2em', fontSize: '0.92rem' }}
                >
                  <span>📲 TAP TO JOIN WHATSAPP GROUP</span>
                </a>
                <button
                  type="button"
                  onClick={copyWhatsAppLink}
                  className="btn btn-ghost"
                  style={{ borderColor: 'var(--green)', color: 'var(--green)', padding: '0.9em 1em' }}
                >
                  <span>{copiedLink ? '✓ COPIED' : '📋 COPY LINK'}</span>
                </button>
              </div>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '10px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              color: 'var(--ink-dim)',
              lineHeight: '1.5'
            }}>
              <div>OPERATIVE: <strong style={{ color: '#fff' }}>{submittedPass.name}</strong></div>
              <div>CONTACT: <strong style={{ color: '#fff' }}>{submittedPass.phone}</strong></div>
              <div>DEPARTMENT: <strong style={{ color: '#fff' }}>{submittedPass.department}</strong> ({submittedPass.year})</div>
              <div>ROUND 1 BEGINS: <strong style={{ color: 'var(--green)' }}>07 OCT, 4:00 PM (ONLINE)</strong></div>
              <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed rgba(255,255,255,0.1)', color: 'var(--amber)', fontSize: '0.75rem' }}>
                🔒 <em>Official In-Campus Entry Passes will be unlocked for the Top 30 Shortlisted candidates who qualify Round 1 (Results: 09 Oct, 8:00 PM).</em>
              </div>
            </div>

            <div style={{ marginTop: '14px', textAlign: 'center' }}>
              <button
                className="btn btn-ghost"
                onClick={() => setSubmittedPass(null)}
                style={{ width: '100%', padding: '0.8em' }}
              >
                <span>DONE / CLOSE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
