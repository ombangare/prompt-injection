import React, { useState, useRef, useEffect } from 'react';
import mediaManager from '../utils/MediaController';

const leadership = [
  { name: 'Obaid', role: 'President', initials: 'O' },
  {
    name: 'Khyati Dutta',
    role: 'Vice President',
    initials: 'KD',
    photo: '/assets/team/khyati.jpg',
    instagram: 'https://www.instagram.com/alwayskhyati/?hl=en',
    linkedin: 'https://www.linkedin.com/in/khyati-dutta-337693416?utm_source=share_via&utm_content=profile&utm_medium=member_android'
  }
];

const technical = [
  { name: 'Om', role: 'Technical Head', initials: 'O' },
  {
    name: 'Harshit Chawla',
    role: 'Technical Executive',
    initials: 'HC',
    photo: '/assets/team/harshit.jpg',
    instagram: 'https://www.instagram.com/harshit_chawla99?utm_source=qr&igsi=cXQ1b3pkbGVmNTRi',
    linkedin: 'https://www.linkedin.com/in/harshit-chawla-8812b72ba'
  }
];

const digital = [
  {
    name: 'Taybah Ahmed',
    role: 'Digital Head',
    initials: 'TA',
    photo: '/assets/team/taybah.jpg',
    instagram: 'https://www.instagram.com/taymendios',
    linkedin: 'https://www.linkedin.com/in/taybah-ahmad-6b0128364'
  },
  {
    name: 'Suraj Yadav',
    role: 'Digital Executive',
    initials: 'SY',
    photo: '/assets/team/suraj.jpg',
    instagram: 'https://www.instagram.com/_yadav_01_s?igsi=MXNwMGo5MGx3enQyNw%3D%3D&utm_source=qr',
    linkedin: 'https://www.linkedin.com/in/suraj-yadav-17a014434?utm_source=share_via&utm_content=profile&utm_medium=member_ios'
  }
];

