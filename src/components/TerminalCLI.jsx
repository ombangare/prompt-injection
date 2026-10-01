import React, { useState, useRef, useEffect } from 'react';
import mediaManager from '../utils/MediaController';

// Simple, Fun & Fast Technology Question Bank
const QUESTION_POOL = [
  {
    id: 1,
    category: 'AI_BASICS',
    title: 'Generative AI Creator',
    code: `Question: Which company created ChatGPT and the GPT series of AI models?`,
    options: [
      "OpenAI",
      "Netflix",
      "Adobe"
    ],
    correct: 0,
    hint: "OpenAI is the creator of ChatGPT, GPT-4, and DALL-E."
  },
  {
    id: 2,
    category: 'WEB_DEVELOPMENT',
    title: 'Web Page Styling',
    code: `Question: Which technology is primarily used to style and visually design websites?`,
    options: [
      "CSS (Cascading Style Sheets)",
      "SQL (Database Query Language)",
      "C++ Assembly"
    ],
    correct: 0,
    hint: "CSS controls visual styling, colors, and layout on modern websites."
  },
  {
    id: 3,
    category: 'CYBERSECURITY',
    title: 'Two-Factor Security',
    code: `Question: What does '2FA' stand for in account security?`,
    options: [
      "Two-Factor Authentication",
      "Two-File Access",
      "Total Fast Algorithm"
    ],
    correct: 0,
    hint: "2FA requires a second verification step (like an OTP) beyond just a password."
  },
  {
    id: 4,
    category: 'HARDWARE',
    title: 'Computer Brain',
    code: `Question: Which component is known as the primary 'Brain' of a computer?`,
    options: [
      "CPU (Central Processing Unit)",
      "Power Supply (PSU)",
      "Cooling Fan"
    ],
    correct: 0,
    hint: "The CPU executes program instructions and handles all core calculations."
  },
  {
    id: 5,
    category: 'DEV_TOOLS',
    title: 'Git Version Control',
    code: `Question: Which Git command is used to save your code changes into your local repository?`,
    options: [
      "git commit -m 'message'",
      "git exit --now",
      "git format -all"
    ],
    correct: 0,
    hint: "'git commit' saves your staged changes with a descriptive message."
  },
  {
    id: 6,
    category: 'OPERATING_SYSTEMS',
    title: 'Open-Source Kernel',
    code: `Question: What open-source operating system kernel powers Android and majority of cloud servers?`,
    options: [
      "Linux",
      "Windows 95",
      "MS-DOS"
    ],
    correct: 0,
    hint: "Linux was created in 1991 and powers Android, servers, and supercomputers."
  },
  {
    id: 7,
    category: 'INTERNET_BASICS',
    title: 'Web Addresses',
    code: `Question: What does 'URL' stand for in web browsers?`,
    options: [
      "Uniform Resource Locator",
      "Universal Robot Link",
      "Ultra Rapid Logic"
    ],
    correct: 0,
    hint: "A URL specifies the location of a resource (like a webpage) on the Internet."
  },
  {
    id: 8,
    category: 'AI_TERMINOLOGY',
    title: 'Modern AI Acronym',
    code: `Question: What does 'LLM' stand for in modern artificial intelligence?`,
    options: [
      "Large Language Model",
      "Low Logic Memory",
      "Live Line Monitor"
    ],
    correct: 0,
    hint: "LLMs are neural networks trained on vast amounts of text to understand language."
  }
];

