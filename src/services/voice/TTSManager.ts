import { ITextToSpeechProvider } from '../../types/voice';
import { WebSpeechTTSProvider } from './providers/TTSProvider';

export class TTSManager {
  private provider: ITextToSpeechProvider;
  private queue: { text: string; onEnd?: () => void }[] = [];
  private isProcessingQueue = false;

  constructor(provider?: ITextToSpeechProvider) {
    this.provider = provider || new WebSpeechTTSProvider();
  }

  public setProvider(provider: ITextToSpeechProvider): void {
    this.stop();
    this.provider = provider;
  }

  public speak(text: string, onEnd?: () => void): void {
    this.queue.push({ text, onEnd });
    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  public interrupt(): void {
    this.queue = [];
    this.isProcessingQueue = false;
    this.provider.stop();
  }

  public stop(): void {
    this.interrupt();
  }

  public isSpeaking(): boolean {
    return this.provider.isSpeaking() || this.isProcessingQueue;
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.isProcessingQueue = false;
      return;
    }

    this.isProcessingQueue = true;
    const currentItem = this.queue.shift();

    if (currentItem) {
      await this.provider.speak(
        currentItem.text,
        () => {
          if (currentItem.onEnd) currentItem.onEnd();
          this.processQueue();
        },
        (err) => {
          console.warn('TTS Manager item error:', err);
          this.processQueue();
        }
      );
    }
  }
}