const coordinators = [
  {
    name: 'Divya Kshirsagar',
    role: 'Student Coordinator',
    initials: 'DK',
    photo: '/assets/team/divya.jpg',
    instagram: 'https://www.instagram.com/poetic.dreamer_?igsi=MWllMTUwaWZheGpoYg==',
    linkedin: 'https://www.linkedin.com/in/divya-kshirsagar-06ba93412'
  },
  {
    name: 'Khushii Mishra',
    role: 'Student Coordinator',
    initials: 'KM',
    photo: '/assets/team/khushi.jpg',
    instagram: 'https://www.instagram.com/kiki_.loviiiee?igsi=dGF2eWJ5YTd5a2Nm',
    linkedin: 'https://www.linkedin.com/in/khushi-mishra-827a67430?utm_source=share_via&utm_content=profile&utm_medium=member_android'
  },
  {
    name: 'Mansi Gupta',
    role: 'Student Coordinator',
    initials: 'MG',
    photo: '/assets/team/mansi.jpg',
    instagram: 'https://www.instagram.com/mansigupta__27',
    linkedin: 'https://www.linkedin.com/in/mansi-gupta-5339093ba?utm_source=share_via&utm_content=profile&utm_medium=member_android'
  },
  {
    name: 'Sakshi Pashine',
    role: 'Student Coordinator',
    initials: 'SP',
    photo: '/assets/team/sakshi.jpg',
    instagram: 'https://www.instagram.com/__.sakshi.__2324?igsi=Z2w1bWhtNzk4dmtq',
    linkedin: 'https://www.linkedin.com/in/sakshi-pashine-27b551383?utm_source=share_via&utm_content=profile&utm_medium=member_android'
  },
  {
    name: 'Kashmira Yatawar',
    role: 'Student Coordinator',
    initials: 'KY',
    photo: '/assets/team/kashmira.jpg',
    instagram: 'https://www.instagram.com/kashmira_here_',
    linkedin: 'https://www.linkedin.com/in/kashmira-yatawar-791ba5360?utm_source=share_via&utm_content=profile&utm_medium=member_android'
  }
];
const executives = [
  {
    name: 'Sujal Chauragade',
    role: 'Executive Member',
    initials: 'SC',
    photo: '/assets/team/sujal.jpg',
    instagram: 'https://www.instagram.com/sujal.l2968',
    linkedin: 'https://www.linkedin.com/in/sujal-chauragade-4aa183434?utm_source=share_via&utm_content=profile&utm_medium=member_android'
  },
  {
    name: 'Kirat Kaur Tak',
    role: 'Executive Member',
    initials: 'KT',
    photo: '/assets/team/kirat.jpg',
    instagram: 'https://www.instagram.com/kirattak13?utm_source=qr',
    linkedin: 'https://www.linkedin.com/in/kiratt-takkk-5a1a65430?utm_source=share_via&utm_content=profile&utm_medium=member_ios'
  },
  {
    name: 'Ishan Tiwari',
    role: 'Executive Member',
    initials: 'IT',
    photo: '/assets/team/ishan.jpg',
    instagram: 'https://www.instagram.com/_huh_idk7?igsi=YTJrNXluZG02NWRi',
    linkedin: 'https://www.linkedin.com/in/ishan-tiwari-69a112434?utm_source=share_via&utm_content=profile&utm_medium=member_android'
  },
  {
    name: 'Harshita Kawadkar',
    role: 'Executive Member',
    initials: 'HK',
    photo: '/assets/team/harshita.jpg',
    instagram: 'https://www.instagram.com/_i.harshita__?igsi=MTVzcjdqdmo3YTM5Mg==',
    linkedin: 'https://www.linkedin.com/in/harshita-kawadkar-7a7632400'
  },
  {
    name: 'Sharvari Nakhale',
    role: 'Executive Member',
    initials: 'SN',
    photo: '/assets/team/sharvari.jpg',
    instagram: 'https://www.instagram.com/sharvari.005?igsi=MTNybXA1d2tlZnV2aQ==',
    linkedin: 'https://www.linkedin.com/in/sharvari-nakhale-1532b0402?utm_source=share_via&utm_content=profile&utm_medium=member_ios'
  },
  {
    name: 'Chitrasen R Gautam',
    role: 'Executive Member',
    initials: 'CG',
    photo: '/assets/team/chitrasen.jpg',
    instagram: 'https://www.instagram.com/chitrasen.in',
    linkedin: 'https://www.linkedin.com/in/chitrasen-gautam-03416b434?utm_source=share_via&utm_content=profile&utm_medium=member_android'
  },
  {
    name: 'Pari Gupta',
    role: 'Executive Member',
    initials: 'PG',
    photo: '/assets/team/pari.jpg',
    instagram: 'https://www.instagram.com/itss_fairyfiedd?igsh=aG4xajlrdHBybDBv',
    linkedin: 'https://www.linkedin.com/in/pari-gupta-473b4639a?utm_source=share_via&utm_content=profile&utm_medium=member_android'
  },
  {
    name: 'Sharvary Chinchulkar',
    role: 'Executive Member',
    initials: 'SC',
    photo: '/assets/team/sharvary.jpg',
    instagram: 'https://www.instagram.com/sharvaryy___?igsi=NzZiemRuODZpMmVr',
    linkedin: 'https://www.linkedin.com/in/sharvary-chinchulkar-693993427'
  }
];

function PersonCard({ name, role, initials, photo, instagram, linkedin, email }) {
  const igUrl = instagram || 'https://instagram.com';
  const liUrl = linkedin || 'https://linkedin.com';
  const mailUrl = email || `mailto:${name.toLowerCase().replace(/\s+/g, '')}@example.edu`;

  return (
    <article className="person-card">
      <div className="person-photo">
        {photo ? (
          <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="initials-fallback">{initials || name.slice(0, 2).toUpperCase()}</div>
        )}
      </div>
      <div className="person-info">
        <div className="person-name">{name}</div>
        <div className="person-role">{role}</div>
        <div className="person-links">
          <a href={igUrl} target="_blank" rel="noreferrer">IG</a>
          <a href={liUrl} target="_blank" rel="noreferrer">LI</a>
          <a href={mailUrl}>Mail</a>
        </div>
      </div>
    </article>
  );
}

