// Centralized Video & Audio Manager for Cyber Horror Event
// Guarantees:
// 1. Mobile & Desktop Autoplay: Starts playing automatically on page load.
// 2. Audio playback: Plays 1 time with sound when visited / scrolled to, then stops and remains off.
// 3. Robust unlocking: Mobile gesture listener instantly enables audio on first touch/interaction.

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

  unmuteCurrentVideo() {
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
  }

  initUserInteractionUnlock() {
    const unlock = () => {
      this.isAudioUnlocked = true;

      // Ensure Web Audio synth engine is active
      try {
        toggleAudioState(true);
      } catch (e) {}

      // Unmute and start sound for the active video on user touch/click/scroll
      this.unmuteCurrentVideo();

      ['pointerdown', 'touchstart', 'touchend', 'mousedown', 'keydown', 'click', 'scroll'].forEach(evt => {
        window.removeEventListener(evt, unlock);
      });
    };

    ['pointerdown', 'touchstart', 'touchend', 'mousedown', 'keydown', 'click', 'scroll'].forEach(evt => {
      window.addEventListener(evt, unlock, { passive: true, capture: true });
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

    // Pause all other videos
    this.registeredVideos.forEach((video, id) => {
      if (id !== targetId) {
        video.pause();
        video.muted = true;
      }
    });

    const targetVideo = this.registeredVideos.get(targetId);
    if (!targetVideo) return;

    // If already finished playing once, keep off
    if (this.hasPlayed[targetId]) {
      targetVideo.pause();
      return;
    }

    targetVideo.loop = false;
    targetVideo.removeAttribute('loop');

    // If audio is unlocked or on explicit navigation, try unmuted first
    if (this.isAudioUnlocked || targetId !== 'hero') {
      targetVideo.muted = false;
      targetVideo.volume = 1.0;
    } else {
      // For initial site load on mobile, start muted so mobile autoplay never gets blocked
      targetVideo.muted = true;
    }

    const startPlay = () => {
      if (targetVideo.currentTime > targetVideo.duration - 0.5) {
        try { targetVideo.currentTime = 0; } catch (e) {}
      }

      const playPromise = targetVideo.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // If it started playing and user had already unlocked audio, ensure unmuted
            if (this.isAudioUnlocked && targetVideo.muted) {
              targetVideo.muted = false;
              targetVideo.volume = 1.0;
            }
          })
          .catch((err) => {
            // Autoplay policy prevented unmuted play, fall back to muted so video plays automatically
            targetVideo.muted = true;
            targetVideo.play().catch(() => {});
          });
      }
    };

    if (targetVideo.readyState >= 2) {
      startPlay();
    } else {
      targetVideo.addEventListener('canplay', startPlay, { once: true });
      // Safety trigger in case canplay already fired
      setTimeout(startPlay, 50);
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
