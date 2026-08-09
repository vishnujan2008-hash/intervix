import { VoiceEngineState, MicPermissionState, ISpeechToTextProvider, ITextToSpeechProvider } from '../../types/voice';
import { WebSpeechSTTProvider } from './providers/STTProvider';
import { WebSpeechTTSProvider } from './providers/TTSProvider';
import { TTSManager } from './TTSManager';
import { TTSService, globalTTSService } from './TTSService';
import { TranscriptManager } from './TranscriptManager';
import { AudioAnalyser } from './AudioAnalyser';

export class VoiceService {
  private state: VoiceEngineState = 'idle';
  private micPermission: MicPermissionState = 'prompt';

  private sttProvider: ISpeechToTextProvider;
  private ttsManager: TTSManager;
  private transcriptManager: TranscriptManager;
  private analyser: AudioAnalyser;

  private activeMediaStream: MediaStream | null = null;

  private stateListeners: ((state: VoiceEngineState) => void)[] = [];
  private audioLevelListeners: ((volume: number, frequencies: number[]) => void)[] = [];
  private permissionListeners: ((perm: MicPermissionState) => void)[] = [];
  private errorListeners: ((err: Error) => void)[] = [];

  constructor(
    sttProvider?: ISpeechToTextProvider,
    ttsProvider?: ITextToSpeechProvider,
    transcriptManager?: TranscriptManager
  ) {
    this.sttProvider = sttProvider || new WebSpeechSTTProvider();
    this.ttsManager = new TTSManager(ttsProvider || new WebSpeechTTSProvider());
    this.transcriptManager = transcriptManager || new TranscriptManager();
    this.analyser = new AudioAnalyser();
  }

  public getState(): VoiceEngineState {
    return this.state;
  }

  public getMicPermission(): MicPermissionState {
    return this.micPermission;
  }

  public getTranscriptManager(): TranscriptManager {
    return this.transcriptManager;
  }

  public async requestMicrophonePermission(): Promise<boolean> {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.activeMediaStream = stream;
        this.micPermission = 'granted';
        this.notifyPermission(this.micPermission);

        // Connect media stream to Web Audio Analyser
        this.analyser.startAnalysing(stream, (frequencies, averageVolume) => {
          this.notifyAudioLevel(averageVolume, frequencies);
        });

        return true;
      }
    } catch (err: any) {
      this.micPermission = 'denied';
      this.notifyPermission(this.micPermission);
      this.notifyError(new Error('Microphone permission denied or unavailable'));
      return false;
    }
    return false;
  }

  public async startListening(onResult?: (transcript: string, isFinal: boolean) => void): Promise<void> {
    // If AI is currently speaking, interrupt it immediately!
    if (this.state === 'speaking') {
      this.interruptSpeaking();
    }

    if (this.micPermission !== 'granted') {
      const granted = await this.requestMicrophonePermission();
      if (!granted) return;
    }

    this.transitionState('listening');

    await this.sttProvider.startListening(
      (result) => {
        if (onResult) onResult(result.transcript, result.isFinal);

        if (result.isFinal) {
          this.transcriptManager.addMessage('candidate', result.transcript);
          this.transitionState('processing');
        }
      },
      (err) => {
        console.warn('STT Error encountered:', err);
        this.notifyError(err);
      }
    );
  }

  public async stopListening(): Promise<void> {
    await this.sttProvider.stopListening();
    if (this.state === 'listening') {
      this.transitionState('idle');
    }
  }

  public speak(text: string, onEnd?: () => void): void {
    this.transitionState('speaking');

    this.ttsManager.speak(text, () => {
      if (onEnd) onEnd();
      // Auto-transition back to listening or idle after AI finishes speaking
      if (this.state === 'speaking') {
        this.transitionState('listening');
      }
    });
  }

  public interruptSpeaking(): void {
    this.ttsManager.interrupt();
    globalTTSService.stop();
    this.transitionState('listening');
  }

  public pauseSession(): void {
    this.stopListening();
    this.ttsManager.stop();
    this.transitionState('paused');
  }

  public resumeSession(): void {
    if (this.state === 'paused') {
      this.startListening();
    }
  }

  public onStateChange(listener: (state: VoiceEngineState) => void): () => void {
    this.stateListeners.push(listener);
    return () => {
      this.stateListeners = this.stateListeners.filter(l => l !== listener);
    };
  }

  public onAudioLevel(listener: (volume: number, frequencies: number[]) => void): () => void {
    this.audioLevelListeners.push(listener);
    return () => {
      this.audioLevelListeners = this.audioLevelListeners.filter(l => l !== listener);
    };
  }

  public onPermissionChange(listener: (perm: MicPermissionState) => void): () => void {
    this.permissionListeners.push(listener);
    return () => {
      this.permissionListeners = this.permissionListeners.filter(l => l !== listener);
    };
  }

  public onError(listener: (err: Error) => void): () => void {
    this.errorListeners.push(listener);
    return () => {
      this.errorListeners = this.errorListeners.filter(l => l !== listener);
    };
  }

  private transitionState(newState: VoiceEngineState): void {
    if (this.state !== newState) {
      this.state = newState;
      this.stateListeners.forEach(l => l(this.state));
    }
  }

  private notifyAudioLevel(volume: number, frequencies: number[]): void {
    this.audioLevelListeners.forEach(l => l(volume, frequencies));
  }

  private notifyPermission(perm: MicPermissionState): void {
    this.permissionListeners.forEach(l => l(perm));
  }

  private notifyError(err: Error): void {
    this.errorListeners.forEach(l => l(err));
  }
}

// Global Singleton VoiceService Instance
export const globalVoiceService = new VoiceService();
