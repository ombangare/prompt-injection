// Centralized Video & Audio Manager for Cyber Horror Event
// Ensures only ONE video plays audio at a time, handles scroll-based auto-switching,
// and guarantees rock-solid instant autoplay on all mobile browsers (iOS Safari & Android Chrome).

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

  // Modern browsers require 1 interaction to unlock unmuted sound
  initUserInteractionUnlock() {
    const unlock = () => {
      this.isAudioUnlocked = true;
      if (this.activeId && this.registeredVideos.has(this.activeId)) {
        const vid = this.registeredVideos.get(this.activeId);
        if (vid) {
          vid.play().catch(() => {});
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

    // Mobile essential properties
    videoElement.playsInline = true;
    videoElement.setAttribute('playsinline', 'true');
    videoElement.setAttribute('webkit-playsinline', 'true');
    videoElement.loop = true;

    this.registeredVideos.set(id, videoElement);

    // Ensure immediate instant silent autoplay on mobile without blocking
    videoElement.muted = true;
    const playPromise = videoElement.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        videoElement.muted = true;
        videoElement.play().catch(() => {});
      });
    }

    // Auto-mute audio after playing once, while keeping video looping visually
    const handleEnded = () => {
      videoElement.muted = true;
      videoElement.play().catch(() => {});
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('active-video-change', { detail: { activeId: null } }));
      }
    };

    videoElement._handleEnded = handleEnded;
    videoElement.addEventListener('ended', handleEnded);

    // Initial check: if hero or first registered, set as active
    if (!this.activeId) {
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
    this.activeId = targetId;

    this.registeredVideos.forEach((video, id) => {
      if (id === targetId) {
        if (this.isAudioUnlocked) {
          video.muted = false;
        } else {
          video.muted = true; // Always start muted on mobile until user toggles or interacts
        }
        
        const p = video.play();
        if (p !== undefined) {
          p.catch(() => {
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

  toggleMute(id) {
    const vid = this.registeredVideos.get(id);
    if (!vid) return;

    this.isAudioUnlocked = true;

    if (vid.muted) {
      // Mute all other videos
      this.registeredVideos.forEach((otherVid, otherId) => {
        if (otherId !== id) {
          otherVid.muted = true;
        }
      });
      vid.muted = false;
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
          if (videoId && this.registeredVideos.has(videoId)) {
            // Keep muted during scroll on mobile unless explicitly unmuted
            if (!this.isAudioUnlocked) {
              const vid = this.registeredVideos.get(videoId);
              if (vid) vid.play().catch(() => {});
            }
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
