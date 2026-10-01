// Centralized Video & Audio Manager for Cyber Horror Event
// Flow:
// 1. Initial Site Load: ONLY Welcome (Hero) video plays audio for 1 time, then automatically mutes & loops.
// 2. Scroll Down / Tap "Open Terminal": Terminal video plays audio for 1 time, then automatically mutes & loops.
// 3. Scroll Down / Tap "Rounds": Rounds video plays audio for 1 time, then automatically mutes & loops.
// 4. Tap "Team": Team video plays audio for 1 time, then automatically mutes & loops.
// 5. Tap "Registration": Register video plays audio for 1 time, then automatically mutes & loops.
// 6. Submit Registration: Confirmation video plays audio for 1 time, then automatically mutes & loops.

class MediaController {
  constructor() {
    this.registeredVideos = new Map(); // id -> HTMLVideoElement
    this.activeId = 'hero';
    this.isAudioUnlocked = false;
    this.playedAudioSet = new Set();
    this.observer = null;
    this.userHasScrolled = false;

    if (typeof window !== 'undefined') {
      this.initUserInteractionUnlock();
    }
  }

  initUserInteractionUnlock() {
    const unlock = () => {
      this.isAudioUnlocked = true;
      if (this.activeId && this.registeredVideos.has(this.activeId)) {
        const vid = this.registeredVideos.get(this.activeId);
        if (vid && !this.playedAudioSet.has(this.activeId)) {
          vid.muted = false;
          vid.volume = 1.0;
          vid.play().catch(() => {});
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('active-video-change', { detail: { activeId: this.activeId } }));
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

    // Smooth auto-mute when video finishes 1 full cycle
    let lastTime = 0;
    const handleTimeUpdate = () => {
      if (!videoElement.muted && videoElement.duration > 0) {
        if (videoElement.currentTime < lastTime || videoElement.currentTime >= videoElement.duration - 0.35) {
          videoElement.muted = true;
          this.playedAudioSet.add(id);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('active-video-change', { detail: { activeId: null } }));
          }
        }
      }
      lastTime = videoElement.currentTime;
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);

    // Initial load: ONLY hero is allowed to play audio
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
        if (!this.playedAudioSet.has(targetId)) {
          video.muted = false;
          video.volume = 1.0;
        } else {
          video.muted = true;
        }

        const p = video.play();
        if (p !== undefined) {
          p.catch(() => {
            // Browser restricted initial unmuted playback
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
      this.playedAudioSet.delete(id);
      vid.play().catch(() => {});
    } else {
      vid.muted = true;
      this.playedAudioSet.add(id);
      if (this.activeId === id) {
        this.activeId = null;
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('active-video-change', { detail: { activeId: this.activeId } }));
    }
  }

  setupScrollObserver(elements) {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    if (this.observer) {
      this.observer.disconnect();
    }

    // Mark that user scrolled before triggering other section audios
    const onFirstScroll = () => {
      if (window.scrollY > 80) {
        this.userHasScrolled = true;
      }
    };
    window.addEventListener('scroll', onFirstScroll, { passive: true });

    this.observer = new IntersectionObserver(
      (entries) => {
        // Do not auto-switch to lower sections until user has actually scrolled down
        if (!this.userHasScrolled && window.scrollY < 80) {
          return;
        }

        let bestEntry = null;
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            bestEntry = entry;
          }
        });

        if (bestEntry && maxRatio >= 0.45) {
          const videoId = bestEntry.target.getAttribute('data-video-id') || bestEntry.target.id;
          if (videoId && this.registeredVideos.has(videoId) && this.activeId !== videoId) {
            this.playAudioOnce(videoId);
          }
        }
      },
      {
        threshold: [0.3, 0.5, 0.7]
      }
    );

    elements.forEach((el) => {
      if (el) this.observer.observe(el);
    });
  }
}

const mediaManager = new MediaController();
export default mediaManager;
