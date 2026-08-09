import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Square } from 'lucide-react';
import { AIStatus } from '../types';
import { VoiceWaveform } from './VoiceWaveform';
import { VoiceStatus } from './VoiceStatus';
import { InterviewTimer } from './InterviewTimer';

interface VoiceControlsProps {
  status: AIStatus;
  isMicMuted: boolean;
  onToggleMic: () => void;
  isSpeakerMuted: boolean;
  onToggleSpeaker: () => void;
  timeElapsedSeconds: number;
  onInterrupt?: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  status,
  isMicMuted,
  onToggleMic,
  isSpeakerMuted,
  onToggleSpeaker,
  timeElapsedSeconds,
  onInterrupt,
}) => {
  return (
    <div className="w-full glass-panel rounded-2xl p-4 md:p-5 border border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left: Status Badge & Stopwatch */}
      <div className="flex items-center space-x-3">
        <VoiceStatus
          status={status}
          isMicMuted={isMicMuted}
          isSpeakerMuted={isSpeakerMuted}
        />
        <InterviewTimer timeElapsedSeconds={timeElapsedSeconds} />
      </div>

      {/* Center: Live Multi-frequency Voice Waveform */}
      <div className="flex-1 max-w-sm w-full">
        <VoiceWaveform status={status} isMuted={isMicMuted} barsCount={24} />
      </div>

      {/* Right: Hardware Action Triggers */}
      <div className="flex items-center space-x-3">
        {/* Interrupt AI Button (Visible when AI is speaking) */}
        {status === 'speaking' && onInterrupt && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onInterrupt}
            className="px-3 py-2 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 hover:bg-red-500/30 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          >
            <Square className="w-3.5 h-3.5 fill-red-400" />
            <span>Interrupt AI</span>
          </motion.button>
        )}

        {/* Speaker Mute Button */}
        <button
          onClick={onToggleSpeaker}
          className={`p-3 rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-blue-400 ${
            isSpeakerMuted
              ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
              : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
          }`}
          title={isSpeakerMuted ? 'Unmute Speaker' : 'Mute Speaker'}
        >
          {isSpeakerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Mic Toggle Button */}
        <button
          onClick={onToggleMic}
          className={`p-3 rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-blue-400 ${
            isMicMuted
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
          }`}
          title={isMicMuted ? 'Unmute Mic (Hotkey: M)' : 'Mute Mic (Hotkey: M)'}
        >
          {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Master Audio Mic Pulsing Circular Aura Button */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onToggleMic}
          className={`relative p-4 rounded-full font-medium transition-all shadow-lg flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-400 ${
            isMicMuted
              ? 'bg-gray-800 text-gray-400 border border-gray-700'
              : 'bg-blue-600 text-white border border-blue-400/40 shadow-[0_0_30px_rgba(59,130,246,0.5)]'
          }`}
          title="Push to Talk / Mute Audio"
        >
          {!isMicMuted && (
            <span className="animate-ping absolute inset-0 rounded-full bg-blue-400 opacity-40 pointer-events-none" />
          )}
          <Mic className="w-5 h-5 relative z-10" />
        </motion.button>
      </div>
    </div>
  );
};
