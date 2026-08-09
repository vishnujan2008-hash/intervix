import React from 'react';
import { AIStatus } from '../types';
import { Mic, Volume2, Brain, Pause, Radio } from 'lucide-react';

interface VoiceStatusProps {
  status: AIStatus;
  isMicMuted: boolean;
  isSpeakerMuted: boolean;
}

export const VoiceStatus: React.FC<VoiceStatusProps> = ({
  status,
  isMicMuted,
  isSpeakerMuted,
}) => {
  const getStatusBadge = () => {
    if (isMicMuted) {
      return { label: 'MIC MUTED', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30', icon: Mic };
    }
    switch (status) {
      case 'listening':
        return { label: 'LISTENING', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-400/30', icon: Mic };
      case 'thinking':
        return { label: 'THINKING', color: 'bg-purple-500/15 text-purple-400 border-purple-400/30', icon: Brain };
      case 'speaking':
        return { label: 'SPEAKING', color: 'bg-blue-500/20 text-blue-300 border-blue-400/40', icon: Volume2 };
      case 'paused':
        return { label: 'PAUSED', color: 'bg-amber-500/15 text-amber-300 border-amber-400/30', icon: Pause };
      default:
        return { label: 'STANDBY', color: 'bg-white/5 text-gray-400 border-white/10', icon: Radio };
    }
  };

  const badge = getStatusBadge();
  const Icon = badge.icon;

  return (
    <div className="flex items-center space-x-2">
      <div className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border flex items-center space-x-1.5 backdrop-blur-md ${badge.color}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{badge.label}</span>
      </div>

      {/* Speaker hardware indicator pill */}
      <div className={`px-2.5 py-1 rounded-full text-[11px] font-mono border ${
        isSpeakerMuted ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-white/5 text-gray-400 border-white/10'
      }`}>
        {isSpeakerMuted ? 'Muted' : 'Audio On'}
      </div>
    </div>
  );
};
