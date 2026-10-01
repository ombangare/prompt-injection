// Centralized Video & Audio Manager for Cyber Horror Event
// Flow:
// 1. Initial Page Load: Welcome (Hero) video plays with audio 1 time, then stops and stays off.
// 2. Scroll Down / Tap "Open Terminal": Terminal video plays with audio 1 time, then stops and stays off.
// 3. Scroll Down / Tap "Rounds": Rounds video plays with audio 1 time, then stops and stays off.
// 4. Tap "Team": Team video plays with audio 1 time, then stops and stays off.
// 5. Tap "Registration": Register video plays with audio 1 time, then stops and stays off.
// 6. Submit Registration: Confirmation video plays with audio 1 time, then stops and stays off.

import { toggleAudioState } from './AudioEngine';

class MediaController {
  constructor() {
    this.registeredVideos = new Map(); // id -> HTMLVideoElement
    this.cleanupHandlers = new Map(); // id -> function
    this.activeId = 'hero';
    this.isAudioUnlocked = false;
    this.hasPlayed = {
      hero: false,
      terminal: false,
      rounds: false,
      team: false,
      register: false,
      access_granted: false
    };

    if (typeof window !== 'undefined') {
      this.initUserInteractionUnlock();
      this.initScrollTracker();
    }
  }

  getCenterVisibleSection() {
    if (typeof window === 'undefined') return 'hero';
    if (window.scrollY < 120) return 'hero';

    const viewportCenter = window.innerHeight / 2;
    const sections = ['rounds', 'terminal', 'hero'];

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          return id;
        }
      }
    }
    return window.scrollY < 200 ? 'hero' : null;
  }

  initUserInteractionUnlock() {
    const unlock = () => {
      this.isAudioUnlocked = true;

      // Ensure Web Audio synth engine is active
      try {
        toggleAudioState(true);
      } catch (e) {}

      // If active video is currently playing muted due to initial autoplay restriction, unmute it
      const current = this.getCenterVisibleSection() || this.activeId || 'hero';
      const vid = this.registeredVideos.get(current);

      if (vid && !this.hasPlayed[current]) {
        vid.muted = false;
        vid.volume = 1.0;
        const p = vid.play();
        if (p !== undefined) {
          p.catch(() => {});
        }
      }

      ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click'].forEach(evt => {
        window.removeEventListener(evt, unlock);
      });
    };

    ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click'].forEach(evt => {
      window.addEventListener(evt, unlock, { passive: true });
    });
  }

  register(id, videoElement) {
    if (!videoElement) return;

    // Clean up any old listeners for this id
    if (this.cleanupHandlers.has(id)) {
      this.cleanupHandlers.get(id)();
      this.cleanupHandlers.delete(id);
    }

    videoElement.playsInline = true;
    videoElement.setAttribute('playsinline', 'true');
    videoElement.setAttribute('webkit-playsinline', 'true');
    videoElement.loop = false;
    videoElement.removeAttribute('loop');

    this.registeredVideos.set(id, videoElement);

    // Stop and stay off once 1 playthrough finishes
    const handleEnded = () => {
      videoElement.pause();
      this.hasPlayed[id] = true;
    };

    const handleStalled = () => {
      // Resume if network or buffer hiccup occurs
      if (!this.hasPlayed[id] && this.activeId === id) {
        videoElement.play().catch(() => {});
      }
    };

    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('stalled', handleStalled);

    this.cleanupHandlers.set(id, () => {
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('stalled', handleStalled);
    });

    // If hero on site open or active video, trigger playback
    if (id === 'hero' && !this.hasPlayed.hero) {
      this.playAudioOnce('hero');
    } else if (id === this.activeId && !this.hasPlayed[id]) {
      this.playAudioOnce(id);
    } else if (!this.hasPlayed[id]) {
      // Pause until visited
      videoElement.pause();
    }
  }

  unregister(id) {
    if (this.cleanupHandlers.has(id)) {
      this.cleanupHandlers.get(id)();
      this.cleanupHandlers.delete(id);
    }

    const vid = this.registeredVideos.get(id);
    if (vid) {
      vid.pause();
    }
    this.registeredVideos.delete(id);
    if (this.activeId === id) {
      this.activeId = null;
    }
  }

  playAudioOnce(targetId) {
    this.activeId = targetId;

    // Pause all other videos (otherwise off)
    this.registeredVideos.forEach((video, id) => {
      if (id !== targetId) {
        video.pause();
        video.muted = true;
      }
    });

    const targetVideo = this.registeredVideos.get(targetId);
    if (!targetVideo) return;

    // If already finished playing once, keep off/paused
    if (this.hasPlayed[targetId]) {
      targetVideo.pause();
      return;
    }

    targetVideo.loop = false;
    targetVideo.removeAttribute('loop');

    // Attempt unmuted play if audio is unlocked or requested
    targetVideo.muted = false;
    targetVideo.volume = 1.0;

    const startPlay = () => {
      const playPromise = targetVideo.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Video is playing smoothly with sound
          })
          .catch(() => {
            // Fallback: If browser restricted unmuted autoplay before first tap,
            // play muted so video renders first frames, then user tap will unmute
            targetVideo.muted = true;
            targetVideo.play().catch(() => {});
          });
      }
    };

    if (targetVideo.readyState >= 2) {
      startPlay();
    } else {
      // Wait for video data to be ready so it doesn't freeze
      targetVideo.addEventListener('canplay', startPlay, { once: true });
    }
  }

  setActive(targetId) {
    this.playAudioOnce(targetId);
  }

  initScrollTracker() {
    let scrollTimeout = null;

    const checkScrollSection = () => {
      const currentSection = this.getCenterVisibleSection();
      if (!currentSection) return;

      if (this.activeId !== currentSection) {
        if (!this.hasPlayed[currentSection]) {
          this.playAudioOnce(currentSection);
        } else {
          this.activeId = currentSection;
          this.registeredVideos.forEach((vid) => {
            vid.pause();
            vid.muted = true;
          });
        }
      }
    };

    window.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkScrollSection, 80);
    }, { passive: true });
  }

  setupScrollObserver() {
    // Scroll tracker handles accurate viewport centering
  }
}

const mediaManager = new MediaController();
export default mediaManager;
