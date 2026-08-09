import React from 'react';
import { Clock } from 'lucide-react';

interface InterviewTimerProps {
  timeElapsedSeconds: number;
}

export const InterviewTimer: React.FC<InterviewTimerProps> = ({ timeElapsedSeconds }) => {
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-2 bg-[#09090B] px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-mono font-bold text-white tracking-widest">
      <Clock className="w-3.5 h-3.5 text-blue-400" />
      <span>{formatTime(timeElapsedSeconds)}</span>
    </div>
  );
};