export default function TeamPage() {
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      mediaManager.register('team', videoRef.current);
      mediaManager.setActive('team');
    }

    const handleVideoChange = () => {
      if (videoRef.current) {
        setIsVideoMuted(videoRef.current.muted);
      }
    };

    window.addEventListener('active-video-change', handleVideoChange);

    return () => {
      mediaManager.unregister('team');
      window.removeEventListener('active-video-change', handleVideoChange);
    };
  }, []);

  const toggleSound = () => {
    mediaManager.toggleMute('team');
    if (videoRef.current) {
      setIsVideoMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="block" style={{ paddingTop: '40px' }}>
      <div className="page-head" style={{ paddingLeft: 0, paddingRight: 0, textAlign: 'center' }}>
        <div className="file-tag red" style={{ display: 'inline-flex' }}><span className="pulse"></span>FILE_03 — CORE COMMAND</div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', marginTop: '0.6rem' }}>The Architects Behind The Breach</h1>
        <p style={{ maxWidth: '680px', margin: '0.8rem auto 0', color: 'var(--green)', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '0.02em' }}>
          "We didn't just build the machine. We taught it how to hunt."
        </p>
        <p style={{ maxWidth: '640px', margin: '0.4rem auto 0', color: 'var(--ink-dim)', fontSize: '0.9rem' }}>
          Meet the AI GenX Club core command — the technical architects, digital operatives, and leaders engineering the event.
        </p>
      </div>

      {/* Team Holographic Video Showcase */}
      <div className="cyber-video-frame" style={{
        maxWidth: '720px',
        margin: '2rem auto 3rem auto'
      }}>
        <div style={{ position: 'absolute', top: '12px', left: '14px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }}></span>
          <span style={{ fontSize: '0.72rem', color: 'var(--red)', letterSpacing: '0.12em', fontWeight: 700 }}>
            AI GENX CORE COMMAND // LIVE FEED
          </span>
        </div>

        <button
          onClick={toggleSound}
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
          {isVideoMuted ? '🔇 UNMUTE FEED' : '🔊 COMMAND FEED LIVE'}
        </button>

        <video
          ref={videoRef}
          src="/assets/team.mp4"
          autoPlay
          muted={isVideoMuted}
          playsInline
          webkit-playsinline="true"
          loop
          preload="auto"
          className="cyber-video-element"
        />
      </div>

      <div className="tier-label">LEADERSHIP</div>
      <div className="team-grid">
        {leadership.map((p, i) => (
          <PersonCard key={i} {...p} />
        ))}
      </div>

      <div className="tier-label">TECHNICAL DIVISION</div>
      <div className="team-grid">
        {technical.map((p, i) => (
          <PersonCard key={i} {...p} />
        ))}
      </div>

      <div className="tier-label">DIGITAL & MEDIA</div>
      <div className="team-grid">
        {digital.map((p, i) => (
          <PersonCard key={i} {...p} />
        ))}
      </div>

      <div className="tier-label">STUDENT COORDINATORS</div>
      <div className="team-grid">
        {coordinators.map((item, i) => (
          typeof item === 'string'
            ? <PersonCard key={i} name={item} role="Student Coordinator" />
            : <PersonCard key={i} role="Student Coordinator" {...item} />
        ))}
      </div>

      <div className="tier-label">EXECUTIVE MEMBERS</div>
      <div className="team-grid">
        {executives.map((item, i) => (
          typeof item === 'string'
            ? <PersonCard key={i} name={item} role="Executive Member" />
            : <PersonCard key={i} role="Executive Member" {...item} />
        ))}
      </div>
    </div>
  );
}
