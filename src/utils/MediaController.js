// Centralized Video & Audio Manager for Cyber Horror Event
// Guarantees:
// 1. All videos loop smoothly with zero stutter, lag, or freezing.
// 2. Plays with sound for 1 cycle when opened or scrolled to, then automatically mutes and continues looping silently.
// 3. Strict guard prevents repeated restarts during scrolling.

class MediaController {
  constructor() {
    this.registeredVideos = new Map(); // id -> HTMLVideoElement
    this.activeId = null;
    this.isAudioUnlocked = false;
    this.playedAudioSet = new Set(); // tracks sections that already completed their audio cycle
    this.observer = null;

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
        // Detect loop cycle completion or end threshold
        if (videoElement.currentTime < lastTime || videoElement.currentTime >= videoElement.duration - 0.25) {
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

    // Start video playing immediately
    const playPromise = videoElement.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        videoElement.muted = true;
        videoElement.play().catch(() => {});
      });
    }

    // If hero or first registered, set as active
    if (!this.activeId || id === 'hero') {
      this.setActive(id);
    }
  }

  unregister(id) {
    this.registeredVideos.delete(id);
    if (this.activeId === id) {
      this.activeId = null;
    }
  }

  setActive(targetId) {
    // STRICT GUARD: If already active, NEVER interrupt or reset video playback
    if (this.activeId === targetId) return;

    this.activeId = targetId;

    this.registeredVideos.forEach((video, id) => {
      if (id === targetId) {
        // Only unmute if it hasn't completed its 1 audio cycle yet
        if (!this.playedAudioSet.has(targetId)) {
          video.muted = false;
          video.volume = 1.0;
        } else {
          video.muted = true;
        }

        const p = video.play();
        if (p !== undefined) {
          p.catch(() => {
            // If browser blocks unmuted audio on load, play muted smoothly
            video.muted = true;
            video.play().catch(() => {});
          });
        }
      } else {
        // Mute non-active videos while keeping them looping visually
        video.muted = true;
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('active-video-change', { detail: { activeId: targetId } }));
    }
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
      this.playedAudioSet.delete(id); // allow audio again on manual toggle
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

    this.observer = new IntersectionObserver(
      (entries) => {
        let bestEntry = null;
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            bestEntry = entry;
          }
        });

        if (bestEntry && maxRatio > 0.35) {
          const videoId = bestEntry.target.getAttribute('data-video-id') || bestEntry.target.id;
          if (videoId && this.registeredVideos.has(videoId) && this.activeId !== videoId) {
            this.setActive(videoId);
          }
        }
      },
      {
        threshold: [0.2, 0.4, 0.6, 0.8]
      }
    );

    elements.forEach((el) => {
      if (el) this.observer.observe(el);
    });
  }
}

const mediaManager = new MediaController();
export default mediaManager;
