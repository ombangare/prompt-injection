// =========================================================
// PROMPT://INJECTION — MASTER CLIENT INTERACTION ENGINE
// Terminal CLI, Decryption Chamber Mini-Game, Live Countdown,
// CRT/Audio Controllers, Glitch Text Scrambler & Breach Warning
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. HORROR BREACH WARNING MODAL
  // ==========================================
  const breachModal = document.getElementById('breach-modal');
  const enterBtn = document.getElementById('enter-breach-btn');
  const bypassBtn = document.getElementById('bypass-breach-btn');

  function dismissBreach() {
    if (breachModal && !breachModal.classList.contains('dismissed')) {
      breachModal.classList.add('dismissed');
      // Trigger sound if audio is enabled
      if (typeof window.playGlitchSound === 'function') {
        window.playGlitchSound(1.4);
      }
      if (typeof window.trigger3DGlitch === 'function') {
        window.trigger3DGlitch(1.8);
      }
    }
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      // Auto enable sound when entering breach
      if (typeof window.toggleHackerAudio === 'function') {
        window.toggleHackerAudio(true);
      }
      dismissBreach();
    });
  }

  if (bypassBtn) {
    bypassBtn.addEventListener('click', dismissBreach);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      dismissBreach();
    }
  });

  // ==========================================
  // 2. HUD QUICK CONTROLLERS (Audio & CRT)
  // ==========================================
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (typeof window.toggleHackerAudio === 'function') {
        window.toggleHackerAudio();
      }
    });
  }

  const crtToggleBtn = document.getElementById('crt-toggle-btn');
  if (crtToggleBtn) {
    crtToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('no-crt');
      const isCrtOn = !document.body.classList.contains('no-crt');
      crtToggleBtn.classList.toggle('active', isCrtOn);
      const label = crtToggleBtn.querySelector('.crt-label');
      if (label) label.textContent = isCrtOn ? 'CRT: ON' : 'CRT: OFF';
      if (typeof window.playKeySound === 'function') window.playKeySound();
    });
  }

  const targetDate = new Date('2026-10-07T13:00:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (diff > 0 && daysEl && hoursEl && minsEl && secsEl) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(mins).padStart(2, '0');
      secsEl.textContent = String(secs).padStart(2, '0');
    }
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==========================================
  // 4. INTERACTIVE HACKER TERMINAL (Live CLI)
  // ==========================================
  const termInput = document.getElementById('term-input');
  const termOutput = document.getElementById('term-output');

  const commands = {
    help: () => [
      { text: '================ SYSTEM COMMAND LIST ================', class: 'accent' },
      { text: '  help       — Display this diagnostic cheat sheet', class: 'info' },
      { text: '  hack       — Trigger full-scale emergency neural breach', class: 'error' },
      { text: '  scan       — Perform port & vulnerability reconnaissance', class: 'amber' },
      { text: '  decrypt    — Jump to Reverse Prompt Decryption Chamber', class: 'info' },
      { text: '  rounds     — View Round 1 & Round 2 battle parameters', class: 'info' },
      { text: '  register   — Initiate clearance & lock participant slot', class: 'accent' },
      { text: '  whoami     — Read current terminal intruder dossier', class: 'info' },
      { text: '  status     — Inspect live event subsystem integrity', class: 'info' },
      { text: '  matrix     — Overdrive falling glyph velocity', class: 'info' },
      { text: '  clear      — Purge terminal memory buffer', class: 'info' }
    ],
    status: () => [
      { text: '[+] SYSTEM CORE: CORRUPTED (NEURAL OVERLOAD)', class: 'error' },
      { text: '[+] EVENT: PROMPT://INJECTION 2026', class: 'accent' },
      { text: '[+] HOST: AI GenX Club', class: 'info' },
      { text: '[+] REGISTRATION PROTOCOL: ACTIVE (SLOTS LIMITED)', class: 'amber' },
      { text: '[+] DEFENSE GRID: LEVEL 0 — WIDE OPEN', class: 'error' }
    ],
    whoami: () => [
      { text: 'IDENT: UNREGISTERED_INTRUDER_#666', class: 'accent' },
      { text: 'CLEARANCE: PROVISIONAL GUEST', class: 'amber' },
      { text: 'MISSION: REVERSE-ENGINEER THE MACHINE OR BE PURGED.', class: 'error' }
    ],
    rounds: () => [
      { text: '=== EVENT TIMELINE & ROUND SPECIFICATIONS ===', class: 'accent' },
      { text: 'ROUND 01 (09 OCT 2026): REVERSE PROMPT INJECTION', class: 'amber' },
      { text: '  Reconstruct original AI generation prompt from raw visual output.', class: 'info' },
      { text: 'ROUND 02 (12 OCT 2026): SPEED BUILD SPRINT', class: 'amber' },
      { text: '  Code & ship an enterprise-grade web application live on-campus.', class: 'info' }
    ],
    scan: () => {
      if (typeof window.playAlarmSound === 'function') window.playAlarmSound();
      return [
        { text: 'INITIATING DEEP NETWORK SCAN...', class: 'amber' },
        { text: 'SCANNING PORTS 1-65535 on 127.0.0.1...', class: 'info' },
        { text: 'PORT 80/HTTP     [OPEN]  — SITE FRONTEND ACTIVE', class: 'info' },
        { text: 'PORT 443/HTTPS   [OPEN]  — SSL ENCRYPTION WEAKENED', class: 'info' },
        { text: 'PORT 666/BREACH  [OPEN]  — AI LATENT BACKDOOR COMPROMISED', class: 'error' },
        { text: 'VULNERABILITY LEVEL: CRITICAL (99.8% BREACH CONFIRMED)', class: 'error' }
      ];
    },
    hack: () => {
      document.body.classList.add('blood-alert');
      if (typeof window.trigger3DGlitch === 'function') window.trigger3DGlitch(2.5);
      if (typeof window.playGlitchSound === 'function') window.playGlitchSound(2.0);
      if (typeof window.playAlarmSound === 'function') window.playAlarmSound();
      setTimeout(() => document.body.classList.remove('blood-alert'), 4500);
      return [
        { text: '!!! CRITICAL SYSTEM BREACH INITIATED !!!', class: 'error' },
        { text: 'OVERRIDING SECURITY PROTOCOL OMEGA...', class: 'error' },
        { text: 'NEURAL CORE EMP PULSE DISCHARGED.', class: 'accent' }
      ];
    },
    decrypt: () => {
      const el = document.getElementById('decrypt-chamber');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return [{ text: 'REDIRECTING TO LATENT DECRYPTION CHAMBER...', class: 'amber' }];
    },
    register: () => {
      window.location.href = 'register.html';
      return [{ text: 'OPENING REGISTRATION GATEWAY...', class: 'accent' }];
    },
    matrix: () => {
      if (typeof window.trigger3DGlitch === 'function') window.trigger3DGlitch(1.2);
      return [{ text: 'MATRIX GLYPH STREAM DENSITY MAXIMIZED.', class: 'info' }];
    },
    clear: () => {
      if (termOutput) termOutput.innerHTML = '';
      return [];
    }
  };

  function appendTermLines(lines) {
    if (!termOutput) return;
    lines.forEach((l) => {
      const div = document.createElement('div');
      div.className = `term-line ${l.class || ''}`;
      div.textContent = l.text;
      termOutput.appendChild(div);
    });
    const parent = termOutput.parentElement;
    if (parent) parent.scrollTop = parent.scrollHeight;
  }

  function handleTermCommand(cmdText) {
    const raw = cmdText.trim().toLowerCase();
    if (!raw) return;

    appendTermLines([{ text: `root@prompt-injection:~# ${cmdText}`, class: 'accent' }]);

    if (commands[raw]) {
      const result = commands[raw]();
      if (result && result.length) appendTermLines(result);
    } else {
      appendTermLines([
        { text: `bash: command not found: "${cmdText}". Type "help" for available commands.`, class: 'error' }
      ]);
    }
  }

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = termInput.value;
        termInput.value = '';
        handleTermCommand(val);
        if (typeof window.playKeySound === 'function') window.playKeySound();
      }
    });
  }

  // Terminal quick shortcut buttons
  document.querySelectorAll('.shortcut-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        handleTermCommand(cmd);
        if (typeof window.playKeySound === 'function') window.playKeySound();
      }
    });
  });

  // ==========================================
  // 5. REVERSE PROMPT DECRYPTION CHAMBER (Mini-Game)
  // ==========================================
  const latentCanvas = document.getElementById('latent-canvas');
  const weightSlider = document.getElementById('slider-weight');
  const tempSlider = document.getElementById('slider-temp');
  const seedSlider = document.getElementById('slider-seed');
  const cipherOutput = document.getElementById('cipher-text');

  if (latentCanvas) {
    const ctx2 = latentCanvas.getContext('2d');
    let animFrame;

    function renderLatent() {
      latentCanvas.width = latentCanvas.parentElement.clientWidth || 400;
      latentCanvas.height = latentCanvas.parentElement.clientHeight || 250;

      const wVal = weightSlider ? parseFloat(weightSlider.value) : 50;
      const tVal = tempSlider ? parseFloat(tempSlider.value) : 0.7;
      const sVal = seedSlider ? parseInt(seedSlider.value) : 100;

      const time = performance.now() * 0.002;
      ctx2.fillStyle = '#050507';
      ctx2.fillRect(0, 0, latentCanvas.width, latentCanvas.height);

      // Draw neural wave lines
      for (let j = 0; j < 5; j++) {
        ctx2.beginPath();
        ctx2.strokeStyle = j % 2 === 0 ? 'rgba(255, 31, 31, 0.4)' : 'rgba(25, 255, 110, 0.4)';
        ctx2.lineWidth = 1.5;

        for (let x = 0; x < latentCanvas.width; x += 6) {
          const y =
            latentCanvas.height / 2 +
            Math.sin(x * 0.02 + time * (1 + tVal) + j) * (wVal * 0.4) +
            (Math.random() - 0.5) * (tVal * 15);
          if (x === 0) ctx2.moveTo(x, y);
          else ctx2.lineTo(x, y);
        }
        ctx2.stroke();
      }

      // Digital crosshairs
      ctx2.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx2.strokeRect(20, 20, latentCanvas.width - 40, latentCanvas.height - 40);

      animFrame = requestAnimationFrame(renderLatent);
    }
    renderLatent();

    function updateDecryptionText() {
      const w = weightSlider ? parseInt(weightSlider.value) : 50;
      const t = tempSlider ? parseFloat(tempSlider.value) : 0.7;

      document.getElementById('lbl-weight').textContent = w + '%';
      document.getElementById('lbl-temp').textContent = t.toFixed(2);
      document.getElementById('lbl-seed').textContent = seedSlider.value;

      if (w > 80 && t < 0.3) {
        cipherOutput.innerHTML =
          '<span style="color:var(--green)">[DECRYPTION COMPLETE]</span>: "Cybernetic bio-organism breached neural singularity, hyper-detailed red glowing optics, 8k octane render, cinematic lighting"';
      } else if (w > 50) {
        cipherOutput.innerHTML =
          '<span style="color:var(--amber)">[PARTIAL RECONSTRUCTION 64%]</span>: "Cybernetic bio-[██████] breached [████] singularity, red glowing [████], octane render"';
      } else {
        cipherOutput.innerHTML =
          '<span style="color:var(--red)">[CORRUPTED LATENT CIPHER]</span>: "[████████] [████] [████████████] [████] [██████] 8k [██████]"';
      }
    }

    [weightSlider, tempSlider, seedSlider].forEach((s) => {
      if (s) s.addEventListener('input', () => {
        updateDecryptionText();
        if (typeof window.playKeySound === 'function') window.playKeySound();
      });
    });
  }

  // ==========================================
  // 6. GLITCH TEXT SCRAMBLER HOVER
  // ==========================================
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
  document.querySelectorAll('.scramble-hover').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      const original = el.getAttribute('data-original') || el.innerText;
      el.setAttribute('data-original', original);
      let iteration = 0;
      clearInterval(el._interval);
      el._interval = setInterval(() => {
        el.innerText = original
          .split('')
          .map((letter, index) => {
            if (index < iteration) return original[index];
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join('');
        if (iteration >= original.length) clearInterval(el._interval);
        iteration += 1 / 3;
      }, 30);
    });
  });

  // ==========================================
  // 7. SCROLL REVEAL OBSERVER
  // ==========================================
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  // ==========================================
  // 8. MOBILE NAVIGATION
  // ==========================================
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  // ==========================================
  // 9. FAQ ACCORDIONS (Support page)
  // ==========================================
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    if (q) {
      q.addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach((i) => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    }
  });

  // ==========================================
  // 10. REGISTRATION 3D PASS SUBMISSION ANIMATION
  // ==========================================
  const regForm = document.getElementById('reg-form');
  const regModal = document.getElementById('reg-pass-modal');
  if (regForm && regModal) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('fullname')?.value || 'OPERATIVE';
      const phone = document.getElementById('phone')?.value || '';
      const branch = document.getElementById('branch')?.value || 'COMPUTER SCIENCE';
      const year = document.getElementById('year')?.value || '1st Year';
      const roll = document.getElementById('regno')?.value || 'GENX-0000';
      const randId = 'GENX-R1-' + Math.floor(1000 + Math.random() * 9000);

      const passName = document.getElementById('pass-name');
      const passPhone = document.getElementById('pass-phone');
      const passBranch = document.getElementById('pass-branch');
      const passYear = document.getElementById('pass-year');
      const passId = document.getElementById('pass-ticket-id');

      if (passName) passName.textContent = name.toUpperCase();
      if (passPhone) passPhone.textContent = phone;
      if (passBranch) passBranch.textContent = branch.toUpperCase();
      if (passYear) passYear.textContent = year;
      if (passId) passId.textContent = randId;

      // Send to Google Sheets if configured
      if (window.EVENT_CONFIG && window.EVENT_CONFIG.GOOGLE_SHEET_URL) {
        try {
          const params = new URLSearchParams({
            passId: randId,
            name: name.toUpperCase(),
            phone: phone,
            department: branch.toUpperCase(),
            year: year,
            rollNo: roll.toUpperCase(),
            round: 'Round 1: Online Qualifier',
            timestamp: new Date().toLocaleString()
          });
          fetch(window.EVENT_CONFIG.GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
          });
        } catch (err) {
          console.warn('Google Sheet submission warning:', err);
        }
      }

      // Audio and 3D shockwave feedback
      if (typeof window.playGlitchSound === 'function') window.playGlitchSound(2.2);
      if (typeof window.trigger3DGlitch === 'function') window.trigger3DGlitch(3.0);
      if (typeof window.playAlarmSound === 'function') window.playAlarmSound();

      regModal.classList.add('active');
      regForm.reset();
    });
  }

  // ==========================================
  // 11. TEAM AVATAR FALLBACKS
  // ==========================================
  function setupAvatarFallbacks() {
    document.querySelectorAll('.person-photo img').forEach((img) => {
      img.onerror = function () {
        this.style.display = 'none';
        if (!this.parentElement.querySelector('.initials-fallback')) {
          const initials = this.getAttribute('data-initials') || this.alt.charAt(0) || '>';
          const fallback = document.createElement('div');
          fallback.className = 'initials-fallback';
          fallback.textContent = initials;
          this.parentElement.appendChild(fallback);
        }
      };
      if (img.complete && img.naturalWidth === 0) {
        img.onerror();
      }
    });
  }
  setupAvatarFallbacks();
  setTimeout(setupAvatarFallbacks, 300);
});
