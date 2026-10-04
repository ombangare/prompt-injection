import React, { useState, useEffect } from 'react';
import { playKeyClick } from '../utils/AudioEngine';

const faqs = [
  {
    q: 'What are the key dates and deadlines for Prompt Arena?',
    a: '• Registration Deadline: 07 Oct, 1:00 PM\n• Photos Release & Round 1 Start: 07 Oct, 4:00 PM (Online)\n• Round 1 Ends: 08 Oct, 6:00 PM\n• Round 1 Results: 09 Oct, 8:00 PM (Top 30 Shortlisted)\n• Round 2 (In-College Live Build): 10 Oct, 10:00 AM – 1:30 PM (5 Themes Revealed Live)\n• Round 2 Results: 11 Oct, 4:00 PM (Top 10 Shortlisted)\n• Round 3 (Main Event Finals): 12 Oct, 11:00 AM onwards.'
  },
  {
    q: 'What is the structure of Round 1 (Reverse Prompt Engineering)?',
    a: 'Round 1 begins online on 07 Oct at 4:00 PM when the secret AI images are released. You have until 08 Oct at 6:00 PM to analyze the images and reconstruct the exact generative prompts and latent cues. Results are announced on 09 Oct at 8:00 PM, shortlisting the Top 30 performers for Round 2.'
  },
  {
    q: 'What happens in Round 2 (In-College Live Build)?',
    a: 'The 30 shortlisted operatives assemble on campus on 10 Oct from 10:00 AM to 1:30 PM. 5 secret high-impact themes will be revealed live at the start of the event. Participants will design and code a production-ready web application under strict time limits. Results are declared on 11 Oct at 4:00 PM, shortlisting the Top 10 finalists for the Grand Finals.'
  },
  {
    q: 'What is Round 3 (Flagship Grand Finals)?',
    a: 'The Top 10 finalists battle on 12 Oct from 11:00 AM onwards in the main event arena. Finalists will pitch, defend, and live-demo their deployed builds in front of the jury and audience to claim the championship trophies and prizes.'
  },
  {
    q: 'Who is eligible to participate in Prompt Arena?',
    a: 'Open to all enrolled university and college students across all technical disciplines and academic years. Both beginner prompt enthusiasts and veteran full-stack developers are welcome.'
  },
  {
    q: 'What hardware & tools should I bring for on-campus rounds?',
    a: 'Bring your personal laptop fully charged, charger, preferred code editors (VS Code, Cursor, etc.), and local web development tools ready.'
  }
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const toggleIndex = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
    playKeyClick();
  };

  return (
    <div className="block" style={{ paddingTop: '40px' }}>
      <div className="page-head" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="file-tag"><span className="pulse"></span>FILE_05 — PROTOCOL &amp; SUPPORT</div>
        <h1>Help &amp; FAQ</h1>
        <p>Everything you need to know about eligibility, round structures, scoring rubrics, and rules.</p>
      </div>

      <div className="help-grid">
        {faqs.map((faq, idx) => (
          <div key={idx} className={`faq-item ${openIndex === idx ? 'open' : ''}`}>
            <div className="faq-q" onClick={() => toggleIndex(idx)}>
              <span>{faq.q}</span>
              <span className="icon">+</span>
            </div>
            <div className="faq-a">
              <p>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Direct Contact & Support Hotline Box */}
      <div style={{
        marginTop: '2.5rem',
        background: 'linear-gradient(135deg, rgba(15, 17, 21, 0.95), rgba(9, 10, 13, 0.98))',
        border: '1px solid var(--line)',
        borderLeft: '4px solid var(--green)',
        borderRadius: '8px',
        padding: 'clamp(18px, 4vw, 28px)',
        boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--green)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em' }}>
          <span className="pulse" style={{ width: '8px', height: '8px', background: 'var(--green)', borderRadius: '50%' }}></span>
          DIRECT HOTLINE &amp; EVENT SUPPORT
        </div>
        <h3 style={{ color: '#fff', fontSize: '1.35rem', margin: '8px 0 6px 0' }}>Need Immediate Assistance?</h3>
        <p style={{ color: 'var(--ink-dim)', fontSize: '0.88rem', margin: 0 }}>
          Reach out directly to the student coordinators or send an official query to the technical team.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '14px',
          marginTop: '1.2rem'
        }}>
          {/* Coordinator Sakshi */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--line)', borderRadius: '6px', padding: '14px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--amber)', fontWeight: 700, letterSpacing: '0.1em' }}>STUDENT COORDINATOR</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>Sakshi Pashine</div>
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <a 
                href="tel:9588435148"
                className="btn btn-ghost"
                style={{ padding: '6px 12px', fontSize: '0.78rem', borderColor: 'var(--amber)', color: 'var(--amber)' }}
              >
                📞 95884 35148
              </a>
              <a 
                href="https://wa.me/919588435148" 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-green"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                💬 WhatsApp
              </a>
            </div>
          </div>

          {/* Coordinator Kashmira */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--line)', borderRadius: '6px', padding: '14px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--amber)', fontWeight: 700, letterSpacing: '0.1em' }}>STUDENT COORDINATOR</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>Kashmira Yatawar</div>
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <a 
                href="tel:8446072268"
                className="btn btn-ghost"
                style={{ padding: '6px 12px', fontSize: '0.78rem', borderColor: 'var(--amber)', color: 'var(--amber)' }}
              >
                📞 84460 72268
              </a>
              <a 
                href="https://wa.me/918446072268" 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-green"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                💬 WhatsApp
              </a>
            </div>
          </div>

          {/* Official Email / Technical Inquiries */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--line)', borderRadius: '6px', padding: '14px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--green)', fontWeight: 700, letterSpacing: '0.1em' }}>OFFICIAL INQUIRIES</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>Om Bangare (Technical Head)</div>
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <a 
                href="mailto:ombangare469@gmail.com"
                className="btn btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                ✉️ ombangare469@gmail.com
              </a>
              <a 
                href="https://github.com/ombangare"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost"
                style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                🐙 GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
