// =========================================================
// HORROR ROBOTIC AUDIO & VOICE SYNTHESIS ENGINE
// Demonic Robotic Speech with Real-time Lip-Sync & Mouth Articulation
// =========================================================

let ctx = null;
let masterGain = null;
let ambientDrone = null;
let isMuted = false;

export function initAudio() {
  if (ctx) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.4, ctx.currentTime);
    masterGain.connect(ctx.destination);
  } catch (e) {
    console.warn('AudioContext not supported', e);
  }
}

// Global speaking state for 3D mouth articulation
window.skullSpeaking = false;
window.skullSpeechIntensity = 0;

let lipSyncInterval = null;

function triggerSpeechLipSync(durationMs) {
  if (lipSyncInterval) clearInterval(lipSyncInterval);

  window.skullSpeaking = true;
  const startTime = performance.now();

  lipSyncInterval = setInterval(() => {
    const elapsed = performance.now() - startTime;
    if (elapsed > durationMs || !window.skullSpeaking) {
      clearInterval(lipSyncInterval);
      lipSyncInterval = null;
      window.skullSpeaking = false;
      window.skullSpeechIntensity = 0;
    } else {
      // Natural speech phonetic syllable cadence modulation (vowels = wide open, consonants = smaller)
      const primaryRhythm = Math.abs(Math.sin(elapsed * 0.016));
      const secondaryRhythm = Math.abs(Math.sin(elapsed * 0.035)) * 0.3;
      const noise = Math.random() * 0.2;
      window.skullSpeechIntensity = Math.min(1.0, primaryRhythm * 0.75 + secondaryRhythm + noise);
    }
  }, 35);
}

// 1. Deep Horrifying Robotic Voice Generator
export function speakRoboticVoice(text, onEnd) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 0.12; // Ultra-deep demonic cyber pitch
  utterance.rate = 0.75;  // Menacing robotic speed
  utterance.volume = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const deepVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('David') || v.name.includes('Google') || v.name.includes('Male') || v.name.includes('Natural')));
  if (deepVoice) utterance.voice = deepVoice;

  // Approximate duration based on word count
  const wordCount = text.split(' ').length;
  const estimatedDuration = (wordCount / 1.7) * 1000 + 800;
  triggerSpeechLipSync(estimatedDuration);

  // Boundary event to pulse jaw on each word
  utterance.onboundary = () => {
    window.skullSpeechIntensity = 0.95;
    if (window.trigger3DGlitch) window.trigger3DGlitch(0.2);
  };

  utterance.onend = () => {
    window.skullSpeaking = false;
    window.skullSpeechIntensity = 0;
    if (lipSyncInterval) {
      clearInterval(lipSyncInterval);
      lipSyncInterval = null;
    }
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    window.skullSpeaking = false;
    window.skullSpeechIntensity = 0;
    if (lipSyncInterval) {
      clearInterval(lipSyncInterval);
      lipSyncInterval = null;
    }
  };

  playDemonicSubRumble();
  window.speechSynthesis.speak(utterance);
}

// Initial Auto-Greeting: "Welcome to Prompt Injection"
export function speakHorrorWelcome() {
  initAudio();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
  speakRoboticVoice('Welcome to Prompt Injection. Decode the machine, or be purged.');
  startAmbient();
}

// Registration Page Instruction: "Fill out the forms..."
export function speakRegistrationPrompt() {
  initAudio();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
  speakRoboticVoice('Fill out the form. Lock your entry to the machine.');
  startAmbient();
}

// Registration Success Voice: "Thanks. We will meet at the event."
export function speakRegistrationSuccess(name) {
  initAudio();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
  const msg = name 
    ? `Access granted, ${name}. Thanks. We will meet at the event.` 
    : 'Access granted. Thanks. We will meet at the event.';
  speakRoboticVoice(msg);
  playDemonicSubRumble();
}

// 2. Demonic Sub-Bass Impact (Clean, deep, terrifying)
export function playDemonicSubRumble() {
  initAudio();
  if (!ctx || isMuted) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(24, now + 1.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + 1.2);

    gain.gain.setValueAtTime(0.65, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 1.5);
  } catch (e) {}
}

export const playLockdownDrop = playDemonicSubRumble;

// 3. Subtle Atmospheric Sub-Drone
export function startAmbient() {
  initAudio();
  if (!ctx || ambientDrone || isMuted) return;
  try {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(38, ctx.currentTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(40, ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, ctx.currentTime);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc1.start();
    osc2.start();

    ambientDrone = { osc1, osc2, gain };
  } catch (e) {}
}

export function stopAmbient() {
  if (!ambientDrone) return;
  try {
    ambientDrone.gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
    setTimeout(() => {
      if (ambientDrone) {
        ambientDrone.osc1.stop();
        ambientDrone.osc2.stop();
        ambientDrone = null;
      }
    }, 250);
  } catch (e) {}
}

// 4. Subtle Mechanical Key Click
export function playKeyClick(freq = 600, vol = 0.04) {
  if (!ctx || isMuted) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {}
}

// 5. Audio State Toggle
export function toggleAudioState(forceState) {
  initAudio();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }

  isMuted = typeof forceState === 'boolean' ? !forceState : !isMuted;

  if (!isMuted) {
    if (masterGain) {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.2);
    }
    startAmbient();
  } else {
    if (masterGain) {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
    }
    stopAmbient();
  }

  return !isMuted;
}