export default function TerminalCLI({ onNavigate }) {
  const [inputVal, setInputVal] = useState('');
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef(null);
  const bodyRef = useRef(null);

  // Game States
  const [gameState, setGameState] = useState({
    active: false,
    awaitingName: false,
    playerName: '',
    questions: [],
    currentIndex: 0,
    score: 0,
    startTime: null,
    answers: []
  });

  const [virtualGift, setVirtualGift] = useState(null);

  useEffect(() => {
    if (videoRef.current) {
      mediaManager.register('terminal', videoRef.current);
    }

    const handleVideoChange = () => {
      if (videoRef.current) {
        setIsVideoMuted(videoRef.current.muted);
      }
    };

    window.addEventListener('active-video-change', handleVideoChange);

    return () => {
      mediaManager.unregister('terminal');
      window.removeEventListener('active-video-change', handleVideoChange);
    };
  }, []);

  const [history, setHistory] = useState([
    { text: '================ CYBER BUG HUNT & TERMINAL CONSOLE ================', class: 'accent' },
    { text: 'Hunt code glitches, test tech instincts & claim your Virtual Operative Pass.', class: 'info' },
    { text: 'COMMANDS: "play" (Start 3-Q Challenge) | "details" (Event Info) | "participate" (How to Join)', class: 'amber' },
    { text: 'Type "play" or click "START BUG HUNT" to enter your name and begin!', class: 'accent' }
  ]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  // Step 1: Prompt for Operative Name
  const promptForName = () => {
    setVirtualGift(null);
    setGameState((prev) => ({
      ...prev,
      active: false,
      awaitingName: true
    }));

    setHistory((prev) => [
      ...prev,
      { text: '------------------------------------------------------------', class: 'info' },
      { text: '👤 [IDENTIFICATION REQUIRED]: ENTER YOUR NAME / HACKER HANDLE TO INITIALIZE RANKING:', class: 'accent' }
    ]);
  };

  // Step 2: Initialize 3-Question Tech Challenge with Name
  const initGameWithName = (name) => {
    const cleanName = (name.trim() || 'ANONYMOUS_OPERATIVE').toUpperCase();
    const shuffled = [...QUESTION_POOL].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3).map((q) => {
      const correctText = q.options[q.correct];
      const shuffledOpts = [...q.options].sort(() => 0.5 - Math.random());
      const newCorrectIndex = shuffledOpts.indexOf(correctText);
      return {
        ...q,
        options: shuffledOpts,
        correct: newCorrectIndex
      };
    });

    setGameState({
      active: true,
      awaitingName: false,
      playerName: cleanName,
      questions: selected,
      currentIndex: 0,
      score: 0,
      startTime: Date.now(),
      answers: []
    });

    const firstQ = selected[0];
    setHistory((prev) => [
      ...prev,
      { text: `[✓] OPERATIVE REGISTERED: [${cleanName}] // TIMER RUNNING!`, class: 'accent' },
      { text: '🎯 3 QUESTIONS // SPEED & ACCURACY COUNT FOR RANKING', class: 'amber' },
      { text: '------------------------------------------------------------', class: 'info' },
      { text: `[QUESTION 1/3] ${firstQ.title} (${firstQ.category})`, class: 'amber' },
      { text: `CODE SNIPPET:\n${firstQ.code}`, class: 'info' },
      { text: 'OPTIONS:', class: 'accent' },
      { text: `  [1] ${firstQ.options[0]}`, class: 'info' },
      { text: `  [2] ${firstQ.options[1]}`, class: 'info' },
      { text: `  [3] ${firstQ.options[2]}`, class: 'info' },
      { text: 'Type "1", "2", or "3" (or click buttons below) to answer!', class: 'error' }
    ]);
  };

  const handleAnswer = (choiceIndex) => {
    if (!gameState.active) {
      setHistory((prev) => [
        ...prev,
        { text: '[!] No active game. Type "play" or click "START BUG HUNT" to play.', class: 'error' }
      ]);
      return;
    }

    const currentQ = gameState.questions[gameState.currentIndex];
    const isCorrect = choiceIndex === currentQ.correct;
    const nextScore = isCorrect ? gameState.score + 1 : gameState.score;
    const nextIndex = gameState.currentIndex + 1;

    const feedbackLines = [
      isCorrect
        ? { text: `[✓] CORRECT! ${currentQ.hint}`, class: 'accent' }
        : { text: `[✗] INCORRECT! Correct answer was [${currentQ.correct + 1}]. ${currentQ.hint}`, class: 'error' }
    ];

    if (nextIndex < 3) {
      const nextQ = gameState.questions[nextIndex];
      setGameState((prev) => ({
        ...prev,
        currentIndex: nextIndex,
        score: nextScore,
        answers: [...prev.answers, { qId: currentQ.id, isCorrect }]
      }));

      setHistory((prev) => [
        ...prev,
        ...feedbackLines,
        { text: '------------------------------------------------------------', class: 'info' },
        { text: `[QUESTION ${nextIndex + 1}/3] ${nextQ.title} (${nextQ.category})`, class: 'amber' },
        { text: `CODE SNIPPET:\n${nextQ.code}`, class: 'info' },
        { text: 'OPTIONS:', class: 'accent' },
        { text: `  [1] ${nextQ.options[0]}`, class: 'info' },
        { text: `  [2] ${nextQ.options[1]}`, class: 'info' },
        { text: `  [3] ${nextQ.options[2]}`, class: 'info' },
        { text: 'Type "1", "2", or "3" to submit your answer!', class: 'error' }
      ]);
    } else {
      // Completed all 3 questions!
      const totalTimeSec = ((Date.now() - gameState.startTime) / 1000).toFixed(2);
      const operative = gameState.playerName || 'OPERATIVE';
      setGameState({ active: false, awaitingName: false, playerName: operative, questions: [], currentIndex: 0, score: 0, startTime: null, answers: [] });

      // Determine Rank based on score & speed
      let rank = 'C-TIER CYBER INTRUDER';
      let rankBadge = '🥉';
      let giftCode = 'GENX-CYBER-ROOKIE';
      let perk = 'Event Entry Confirmed + Access to Public Sandbox';

      if (nextScore === 3 && totalTimeSec < 10) {
        rank = 'S-TIER OVERLORD [TOP 1%]';
        rankBadge = '🏆';
        giftCode = 'GENX-OVERLORD-ELITE-99X';
        perk = 'VIP Sandbox Priority + Direct Whitelist + 10 Bonus Hint Tokens';
      } else if (nextScore === 3) {
        rank = 'A-TIER CODE HUNTER';
        rankBadge = '🥇';
        giftCode = 'GENX-HUNTER-ALPHA';
        perk = 'Early Sandbox Access + 5 Bonus Hint Tokens';
      } else if (nextScore === 2) {
        rank = 'B-TIER SECURITY SPECIALIST';
        rankBadge = '🥈';
        giftCode = 'GENX-SPECIALIST-BETA';
        perk = 'Qualifier Advantage + 2 Bonus Hint Tokens';
      }

      setVirtualGift({ name: operative, rank, badge: rankBadge, code: giftCode, perk, score: nextScore, time: totalTimeSec });

      if (window.trigger3DGlitch) window.trigger3DGlitch(3.0);

      setHistory((prev) => [
        ...prev,
        ...feedbackLines,
        { text: '================ MISSION COMPLETE: RANKINGS ================', class: 'accent' },
        { text: `OPERATIVE: ${operative}`, class: 'accent' },
        { text: `SCORE: ${nextScore}/3 CORRECT  |  SPEED: ${totalTimeSec}s`, class: 'amber' },
        { text: `OFFICIAL RANK: ${rankBadge} ${rank}`, class: 'accent' },
        { text: `[🎁 VIRTUAL OPERATIVE PASS ISSUED]: ${giftCode}`, class: 'accent' },
        { text: `PERK: ${perk}`, class: 'info' },
        { text: 'Type "play" to retry for a higher rank or "participate" to lock your registration!', class: 'amber' }
      ]);
    }
  };

  const showEventDetails = () => {
    setHistory((prev) => [
      ...prev,
      { text: '================ EVENT DETAILS // PROMPT://INJECTION ================', class: 'accent' },
      { text: 'ORGANIZER: AI GenX Club', class: 'info' },
      { text: 'LAST DAY TO REGISTER: 07 OCT, 1:00 PM', class: 'amber' },
      { text: 'PHOTOS RELEASE: 07 OCT, 4:00 PM', class: 'info' },
      { text: 'ROUND 1 (ONLINE QUALIFIER): 07 OCT (4:00 PM) – 08 OCT (6:00 PM)', class: 'amber' },
      { text: '  - Reverse-engineer secret AI photos into latent prompts.', class: 'info' },
      { text: '  - Results: 09 OCT, 8:00 PM -> Top 30 Shortlisted', class: 'accent' },
      { text: 'ROUND 2 (IN-COLLEGE LIVE BUILD): 10 OCT, 10:00 AM – 1:30 PM', class: 'amber' },
      { text: '  - Live build on 5 Themes revealed directly at the event.', class: 'info' },
      { text: '  - Results: 11 OCT, 4:00 PM -> Top 10 Shortlisted', class: 'accent' },
      { text: 'ROUND 3 (FLAGSHIP GRAND FINALS): 12 OCT, 11:00 AM ONWARDS', class: 'amber' },
      { text: '  - Live defense, jury review, and flagship awards.', class: 'info' },
      { text: 'PRIZES: Flagship Trophies, Certificates, Industry Recognition & Merch.', class: 'accent' },
      { text: 'Type "participate" for registration steps or "play" for the bug hunt.', class: 'info' }
    ]);
  };

  const showParticipationGuide = () => {
    setHistory((prev) => [
      ...prev,
      { text: '================ HOW TO PARTICIPATE ================', class: 'accent' },
      { text: 'STEP 1: Submit clearance before registration closes: 07 OCT, 1:00 PM.', class: 'info' },
      { text: 'STEP 2: Access secret AI photos released online: 07 OCT, 4:00 PM.', class: 'info' },
      { text: 'STEP 3: Submit reverse prompt solutions before 08 OCT, 6:00 PM.', class: 'info' },
      { text: 'STEP 4: Top 30 Shortlisted report for Round 2 in college on 10 OCT (10:00 AM - 1:30 PM).', class: 'accent' },
      { text: 'STEP 5: 5 secret themes revealed live to design and build your web solution.', class: 'info' },
      { text: 'STEP 6: Top 10 Finalists compete in the Main Event Arena on 12 OCT (11:00 AM onwards).', class: 'amber' },
      { text: 'Type "register" to open registration directly or click the button below.', class: 'accent' }
    ]);
  };

  const executeCmd = (cmdText) => {
    const raw = cmdText.trim();
    if (!raw) return;

    setHistory((prev) => [...prev, { text: `root@prompt-injection:~# ${cmdText}`, class: 'accent' }]);

    // If awaiting player name, record and start game!
    if (gameState.awaitingName) {
      initGameWithName(raw);
      return;
    }

    const clean = raw.toLowerCase();

    if (clean === '1' || clean === 'option 1' || clean === 'a') {
      handleAnswer(0);
      return;
    }
    if (clean === '2' || clean === 'option 2' || clean === 'b') {
      handleAnswer(1);
      return;
    }
    if (clean === '3' || clean === 'option 3' || clean === 'c') {
      handleAnswer(2);
      return;
    }

    switch (clean) {
      case 'play':
      case 'start':
      case 'game':
        promptForName();
        break;

      case 'details':
      case 'event':
      case 'info':
        showEventDetails();
        break;

      case 'participate':
      case 'join':
      case 'how':
        showParticipationGuide();
        break;

      case 'register':
        if (onNavigate) onNavigate('register');
        setHistory((prev) => [...prev, { text: 'OPENING REGISTRATION CLEARANCE PORTAL...', class: 'accent' }]);
        break;

      case 'help':
        setHistory((prev) => [
          ...prev,
          { text: '================ TERMINAL COMMAND LIST ================', class: 'accent' },
          { text: '  play            — Enter name & Start 3-Q Python/Tech Speedrun', class: 'amber' },
          { text: '  1, 2, 3         — Select answer option during bug hunting game', class: 'info' },
          { text: '  details         — View complete event dates, rounds & prize details', class: 'info' },
          { text: '  participate     — Step-by-step participation & registration guide', class: 'accent' },
          { text: '  register        — Open Registration Clearance Portal', class: 'accent' },
          { text: '  clear           — Purge terminal console buffer', class: 'info' }
        ]);
        break;

      case 'clear':
        setHistory([]);
        break;

      default:
        setHistory((prev) => [
          ...prev,
          { text: `bash: command not found: "${cmdText}". Type "play", "details", "participate", or "help".`, class: 'error' }
        ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCmd(inputVal);
      setInputVal('');
    }
  };

  return (
    <section className="block" id="terminal" data-video-id="terminal">
      <div className="section-head">
        <div className="file-tag red"><span className="pulse"></span>FILE_00 — TERMINAL ARENA</div>
        <h2>Interactive Bug Hunting Console</h2>
        <p>Hunt code bugs, solve technical dilemmas, unlock your operative rank, and review event briefing protocols.</p>
      </div>

      <div className="terminal-grid-wrap" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
        gap: '1.8rem',
        alignItems: 'start'
      }}>
        {/* Left: Terminal Video Feed */}
        <div className="cyber-video-frame">
          <div style={{ position: 'absolute', top: '10px', left: '12px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }}></span>
            <span style={{ fontSize: '0.7rem', color: 'var(--red)', letterSpacing: '0.12em', fontWeight: 700 }}>
              TERMINAL AI OVERLORD
            </span>
          </div>

          <button
            onClick={() => mediaManager.toggleMute('terminal')}
            style={{
              position: 'absolute',
              top: '8px',
              right: '10px',
              zIndex: 10,
              background: isVideoMuted ? 'rgba(0,0,0,0.7)' : 'rgba(25, 255, 110, 0.2)',
              border: isVideoMuted ? '1px solid var(--line-blood)' : '1px solid var(--green)',
              color: isVideoMuted ? 'var(--red)' : 'var(--green)',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.08em',
              backdropFilter: 'blur(6px)'
            }}
          >
            {isVideoMuted ? '🔇 UNMUTE' : '🔊 LIVE'}
          </button>

          <video
            ref={videoRef}
            src="/assets/terminal.mp4"
            autoPlay
            muted={isVideoMuted}
            playsInline
            className="cyber-video-element"
          />
        </div>

        {/* Right: Interactive Terminal */}
        <div className="terminal-shell" style={{ margin: 0 }}>
          <div className="terminal-header">
            <div className="terminal-dots">
              <span></span><span></span><span></span>
            </div>
            <div>root@prompt-injection:~ ({gameState.awaitingName ? 'NAME_REGISTRATION' : gameState.active ? `OPERATIVE: ${gameState.playerName}` : 'BUG_HUNTER_CONSOLE'})</div>
            <div style={{ color: gameState.active ? 'var(--red)' : 'var(--green)' }}>
              {gameState.active ? `[QUESTION ${gameState.currentIndex + 1}/3]` : gameState.awaitingName ? '[WAITING FOR NAME]' : '[SYSTEM IDLE]'}
            </div>
          </div>

          <div className="terminal-body" ref={bodyRef} style={{ minHeight: '320px', maxHeight: '420px' }}>
            <div className="terminal-output">
              {history.map((line, idx) => (
                <div key={idx} className={`term-line ${line.class || ''}`} style={{ whiteSpace: 'pre-wrap' }}>
                  {line.text}
                </div>
              ))}
            </div>

            <div className="terminal-input-row">
              <span className="terminal-prompt">root@prompt-injection:~#</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className="term-input"
                placeholder={
                  gameState.awaitingName
                    ? "type your name (e.g. Alex / Neo) and press Enter..."
                    : gameState.active
                    ? "type '1', '2', or '3'..."
                    : "type 'play', 'details', 'participate'..."
                }
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Dynamic Shortcuts Bar */}
          <div className="term-shortcuts" style={{ flexWrap: 'wrap', gap: '6px' }}>
            {gameState.active ? (
              <>
                <span style={{ color: 'var(--red)', fontWeight: 700 }}>SUBMIT ANSWER:</span>
                <button className="shortcut-btn" style={{ borderColor: 'var(--green)', color: 'var(--green)' }} onClick={() => handleAnswer(0)}>Option [1]</button>
                <button className="shortcut-btn" style={{ borderColor: 'var(--amber)', color: 'var(--amber)' }} onClick={() => handleAnswer(1)}>Option [2]</button>
                <button className="shortcut-btn" style={{ borderColor: 'var(--red)', color: 'var(--red)' }} onClick={() => handleAnswer(2)}>Option [3]</button>
              </>
            ) : gameState.awaitingName ? (
              <>
                <span style={{ color: 'var(--green)', fontWeight: 700 }}>STEP 1:</span>
                <span style={{ color: 'var(--ink-dim)', fontSize: '0.8rem' }}>Type your name in the box above and press Enter ↵</span>
              </>
            ) : (
              <>
                <span>SHORTCUTS:</span>
                <button className="shortcut-btn" style={{ background: 'rgba(25, 255, 110, 0.15)', borderColor: 'var(--green)', color: 'var(--green)', fontWeight: 700 }} onClick={promptForName}>
                  🎯 START BUG HUNT (3 Qs)
                </button>
                <button className="shortcut-btn" onClick={showEventDetails}>📋 Event Details</button>
                <button className="shortcut-btn" onClick={showParticipationGuide}>🚀 How To Participate</button>
                <button className="shortcut-btn" onClick={() => executeCmd('clear')}>Clear</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Virtual Gift Reward Card Popup when unlocked */}
      {virtualGift && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          borderRadius: '10px',
          border: '2px solid var(--green)',
          background: 'linear-gradient(135deg, rgba(7, 31, 16, 0.95), rgba(4, 4, 5, 0.98))',
          boxShadow: '0 0 30px rgba(25, 255, 110, 0.35)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>{virtualGift.badge}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--green)', letterSpacing: '0.15em', fontWeight: 700 }}>
            OFFICIAL RANKING // OPERATIVE IDENTIFIED
          </div>
          <h2 style={{ color: '#fff', margin: '0.4rem 0', fontSize: '1.6rem' }}>OPERATIVE: {virtualGift.name}</h2>
          <h3 style={{ color: 'var(--green)', margin: '0.2rem 0', fontSize: '1.3rem' }}>{virtualGift.rank}</h3>
          <p style={{ color: 'var(--ink-dim)', fontSize: '0.9rem', margin: '0.2rem 0 1rem 0' }}>
            Score: <strong>{virtualGift.score}/3</strong> | Speed: <strong>{virtualGift.time} seconds</strong>. Perk: {virtualGift.perk}
          </p>

          <div style={{
            display: 'inline-block',
            padding: '8px 18px',
            background: 'rgba(0,0,0,0.6)',
            border: '1px dashed var(--green)',
            borderRadius: '6px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--green)',
            fontSize: '1rem',
            letterSpacing: '0.1em',
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            VIRTUAL PASS CODE: {virtualGift.code}
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => onNavigate && onNavigate('register')}>
              <span>Apply Code At Registration &rarr;</span>
            </button>
            <button className="btn btn-ghost" onClick={promptForName}>
              <span>Play Again 🔄</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
