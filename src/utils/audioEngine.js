/**
 * Audio Engine for playback of message pop/send sounds and voice tracks
 */

class AudioEngine {
  constructor() {
    this.popAudio = null;
    this.sendAudio = null;
    this.dingAudio = null;
    this.currentPlaying = null;
    this.initSounds();
  }

  initSounds() {
    if (typeof window !== 'undefined') {
      this.popAudio = new Audio('/audio/pop.wav');
      this.sendAudio = new Audio('/audio/send.wav');
      this.dingAudio = new Audio('/audio/ding.wav');
    }
  }

  playPop() {
    try {
      if (this.popAudio) {
        const sound = this.popAudio.cloneNode();
        sound.volume = 0.8;
        sound.play().catch(() => {});
      }
    } catch (e) {}
  }

  playSend() {
    try {
      if (this.sendAudio) {
        const sound = this.sendAudio.cloneNode();
        sound.volume = 0.7;
        sound.play().catch(() => {});
      }
    } catch (e) {}
  }

  playDing() {
    try {
      if (this.dingAudio) {
        const sound = this.dingAudio.cloneNode();
        sound.volume = 0.8;
        sound.play().catch(() => {});
      }
    } catch (e) {}
  }

  playClip(url, onEnded) {
    this.stopAll();
    const audio = new Audio(url);
    this.currentPlaying = audio;
    if (onEnded) {
      audio.onended = onEnded;
    }
    audio.play().catch(() => {});
    return audio;
  }

  stopAll() {
    if (this.currentPlaying) {
      try {
        this.currentPlaying.pause();
        this.currentPlaying.currentTime = 0;
      } catch (e) {}
      this.currentPlaying = null;
    }
  }
}

export const audioEngine = new AudioEngine();
