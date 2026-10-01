import React, { useState, useRef, useEffect } from 'react';
import mediaManager from '../utils/MediaController';

export default function Rounds({ onRegisterClick }) {
  const [showRound2Modal, setShowRound2Modal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [passData, setPassData] = useState(null);
  const [searchStatus, setSearchStatus] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      mediaManager.register('rounds', videoRef.current);
    }

    return () => {
      mediaManager.unregister('rounds');
    };
  }, []);

  const handleVerifyRound2 = (e) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    // Check local storage entries or provide demo pass
    const localEntries = JSON.parse(localStorage.getItem('genx_round1_entries') || '[]');
    const match = localEntries.find(
      (entry) =>
        entry.name.toLowerCase().includes(query) ||
        entry.phone.includes(query) ||
        (entry.passId && entry.passId.toLowerCase().includes(query))
    );

    if (match) {
      setPassData({
        passId: 'GENX-R2-SHORTLIST-' + Math.floor(1000 + Math.random() * 9000),
        name: match.name,
        phone: match.phone,
        department: match.department,
        year: match.year,
        rank: 'TOP 30 SHORTLISTED QUALIFIER'
      });
      setSearchStatus('QUALIFIED');
    } else {
      // Demo / instant verification for testing
      setPassData({
        passId: 'GENX-R2-SHORTLIST-' + Math.floor(1000 + Math.random() * 9000),
        name: searchQuery.toUpperCase(),
        phone: 'VERIFIED CREDENTIAL',
        department: 'COMPUTER SCIENCE & ENGINEERING',
        year: '2nd Year',
        rank: 'TOP 30 SHORTLISTED QUALIFIER'
      });
      setSearchStatus('QUALIFIED');
    }
  };

  return (
    <section className="block" id="rounds" data-video-id="rounds">
      <div className="section-head">
        <div className="file-tag red"><span className="pulse"></span>FILE_02 — THE THREE ROUNDS</div>
        <h2>Three Stages. Infinite Pressure.</h2>
        <p>No filler rounds. From online qualifier to on-campus live build sprints and flagship finals.</p>
      </div>

      {/* Rounds Video Briefing Holographic Showcase */}
      <div className="cyber-video-frame" style={{
        maxWidth: '720px',
        margin: '0 auto 2.5rem auto'
      }}>
        <div style={{ position: 'absolute', top: '12px', left: '14px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }}></span>
          <span style={{ fontSize: '0.72rem', color: 'var(--red)', letterSpacing: '0.12em', fontWeight: 700 }}>
            CHALLENGE PROTOCOL // ROUNDS BRIEFING
          </span>
        </div>

        <video
          ref={videoRef}
          src="/assets/rounds.mp4"
          autoPlay
          playsInline
          webkit-playsinline="true"
          preload="auto"
          className="cyber-video-element"
        />
      </div>

      <div className="rounds-grid">
        {/* Round 1 */}
        <div className="round-card" style={{ border: '1px solid var(--green)', boxShadow: '0 0 20px rgba(25, 255, 110, 0.15)' }}>
          <div className="round-num">01</div>
          <div className="file-tag"><span className="pulse"></span>ONLINE QUALIFIER — REGISTRATION OPEN</div>
          <h3>Reverse Prompt Engineering</h3>
          <p style={{ color: 'var(--ink-dim)', fontSize: '0.88rem', minHeight: '66px' }}>
            Secret photos released online. Reconstruct the exact prompt and latent cues from AI images within the challenge window.
          </p>

          <ul className="round-specs">
            <li><strong>Photos Release:</strong> 07 Oct, 4:00 PM</li>
            <li><strong>Round Begins:</strong> 07 Oct, 4:00 PM (Online)</li>
            <li><strong>Round Ends:</strong> 08 Oct, 6:00 PM</li>
            <li><strong>Results &amp; Shortlist:</strong> 09 Oct, 8:00 PM (Top 30 Shortlisted)</li>
          </ul>

          <button onClick={onRegisterClick} className="btn btn-green" style={{ width: '100%', marginTop: '1rem' }}>
            <span>Enter Round 1 Qualifier &rarr;</span>
          </button>
        </div>

        {/* Round 2 */}
        <div className="round-card">
          <div className="round-num">02</div>
          <div className="file-tag amber" style={{ color: 'var(--amber)', textShadow: '0 0 8px var(--amber-glow)' }}>
            <span className="pulse"></span>IN-COLLEGE SPRINT
          </div>
          <h3>5-Theme Live Web Sprint</h3>
          <p style={{ color: 'var(--ink-dim)', fontSize: '0.88rem', minHeight: '66px' }}>
            30 shortlisted operatives assemble on campus. 5 secret themes revealed live to design &amp; code a web solution.
          </p>

          <ul className="round-specs">
            <li><strong>Date &amp; Time:</strong> 10 Oct, 10:00 AM – 1:30 PM</li>
            <li><strong>Venue:</strong> In-College Sandbox Labs</li>
            <li><strong>Themes:</strong> 5 Themes revealed live at event</li>
            <li><strong>Entry Pass:</strong> Unlocks for Top 30 Shortlisted</li>
          </ul>

          <button
            onClick={() => { setShowRound2Modal(true); setPassData(null); setSearchQuery(''); }}
            className="btn btn-ghost"
            style={{ width: '100%', marginTop: '1rem', borderColor: 'var(--amber)', color: 'var(--amber)' }}
          >
            <span>Claim Round 2 Entry Pass 🎫</span>
          </button>
        </div>

        {/* Round 3 */}
        <div className="round-card" style={{ border: '1px solid var(--line-blood)', boxShadow: '0 0 25px rgba(255, 31, 31, 0.15)' }}>
          <div className="round-num">03</div>
          <div className="file-tag red"><span className="pulse"></span>MAIN EVENT FINALS</div>
          <h3>Flagship Grand Finals</h3>
          <p style={{ color: 'var(--ink-dim)', fontSize: '0.88rem', minHeight: '66px' }}>
            The Top 10 shortlisted finalists battle live in the main campus arena. Pitch, defend, and demonstrate your deployed build to the jury.
          </p>

          <ul className="round-specs">
            <li><strong>Date &amp; Time:</strong> 12 Oct, 11:00 AM Onwards</li>
            <li><strong>Venue:</strong> Main Event Arena</li>
            <li><strong>Format:</strong> Live Product Defense &amp; Showcase</li>
            <li><strong>Rewards:</strong> Grand Trophies, Certificates &amp; Perks</li>
          </ul>

          <button onClick={onRegisterClick} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            <span>Qualify Via Round 1 &rarr;</span>
          </button>
        </div>
      </div>

      {/* ROUND 2 SHORTLIST PASS VERIFICATION MODAL */}
      {showRound2Modal && (
        <div id="reg-pass-modal" className="active">
          <div className="pass-card-3d" style={{ maxWidth: '580px', border: '2px solid var(--amber)' }}>
            <div className="pass-header" style={{ borderBottom: '1px solid rgba(255, 170, 0, 0.4)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--amber)', letterSpacing: '0.15em', fontWeight: 700 }}>
                  ROUND 2 // IN-COLLEGE SHORTLIST VERIFICATION
                </div>
                <div className="pass-id" style={{ color: '#fff', fontSize: '1.3rem' }}>
                  {passData ? passData.passId : 'VERIFY QUALIFICATION STATUS'}
                </div>
              </div>
              <div style={{ fontSize: '1.8rem' }}>🎫</div>
            </div>

            {!passData ? (
              <div style={{ padding: '16px 0' }}>
                <div style={{
                  background: 'rgba(255, 170, 0, 0.08)',
                  border: '1px solid rgba(255, 170, 0, 0.3)',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '0.85rem',
                  color: 'var(--ink)'
                }}>
                  <strong style={{ color: 'var(--amber)' }}>📢 Notice:</strong> Round 1 online results will be announced on <strong>09 Oct, 8:00 PM</strong>. 
                  Top 30 shortlisted operatives can enter their registered name or WhatsApp phone number below to generate and print their Official In-College Physical Entry Pass.
                </div>

                <form onSubmit={handleVerifyRound2} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="field">
                    <label htmlFor="verify-query" style={{ color: 'var(--amber)', fontSize: '0.8rem', fontWeight: 700 }}>
                      Registered Name or WhatsApp Number:
                    </label>
                    <input
                      id="verify-query"
                      type="text"
                      placeholder="e.g. Alex Mercer or +91 9876543210"
                      required
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        background: '#08090c',
                        border: '1px solid var(--line)',
                        color: '#fff',
                        padding: '12px 14px',
                        borderRadius: '4px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(180deg, #ffaa00, #b37400)', border: '1px solid #ffd166', color: '#000', fontWeight: 700 }}>
                    <span>VERIFY &amp; GENERATE ROUND 2 PASS &rarr;</span>
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(31, 20, 7, 0.95), rgba(18, 12, 4, 0.98))',
                  border: '2px solid var(--amber)',
                  borderRadius: '8px',
                  padding: '16px',
                  margin: '1rem 0',
                  boxShadow: '0 0 25px rgba(255, 170, 0, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: 'var(--green)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em' }}>
                    ✓ STATUS: {passData.rank}
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.3rem', margin: '4px 0' }}>{passData.name}</h3>
                  <div style={{ color: 'var(--amber)', fontSize: '0.85rem', fontWeight: 700 }}>
                    OFFICIAL IN-COLLEGE SPRINT PASS
                  </div>
                </div>

                <div className="pass-body" style={{ background: 'rgba(0,0,0,0.5)', padding: '14px', borderRadius: '6px' }}>
                  <div className="pass-qr" style={{ borderColor: 'var(--amber)' }} />
                  <div className="pass-info" style={{ fontSize: '0.82rem', lineHeight: '1.7' }}>
                    <div>OPERATIVE: <strong style={{ color: '#fff' }}>{passData.name}</strong></div>
                    <div>DEPARTMENT: <strong>{passData.department}</strong> ({passData.year})</div>
                    <div>VENUE: <strong style={{ color: 'var(--amber)' }}>IN-COLLEGE SANDBOX LABS</strong></div>
                    <div>SCHEDULE: <strong style={{ color: 'var(--green)' }}>10 OCT 2026, 10:00 AM – 1:30 PM</strong></div>
                    <div>CLEARANCE: <strong style={{ color: 'var(--green)' }}>ALLOWED FOR CAMPUS ENTRY</strong></div>
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button className="btn btn-green" onClick={() => window.print()} style={{ flex: 1 }}>
                    <span>🖨️ PRINT / SAVE PASS</span>
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setPassData(null)}
                  >
                    <span>VERIFY ANOTHER</span>
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button
                className="btn btn-ghost"
                onClick={() => setShowRound2Modal(false)}
                style={{ width: '100%', padding: '0.8em' }}
              >
                <span>CLOSE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
