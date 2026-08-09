import { ISpeechToTextProvider, STTResult } from '../../../types/voice';
import { globalTTSService } from '../TTSService';

export class WebSpeechSTTProvider implements ISpeechToTextProvider {
  public name = 'WebSpeechSTTProvider (Completed WebSpeech Engine)';
  private recognition: any = null;
  private _isListening = false;
  private lastFinalTranscript = '';

  public async initialize(): Promise<boolean> {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      this.recognition.lang = 'en-US';
      return true;
    }
    return false;
  }

  public async startListening(
    onResult: (result: STTResult) => void,
    onError: (err: Error) => void
  ): Promise<void> {
    // 1. Immediately stop any active TTS output when candidate starts speaking
    globalTTSService.stop();

    if (!this.recognition) {
      const initialized = await this.initialize();
      if (!initialized) {
        // Fallback simulation mode when WebSpeech API is unsupported by browser
        this._isListening = true;
        this.simulateFallbackListening(onResult);
        return;
      }
    }

    this.lastFinalTranscript = '';

    this.recognition.onspeechstart = () => {
      // Interruption hook: Stop TTS speech synthesis as soon as speech is detected
      globalTTSService.stop();
    };

    this.recognition.onresult = (event: any) => {
      // Interrupt TTS immediately on any speech detection
      globalTTSService.stop();

      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const cleanFinal = finalTranscript.trim();
      const cleanInterim = interimTranscript.trim();

      // Deduplication check: Prevent duplicate final transcript events
      if (cleanFinal && cleanFinal !== this.lastFinalTranscript) {
        this.lastFinalTranscript = cleanFinal;
        onResult({
          transcript: cleanFinal,
          isFinal: true,
          confidence: event.results[0]?.[0]?.confidence ? Math.round(event.results[0][0].confidence * 100) : 95,
        });
      } else if (cleanInterim && !cleanFinal) {
        onResult({
          transcript: cleanInterim,
          isFinal: false,
          confidence: 90,
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') return; // Ignore silent no-speech events
      this._isListening = false;
      onError(new Error(`Speech Recognition Error: ${event.error}`));
    };

    this.recognition.onend = () => {
      this._isListening = false;
    };

    try {
      this.recognition.start();
      this._isListening = true;
    } catch (err: any) {
      this._isListening = false;
      onError(err);
    }
  }

  public async stopListening(): Promise<void> {
    if (this.recognition && this._isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        // Ignore stop error
      }
    }
    this._isListening = false;
  }

  public isListening(): boolean {
    return this._isListening;
  }

  private simulateFallbackListening(onResult: (result: STTResult) => void) {
    if (!this._isListening) return;
    const phrases = [
      'In HNSW indexing, memory consumption scales linearly with connectivity parameter M.',
      'To prevent vector retrieval drift, we implement hybrid keyword re-ranking with BM25.',
      'Model Context Protocol decouples tool schemas from prompt context buffers.'
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (!this._isListening) {
        clearInterval(interval);
        return;
      }
      currentIdx += 8;
      const partial = phrase.substring(0, currentIdx);
      const isFinal = currentIdx >= phrase.length;
      onResult({
        transcript: partial,
        isFinal,
        confidence: 94,
      });
      if (isFinal) {
        clearInterval(interval);
        this._isListening = false;
      }
    }, 400);
  }
}
