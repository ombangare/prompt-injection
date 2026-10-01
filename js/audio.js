// =========================================================
// PROCEDURAL HORROR HACKER AUDIO SYNTHESIZER
// Web Audio API engine: Ambient Drones, Heartbeats, Glitch SFX,
// Keyclicks, Geiger Radiation, and Bio-Alarms (Zero MP3 dependencies)
// =========================================================
(function () {
  let ctx = null;
  let isMuted = false;
  let masterGain = null;
  let ambientDrone = null;
  let heartbeatInterval = null;

  function initAudio() {
    if (ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioContext();
      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.28, ctx.currentTime);
      masterGain.connect(ctx.destination);
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  // 1. Ambient Low Horror Drone
  function startAmbient() {
    if (!ctx || ambientDrone) return;
    try {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const droneGain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(45, ctx.currentTime); // Deep F#0

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(46.8, ctx.currentTime); // Dissonant binaural beat

      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(90, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, ctx.currentTime);

      droneGain.gain.setValueAtTime(0.18, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(masterGain);

      osc1.start();
      osc2.start();
      osc3.start();

      ambientDrone = { osc1, osc2, osc3, gain: droneGain };
    } catch (err) {}
  }

  function stopAmbient() {
    if (!ambientDrone) return;
    try {
      ambientDrone.gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      setTimeout(() => {
        if (ambientDrone) {
          ambientDrone.osc1.stop();
          ambientDrone.osc2.stop();
          ambientDrone.osc3.stop();
          ambientDrone = null;
        }
      }, 250);
    } catch (e) {}
  }

  // 2. Heavy Sub-Bass Heartbeat
  function playHeartbeat() {
    if (!ctx || isMuted) return;
    try {
      const now = ctx.currentTime;
      triggerThump(now, 90, 35, 0.18, 0.45);
      triggerThump(now + 0.24, 110, 30, 0.14, 0.35);
    } catch (e) {}
  }

  function triggerThump(startTime, startFreq, endFreq, duration, volume) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // 3. Cyber / Glitch EMP Static Burst
  window.playGlitchSound = function (intensity = 1.0) {
    if (!ctx || isMuted) return;
    try {
      const bufferSize = Math.floor(ctx.sampleRate * 0.16);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 + Math.random() * 1200, ctx.currentTime);
      filter.Q.setValueAtTime(4, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35 * intensity, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      noise.start();
    } catch (e) {}
  };

  // 4. Mechanical Keystroke Click
  window.playKeySound = function () {
    if (!ctx || isMuted) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const freq = 700 + Math.random() * 500;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch (e) {}
  };

  // 5. Emergency Bio-Alarm Sirens
  window.playAlarmSound = function () {
    if (!ctx || isMuted) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.linearRampToValueAtTime(980, now + 0.22);
      osc.frequency.linearRampToValueAtTime(520, now + 0.45);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  };

  // Toggle & Unlock Audio
  window.toggleHackerAudio = function (forceState) {
    initAudio();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }

    if (typeof forceState === 'boolean') {
      isMuted = !forceState;
    } else {
      isMuted = !isMuted;
    }

    const btn = document.getElementById('audio-toggle-btn');
    const statusText = document.getElementById('audio-status-text');

    if (!isMuted) {
      if (masterGain) {
        masterGain.gain.cancelScheduledValues(ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.3);
      }
      startAmbient();
      if (!heartbeatInterval) {
        heartbeatInterval = setInterval(playHeartbeat, 2200);
      }
      playHeartbeat();
      window.playGlitchSound(1.5);
      if (btn) btn.classList.add('active');
      if (statusText) statusText.textContent = 'SOUND: ONLINE';
    } else {
      if (masterGain) {
        masterGain.gain.cancelScheduledValues(ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      }
      stopAmbient();
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
      if (btn) btn.classList.remove('active');
      if (statusText) statusText.textContent = 'SOUND: MUTED';
    }

    return !isMuted;
  };

  // Auto-init on very first interaction anywhere
  function userInteractUnlock() {
    initAudio();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    if (!isMuted && !ambientDrone) {
      startAmbient();
      if (!heartbeatInterval) heartbeatInterval = setInterval(playHeartbeat, 2200);
    }
  }
  window.addEventListener('click', userInteractUnlock, { once: false });
  window.addEventListener('keydown', userInteractUnlock, { once: false });

  // Keystrokes sound on links/buttons
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, input, .btn, .card, .term-input')) {
      window.playKeySound();
    }
  });

  window.initAudioEngine = initAudio;
})();
