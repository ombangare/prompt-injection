// Centralized Video & Audio Manager for Cyber Horror Event
// Flow:
// 1. Initial Page Load: Welcome (Hero) video ONLY plays 1 time with audio, then stops.
// 2. Scroll / Tap "Terminal": Terminal video starts and plays 1 time with audio, then stops.
// 3. Scroll / Tap "Rounds": Rounds video starts and plays 1 time with audio, then stops.
// 4. Tap "Team": Team video plays 1 time with audio, then stops.
// 5. Tap "Registration": Register video plays 1 time with audio, then stops.
// 6. Submit Registration: Confirmation video plays 1 time with audio, then stops.
// Non-active videos remain strictly PAUSED. No multiple videos decoding at once.

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

    // ONLY hero starts on initial load. All other videos stay paused until visited/scrolled
    if (id === 'hero' && !this.hasPlayed.hero) {
      this.playAudioOnce('hero');
    } else if (id === this.activeId && !this.hasPlayed[id]) {
      this.playAudioOnce(id);
    } else {
      videoElement.pause();
      videoElement.muted = true;
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

    // Pause all other videos completely so only 1 video runs at a time
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

    // Attempt unmuted play with full volume
    targetVideo.muted = false;
    targetVideo.volume = 1.0;

    const p = targetVideo.play();
    if (p !== undefined) {
      p.then(() => {
        this.isAudioUnlocked = true;
      }).catch(() => {
        // Fallback to muted playback if mobile security policy blocked cold audio before touch
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
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
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
        threshold: [0.35, 0.6],
        rootMargin: '0px 0px -10% 0px'
      }
    );

    elements.forEach((el) => {
      if (el) this.scrollObserver.observe(el);
    });
  }
}

const mediaManager = new MediaController();
export default mediaManager;
