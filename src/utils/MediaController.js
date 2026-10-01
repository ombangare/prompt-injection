// Centralized Video & Audio Manager for Cyber Horror Event
// Guarantees:
// 1. When opening the site, first video plays with sound 1 time, then automatically mutes & loops.
// 2. On scroll down, each visible section's video automatically plays with sound 1 time, then automatically mutes & loops.
// 3. Visiting any page (Team, Register, etc.) automatically plays that video with sound 1 time, then mutes.

class MediaController {
  constructor() {
    this.registeredVideos = new Map(); // id -> HTMLVideoElement
    this.activeId = null;
    this.isAudioUnlocked = false;
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
        if (vid && vid.muted) {
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

    this.registeredVideos.set(id, videoElement);

    const handleEnded = () => {
      // Auto-mute audio after playing once, while keeping video looping visually
      videoElement.muted = true;
      videoElement.loop = true;
      videoElement.play().catch(() => {});
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('active-video-change', { detail: { activeId: null } }));
      }
    };

    videoElement._handleEnded = handleEnded;
    videoElement.addEventListener('ended', handleEnded);

    // Initial check: if hero or first registered, set as active
    if (!this.activeId || id === 'hero') {
      this.setActive(id);
    }
  }

  unregister(id) {
    const vid = this.registeredVideos.get(id);
    if (vid && vid._handleEnded) {
      vid.removeEventListener('ended', vid._handleEnded);
    }
    this.registeredVideos.delete(id);
    if (this.activeId === id) {
      this.activeId = null;
    }
  }

  setActive(targetId) {
    if (this.activeId === targetId && this.registeredVideos.has(targetId)) {
      const currentVid = this.registeredVideos.get(targetId);
      if (currentVid && !currentVid.paused && !currentVid.muted) return;
    }

    this.activeId = targetId;

    this.registeredVideos.forEach((video, id) => {
      if (id === targetId) {
        // Reset to beginning to play unmuted audio 1 time
        video.loop = false;
        video.muted = false;
        video.volume = 1.0;
        try {
          video.currentTime = 0;
        } catch (e) {}

        const p = video.play();
        if (p !== undefined) {
          p.catch(() => {
            // If browser autoplay policy restricts sound before interaction, play muted temporarily
            video.muted = true;
            video.loop = true;
            video.play().catch(() => {});
          });
        }
      } else {
        video.muted = true;
        video.loop = true;
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
      vid.play().catch(() => {});
    } else {
      vid.muted = true;
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
