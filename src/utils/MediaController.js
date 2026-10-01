// Centralized Video & Audio Manager for Cyber Horror Event
// Guarantees:
// 1. Crystal clear audio on Laptop/Desktop & Mobile.
// 2. Continuous 1-time playback from start to end with sound when visited, then stops.
// 3. Reliable unmuting on any user interaction across all devices.

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
    }
  }

  unmuteActiveVideo() {
    const vid = this.registeredVideos.get(this.activeId);
    if (vid && !this.hasPlayed[this.activeId]) {
      vid.muted = false;
      vid.volume = 1.0;
      if (vid.paused) {
        vid.play().catch(() => {});
      }
    }
  }

  initUserInteractionUnlock() {
    const unlock = () => {
      this.isAudioUnlocked = true;

      try {
        toggleAudioState(true);
      } catch (e) {}

      this.unmuteActiveVideo();

      ['pointerdown', 'touchstart', 'touchend', 'mousedown', 'keydown', 'click', 'wheel'].forEach(evt => {
        window.removeEventListener(evt, unlock);
      });
    };

    ['pointerdown', 'touchstart', 'touchend', 'mousedown', 'keydown', 'click', 'wheel'].forEach(evt => {
      window.addEventListener(evt, unlock, { passive: true, capture: true });
    });
  }

  register(id, videoElement) {
    if (!videoElement) return;

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

    const handleEnded = () => {
      videoElement.pause();
      this.hasPlayed[id] = true;
    };

    videoElement.addEventListener('ended', handleEnded);

    this.cleanupHandlers.set(id, () => {
      videoElement.removeEventListener('ended', handleEnded);
    });

    // Start playing if it's the active video and has not completed its cycle
    if (id === this.activeId && !this.hasPlayed[id]) {
      this.playAudioOnce(id);
    } else if (id === 'hero' && !this.hasPlayed.hero) {
      this.playAudioOnce('hero');
    } else if (this.hasPlayed[id]) {
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

    if (this.hasPlayed[targetId]) {
      targetVideo.pause();
      return;
    }

    targetVideo.loop = false;
    targetVideo.removeAttribute('loop');

    // Always attempt unmuted playback with full volume
    targetVideo.muted = false;
    targetVideo.volume = 1.0;

    const p = targetVideo.play();
    if (p !== undefined) {
      p.then(() => {
        this.isAudioUnlocked = true;
      }).catch(() => {
        // If initial cold load blocked sound on mobile before first gesture,
        // play muted so video renders, and first touch/click will unmute it instantly
        targetVideo.muted = true;
        targetVideo.play().catch(() => {});
      });
    }
  }

  setActive(targetId) {
    this.playAudioOnce(targetId);
  }

  setupScrollObserver(elements) {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }

    this.scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            const sectionId = entry.target.getAttribute('data-video-id') || entry.target.id;
            if (sectionId && this.activeId !== sectionId) {
              if (!this.hasPlayed[sectionId]) {
                this.playAudioOnce(sectionId);
              } else {
                this.activeId = sectionId;
                this.registeredVideos.forEach((vid, id) => {
                  if (id !== sectionId) vid.pause();
                });
              }
            }
          }
        });
      },
      {
        threshold: [0.4, 0.6],
        rootMargin: '0px 0px -15% 0px'
      }
    );

    elements.forEach((el) => {
      if (el) this.scrollObserver.observe(el);
    });
  }
}

const mediaManager = new MediaController();
export default mediaManager;
