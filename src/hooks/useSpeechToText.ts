import { useState, useEffect, useRef, useCallback } from 'react';

export type STTStatus = 'idle' | 'listening' | 'processing' | 'ready' | 'error';

interface UseSpeechToTextOptions {
  onTranscriptUpdate?: (transcriptText: string, isFinal: boolean) => void;
  silenceTimeoutMs?: number;
}

export const useSpeechToText = (options?: UseSpeechToTextOptions) => {
  const [sttStatus, setSttStatus] = useState<STTStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);

  const silenceTimeoutMs = options?.silenceTimeoutMs || 3500;

  // Initialize SpeechRecognition if available in browser
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.lang = 'en-US';
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
      }
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore cleanup abort error
        }
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    silenceTimerRef.current = setTimeout(() => {
      if (recognitionRef.current && sttStatus === 'listening') {
        stopListening();
      }
    }, silenceTimeoutMs);
  }, [silenceTimeoutMs, sttStatus]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition || !recognitionRef.current) {
      setSttStatus('error');
      setErrorMessage('Speech recognition is not supported in this browser. Please type your response.');
      return;
    }

    setErrorMessage(null);
    setSttStatus('listening');

    const recognition = recognitionRef.current;

    recognition.onresult = (event: any) => {
      resetSilenceTimer();
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = (finalTranscript || interimTranscript).trim();
      const isFinal = Boolean(finalTranscript);

      if (text && options?.onTranscriptUpdate) {
        options.onTranscriptUpdate(text, isFinal);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('SpeechRecognition error:', event.error);
      if (event.error === 'not-allowed') {
        setSttStatus('error');
        setErrorMessage('Microphone access denied. Please enable microphone permissions in your browser.');
      } else if (event.error === 'no-speech') {
        setSttStatus('ready');
      } else if (event.error === 'network') {
        setSttStatus('error');
        setErrorMessage('Network error during speech recognition. Please check connectivity.');
      } else {
        setSttStatus('error');
        setErrorMessage(`Speech recognition error: ${event.error}`);
      }

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };

    recognition.onend = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setSttStatus(prev => (prev === 'listening' ? 'ready' : prev));
      setTimeout(() => {
        setSttStatus(prev => (prev === 'ready' ? 'idle' : prev));
      }, 2500);
    };

    try {
      recognition.start();
      resetSilenceTimer();
    } catch (err: any) {
      console.warn('Failed to start SpeechRecognition:', err);
      if (err.name === 'InvalidStateError') {
        // Recognition already running
        setSttStatus('listening');
      } else {
        setSttStatus('error');
        setErrorMessage('Could not access microphone. Please check permissions.');
      }
    }
  }, [options, resetSilenceTimer]);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try {
        setSttStatus('processing');
        recognitionRef.current.stop();
      } catch (err) {
        setSttStatus('idle');
      }
    } else {
      setSttStatus('idle');
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (sttStatus === 'listening') {
      stopListening();
    } else {
      startListening();
    }
  }, [sttStatus, startListening, stopListening]);

  return {
    sttStatus,
    errorMessage,
    isListening: sttStatus === 'listening',
    isSupported: Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition),
    startListening,
    stopListening,
    toggleListening,
    clearError: () => setErrorMessage(null),
  };
};
