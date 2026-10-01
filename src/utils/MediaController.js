// Centralized Video & Audio Manager for Cyber Horror Event
// Bulletproof, simple, rock-solid flow:
// 1. Initial Page Load: Welcome (Hero) video plays audio for 1 time, then mutes and loops silently.
// 2. Scroll Down / Tap "Open Terminal": Terminal video plays audio for 1 time, then mutes and loops silently.
// 3. Scroll Down / Tap "Rounds": Rounds video plays audio for 1 time, then mutes and loops silently.
// 4. Tap "Team": Team video plays audio for 1 time, then mutes and loops silently.
// 5. Tap "Registration": Register video plays audio for 1 time, then mutes and loops silently.
// 6. Submit Registration: Confirmation video plays audio for 1 time, then mutes and loops silently.

class MediaController {
  constructor() {
    this.registeredVideos = new Map(); // id -> HTMLVideoElement
    this.activeId = 'hero';
    this.isAudioUnlocked = false;
    this.hasPlayedAudio = {
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

  initUserInteractionUnlock() {
    const unlock = () => {
      this.isAudioUnlocked = true;
      // Immediately play audio for the current active video if it hasn't completed its audio run
      if (this.activeId && this.registeredVideos.has(this.activeId)) {
        if (!this.hasPlayedAudio[this.activeId]) {
          const vid = this.registeredVideos.get(this.activeId);
          if (vid) {
            vid.muted = false;
            vid.volume = 1.0;
            vid.play().catch(() => {});
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('active-video-change', { detail: { activeId: this.activeId } }));
            }
          }
        }
      }
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('scroll', unlock, { passive: true });
    };

    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('scroll', unlock, { once: true, passive: true });
  }

  register(id, videoElement) {
    if (!videoElement) return;

    videoElement.playsInline = true;
    videoElement.setAttribute('playsinline', 'true');
    videoElement.setAttribute('webkit-playsinline', 'true');
    videoElement.loop = true;

    this.registeredVideos.set(id, videoElement);

    // Track audio duration & auto-mute when 1 cycle finishes
    let lastTime = 0;
    const handleTimeUpdate = () => {
      if (!videoElement.muted && videoElement.duration > 0) {
        if (videoElement.currentTime < lastTime || videoElement.currentTime >= videoElement.duration - 0.3) {
          videoElement.muted = true;
          this.hasPlayedAudio[id] = true;
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('active-video-change', { detail: { activeId: null } }));
          }
        }
      }
      lastTime = videoElement.currentTime;
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);

    // Initial site open: play hero with audio
    if (id === 'hero') {
      this.playAudioOnce('hero');
    } else {
      videoElement.muted = true;
      videoElement.play().catch(() => {});
    }
  }

  unregister(id) {
    this.registeredVideos.delete(id);
    if (this.activeId === id) {
      this.activeId = null;
    }
  }

  playAudioOnce(targetId) {
    this.activeId = targetId;

    this.registeredVideos.forEach((video, id) => {
      if (id === targetId) {
        if (!this.hasPlayedAudio[targetId]) {
          video.muted = false;
          video.volume = 1.0;
        } else {
          video.muted = true;
        }

        const p = video.play();
        if (p !== undefined) {
          p.catch(() => {
            // Browser restricted initial unmuted playback until touch
            video.muted = true;
            video.play().catch(() => {});
          });
        }
      } else {
        video.muted = true;
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('active-video-change', { detail: { activeId: targetId } }));
    }
  }

  setActive(targetId) {
    this.playAudioOnce(targetId);
  }

  toggleMute(id) {
    const vid = this.registeredVideos.get(id);
    if (!vid) return;

    this.isAudioUnlocked = true;

    if (vid.muted) {
      this.registeredVideos.forEach((otherVid, otherId) => {
        if (otherId !== id) {
          otherVid.muted = true;
        }
      });
      vid.muted = false;
      vid.volume = 1.0;
      this.activeId = id;
      this.hasPlayedAudio[id] = false; // allow full playback again on manual unmute
      vid.play().catch(() => {});
    } else {
      vid.muted = true;
      this.hasPlayedAudio[id] = true;
      if (this.activeId === id) {
        this.activeId = null;
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('active-video-change', { detail: { activeId: this.activeId } }));
    }
  }

  initScrollTracker() {
    let scrollTimeout = null;

    const checkScrollSection = () => {
      // Only track scroll on home page
      const heroEl = document.getElementById('hero');
      const termEl = document.getElementById('terminal');
      const roundsEl = document.getElementById('rounds');

      if (!heroEl && !termEl && !roundsEl) return;

      const scrollPos = window.scrollY + window.innerHeight * 0.45;

      let currentSection = 'hero';
      if (roundsEl && scrollPos >= roundsEl.offsetTop) {
        currentSection = 'rounds';
      } else if (termEl && scrollPos >= termEl.offsetTop) {
        currentSection = 'terminal';
      } else {
        currentSection = 'hero';
      }

      if (this.activeId !== currentSection) {
        // Only play audio if this section hasn't played its 1-time audio yet
        if (!this.hasPlayedAudio[currentSection]) {
          this.playAudioOnce(currentSection);
        } else {
          // Keep activeId updated and keep other videos muted
          this.activeId = currentSection;
          this.registeredVideos.forEach((vid, id) => {
            if (id !== currentSection) vid.muted = true;
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
    // Scroll tracker is initialized in constructor
  }
}

const mediaManager = new MediaController();
export default mediaManager;
