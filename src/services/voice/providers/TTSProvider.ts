import { ITextToSpeechProvider } from '../../../types/voice';
import { globalTTSService } from '../TTSService';

export class WebSpeechTTSProvider implements ITextToSpeechProvider {
  public name = 'WebSpeechTTSProvider (TTSService Powered)';

  public async initialize(): Promise<boolean> {
    return true;
  }

  public async speak(text: string, onEnd?: () => void, onError?: (err: Error) => void): Promise<void> {
    globalTTSService.setCallbacks({
      onstart: () => {},
      onend: () => { if (onEnd) onEnd(); },
      onerror: (err) => { if (onError) onError(new Error(err)); }
    });
    globalTTSService.speak(text);
  }

  public stop(): void {
    globalTTSService.stop();
  }

  public isSpeaking(): boolean {
    return globalTTSService.isSpeaking();
  }
}
