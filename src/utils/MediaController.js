// Centralized Video & Audio Manager for Cyber Horror Event
// Flow:
// 1. Initial Page Load: Welcome (Hero) video plays with audio 1 time, then stops and stays off.
// 2. Scroll Down / Tap "Open Terminal": Terminal video plays with audio 1 time, then stops and stays off.
// 3. Scroll Down / Tap "Rounds": Rounds video plays with audio 1 time, then stops and stays off.
// 4. Tap "Team": Team video plays with audio 1 time, then stops and stays off.
// 5. Tap "Registration": Register video plays with audio 1 time, then stops and stays off.
// 6. Submit Registration: Confirmation video plays with audio 1 time, then stops and stays off.
// Otherwise all non-active/finished videos remain OFF (paused). Looping is completely disabled.

import { toggleAudioState } from './AudioEngine';

class MediaController {
  constructor() {
    this.registeredVideos = new Map(); // id -> HTMLVideoElement
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

      // Ensure Web Audio context is started
      try {
        toggleAudioState(true);
      } catch (e) {}

      const current = this.getCenterVisibleSection() || this.activeId || 'hero';
      const vid = this.registeredVideos.get(current);

      if (vid && !this.hasPlayed[current]) {
        this.playAudioOnce(current);
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

    const handleTimeUpdate = () => {
      // Fallback in case ended event is delayed on some browsers
      if (videoElement.duration > 1 && videoElement.currentTime >= videoElement.duration - 0.2) {
        videoElement.pause();
        this.hasPlayed[id] = true;
      }
    };

    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);

    // When registered:
    // If it's hero and hasn't played yet, trigger initial playback
    if (id === 'hero' && !this.hasPlayed.hero) {
      this.playAudioOnce('hero');
    } else if (id === this.activeId && !this.hasPlayed[id]) {
      this.playAudioOnce(id);
    } else {
      // Otherwise keep OFF
      videoElement.pause();
      videoElement.muted = true;
    }
  }

  unregister(id) {
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

    // Pause and mute all other videos (otherwise off)
    this.registeredVideos.forEach((video, id) => {
      if (id !== targetId) {
        video.pause();
        video.muted = true;
      }
    });

    const targetVideo = this.registeredVideos.get(targetId);
    if (!targetVideo) return;

    // If it already played its 1-time video, do not re-play, keep off
    if (this.hasPlayed[targetId]) {
      targetVideo.pause();
      return;
    }

    targetVideo.loop = false;
    targetVideo.removeAttribute('loop');
    targetVideo.muted = false;
    targetVideo.volume = 1.0;

    // Reset to start and play
    try {
      targetVideo.currentTime = 0;
    } catch (e) {}

    const playPromise = targetVideo.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Playing successfully with sound
        })
        .catch(() => {
          // If browser restricts unmuted autoplay until user gesture,
          // mute temporarily and play so video shows initial frame,
          // then user gesture unlock will start audio playthrough
          targetVideo.muted = true;
          targetVideo.play().catch(() => {});
        });
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
          // Section already played: keep previous and current videos paused/off
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
}

const mediaManager = new MediaController();
export default mediaManager;
