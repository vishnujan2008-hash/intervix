import { useState, useEffect, useCallback } from 'react';
import { VoiceEngineState, MicPermissionState } from '../types/voice';
import { globalVoiceService } from '../services/voice/VoiceService';

export const useVoiceEngine = () => {
  const [voiceState, setVoiceState] = useState<VoiceEngineState>(globalVoiceService.getState());
  const [micPermission, setMicPermission] = useState<MicPermissionState>(globalVoiceService.getMicPermission());
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [frequencies, setFrequencies] = useState<number[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    const unsubState = globalVoiceService.onStateChange((state) => {
      setVoiceState(state);
    });

    const unsubAudio = globalVoiceService.onAudioLevel((volume, freqs) => {
      setAudioLevel(volume);
      setFrequencies(freqs);
    });

    const unsubPerm = globalVoiceService.onPermissionChange((perm) => {
      setMicPermission(perm);
    });

    const unsubErr = globalVoiceService.onError((err) => {
      setLastError(err.message);
    });

    return () => {
      unsubState();
      unsubAudio();
      unsubPerm();
      unsubErr();
    };
  }, []);

  const requestMicPermission = useCallback(async () => {
    return await globalVoiceService.requestMicrophonePermission();
  }, []);

  const startListening = useCallback(async () => {
    setLastError(null);
    await globalVoiceService.startListening();
  }, []);

  const stopListening = useCallback(async () => {
    await globalVoiceService.stopListening();
  }, []);

  const speakText = useCallback((text: string) => {
    globalVoiceService.speak(text);
  }, []);

  const interruptSpeaking = useCallback(() => {
    globalVoiceService.interruptSpeaking();
  }, []);

  const pauseSession = useCallback(() => {
    globalVoiceService.pauseSession();
  }, []);

  const resumeSession = useCallback(() => {
    globalVoiceService.resumeSession();
  }, []);

  return {
    voiceState,
    micPermission,
    audioLevel,
    frequencies,
    lastError,
    requestMicPermission,
    startListening,
    stopListening,
    speakText,
    interruptSpeaking,
    pauseSession,
    resumeSession,
    transcriptManager: globalVoiceService.getTranscriptManager(),
  };
};
