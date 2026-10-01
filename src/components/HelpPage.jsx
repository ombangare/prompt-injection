import React, { useState } from 'react';
import { playKeyClick } from '../utils/AudioEngine';

const faqs = [
  {
    q: 'What are the key dates and deadlines for PROMPT://INJECTION?',
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
    q: 'Who is eligible to participate in PROMPT://INJECTION?',
    a: 'Open to all enrolled university and college students across all technical disciplines and academic years. Both beginner prompt enthusiasts and veteran full-stack developers are welcome.'
  },
  {
    q: 'What hardware & tools should I bring for on-campus rounds?',
    a: 'Bring your personal laptop fully charged, charger, preferred code editors (VS Code, Cursor, etc.), and local web development tools ready.'
  }
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState(0);

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
    </div>
  );
}
