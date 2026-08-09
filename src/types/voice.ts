export type VoiceEngineState = 
  | 'idle'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'paused'
  | 'error';

export type MicPermissionState = 'prompt' | 'granted' | 'denied';

export interface STTResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export interface ISpeechToTextProvider {
  name: string;
  initialize(): Promise<boolean>;
  startListening(onResult: (result: STTResult) => void, onError: (err: Error) => void): Promise<void>;
  stopListening(): Promise<void>;
  isListening(): boolean;
}

export interface ITextToSpeechProvider {
  name: string;
  initialize(): Promise<boolean>;
  speak(text: string, onEnd?: () => void, onError?: (err: Error) => void): Promise<void>;
  stop(): void;
  isSpeaking(): boolean;
}

export interface VoiceEngineConfig {
  autoListenAfterSpeaking?: boolean;
  sttProvider?: ISpeechToTextProvider;
  ttsProvider?: ITextToSpeechProvider;
}
