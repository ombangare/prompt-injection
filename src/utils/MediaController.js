// Centralized Video & Audio Manager for Cyber Horror Event
// Ensures only ONE video plays audio at a time, and handles scroll-based auto-switching & browser autoplay unlock.

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

  // Modern browsers require 1 interaction to unlock sound
  initUserInteractionUnlock() {
    const unlock = () => {
      this.isAudioUnlocked = true;
      if (this.activeId && this.registeredVideos.has(this.activeId)) {
        const vid = this.registeredVideos.get(this.activeId);
        if (vid) {
          vid.muted = false;
          vid.play().catch(() => {});
        }
      }
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('scroll', unlock, { passive: true });
    };

    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
    window.addEventListener('scroll', unlock, { once: true, passive: true });
  }

  register(id, videoElement) {
    if (!videoElement) return;
    this.registeredVideos.set(id, videoElement);

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
          video.muted = false;
        }
        video.currentTime = 0; // restart from beginning for fresh clear voiceover
        video.play().catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      } else {
        // Mute and keep looping silently
        video.muted = true;
      }
    });

    // Notify listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('active-video-change', { detail: { activeId: targetId } }));
    }
  }

  toggleMute(id) {
    const vid = this.registeredVideos.get(id);
    if (!vid) return;

    if (vid.muted) {
      this.isAudioUnlocked = true;
      this.registeredVideos.forEach((v, vId) => {
        if (vId === id) {
          v.currentTime = 0; // replay voiceover from start
          v.muted = false;
          v.play().catch(() => {});
        } else {
          v.muted = true;
        }
      });
      this.activeId = id;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('active-video-change', { detail: { activeId: id } }));
      }
    } else {
      vid.muted = true;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('active-video-change', { detail: { activeId: null } }));
      }
    }
  }

  // Setup IntersectionObserver for sections on scroll
  setupScrollObserver(sections) {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver((entries) => {
      let maxRatio = 0;
      let mostVisibleId = null;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          const sectionId = entry.target.getAttribute('data-video-id') || entry.target.id;
          if (sectionId) mostVisibleId = sectionId;
        }
      });

      if (mostVisibleId && mostVisibleId !== this.activeId && maxRatio >= 0.35) {
        this.setActive(mostVisibleId);
      }
    }, {
      threshold: [0.35, 0.6, 0.8],
      rootMargin: '-5% 0px -10% 0px'
    });

    sections.forEach((sec) => {
      if (sec) this.observer.observe(sec);
    });
  }
}

export const mediaManager = new MediaController();
export default mediaManager;
