import React from 'react';
import { motion } from 'framer-motion';
import { AIStatus } from '../types';
import { globalTTSService } from '../services/voice/TTSService';

interface VoiceWaveformProps {
  status: AIStatus;
  isMuted: boolean;
  barsCount?: number;
  isAudioPlaying?: boolean;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  status,
  isMuted,
  barsCount = 20,
  isAudioPlaying,
}) => {
  const bars = Array.from({ length: barsCount });
  const actualTTSPlaying = isAudioPlaying !== undefined ? isAudioPlaying : globalTTSService.isSpeaking();

  return (
    <div className="flex items-center justify-center space-x-1 h-12 px-4 rounded-xl bg-[#09090B]/80 border border-white/10 overflow-hidden shadow-inner w-full">
      {bars.map((_, i) => {
        const scale = 0.3 + ((i * 7) % 10) * 0.08;
        // Waveform animates ONLY while actual audio is actively playing or listening
        const isActive = !isMuted && (
          (status === 'speaking' && actualTTSPlaying) || 
          status === 'listening'
        );
        
        return (
          <motion.div
            key={i}
            animate={{
              height: isActive
                ? [`${8 * scale}px`, `${40 * scale}px`, `${8 * scale}px`]
                : '6px',
            }}
            transition={{
              duration: isActive ? 0.4 + (i % 5) * 0.1 : 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`w-1.5 rounded-full transition-colors ${
              isMuted
                ? 'bg-gray-700'
                : (status === 'speaking' && actualTTSPlaying)
                ? 'bg-amber-400 shadow-[0_0_8px_#F5D061]'
                : status === 'listening'
                ? 'bg-cyan-400 shadow-[0_0_8px_#22D3EE]'
                : status === 'thinking'
                ? 'bg-purple-400/70'
                : 'bg-white/20'
            }`}
          />
        );
      })}
    </div>
  );
};
