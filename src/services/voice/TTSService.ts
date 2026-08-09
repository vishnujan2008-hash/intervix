export class TTSService {
  private synth: SpeechSynthesis | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isInitialized = false;
  private speechQueue: string[] = [];
  private isProcessingQueue = false;
  private isCurrentlyPlaying = false;
  private heartbeatTimer: any = null;

  private onStartCallback?: () => void;
  private onEndCallback?: () => void;
  private onErrorCallback?: (err: any) => void;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }

      // Handle browser autoplay restriction: unlock AudioContext & SpeechSynthesis on first user interaction
      const unlockAudio = () => {
        if (this.synth) {
          if (this.synth.paused) {
            this.synth.resume();
          }
        }
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
    }
  }

  private initVoices(): void {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (voices.length === 0) return;

    const voicePriority = [
      'Google US English',
      'Google UK English Female',
      'Microsoft Aria',
      'Microsoft Jenny',
      'Microsoft Guy',
      'Samantha',
      'Alex',
      'Karen',
      'Daniel'
    ];

    for (const priorityName of voicePriority) {
      const match = voices.find(v => v.name.includes(priorityName));
      if (match) {
        this.selectedVoice = match;
        break;
      }
    }

    if (!this.selectedVoice) {
      this.selectedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
    }

    this.isInitialized = true;
  }

  public getSelectedVoiceName(): string {
    return this.selectedVoice ? this.selectedVoice.name : 'Browser System Voice (Active)';
  }

  public setCallbacks(callbacks: {
    onstart?: () => void;
    onend?: () => void;
    onerror?: (err: any) => void;
  }): void {
    this.onStartCallback = callbacks.onstart;
    this.onEndCallback = callbacks.onend;
    this.onErrorCallback = callbacks.onerror;
  }

  public speak(text: string): void {
    if (!this.synth) {
      if (this.onErrorCallback) {
        this.onErrorCallback(new Error('Browser SpeechSynthesis API unavailable on this device.'));
      }
      return;
    }

    // Immediately stop current speech & clear queue to prevent overlaps
    this.stop();

    // Chrome Autoplay restriction check: resume if paused
    if (this.synth.paused) {
      this.synth.resume();
    }

    // Clean text & split into sentence chunks for smooth delivery
    const cleanText = text.replace(/[*_#`[\]()]/g, '').trim();
    if (!cleanText) return;

    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
    this.speechQueue = sentences.map(s => s.trim()).filter(Boolean);

    this.processQueue();
  }

  private processQueue(): void {
    if (!this.synth || this.speechQueue.length === 0) {
      this.isProcessingQueue = false;
      this.isCurrentlyPlaying = false;
      this.stopHeartbeat();
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    this.isProcessingQueue = true;
    const chunkText = this.speechQueue.shift();
    if (!chunkText) return;

    try {
      const utterance = new SpeechSynthesisUtterance(chunkText);
      if (this.selectedVoice) utterance.voice = this.selectedVoice;
      
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        this.isCurrentlyPlaying = true;
        this.startHeartbeat();
        if (this.onStartCallback) this.onStartCallback();
      };

      utterance.onend = () => {
        if (this.speechQueue.length > 0) {
          this.processQueue();
        } else {
          this.isCurrentlyPlaying = false;
          this.isProcessingQueue = false;
          this.stopHeartbeat();
          if (this.onEndCallback) this.onEndCallback();
        }
      };

      utterance.onerror = (e) => {
        console.warn('[TTSService] SpeechSynthesis error event:', e);
        this.isCurrentlyPlaying = false;
        this.isProcessingQueue = false;
        this.stopHeartbeat();
        if (this.onErrorCallback) {
          this.onErrorCallback(new Error(e.error || 'SpeechSynthesis audio playback failed'));
        }
        if (this.onEndCallback) this.onEndCallback();
      };

      this.synth.speak(utterance);
    } catch (err: any) {
      console.error('[TTSService] Failed to create or play SpeechSynthesisUtterance:', err);
      this.isCurrentlyPlaying = false;
      this.isProcessingQueue = false;
      this.stopHeartbeat();
      if (this.onErrorCallback) this.onErrorCallback(err);
      if (this.onEndCallback) this.onEndCallback();
    }
  }

  // Heartbeat timer to prevent Chrome bug where long speech freezes after 15s
  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.synth && this.synth.speaking) {
        this.synth.pause();
        this.synth.resume();
      } else {
        this.stopHeartbeat();
      }
    }, 10000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  public stop(): void {
    this.stopHeartbeat();
    if (this.synth) {
      this.speechQueue = [];
      this.isProcessingQueue = false;
      this.isCurrentlyPlaying = false;
      this.synth.cancel();
    }
  }

  public pause(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public isSpeaking(): boolean {
    return Boolean(this.isCurrentlyPlaying && this.synth && this.synth.speaking);
  }
}

export const globalTTSService = new TTSService();
