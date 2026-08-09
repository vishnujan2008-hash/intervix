import React from 'react';
import { motion } from 'framer-motion';
import { AIStatus } from '../types';
import { Mic, Brain, Volume2, PauseCircle } from 'lucide-react';

interface StatusIndicatorProps {
  currentStatus: AIStatus;
  onStatusChange: (status: AIStatus) => void;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  const statuses: { id: AIStatus; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'listening', label: 'Listening', icon: Mic, color: 'text-cyan-400 border-cyan-500/30' },
    { id: 'thinking', label: 'Thinking', icon: Brain, color: 'text-purple-400 border-purple-500/30' },
    { id: 'speaking', label: 'Speaking', icon: Volume2, color: 'text-blue-400 border-blue-500/30' },
    { id: 'idle', label: 'Idle', icon: PauseCircle, color: 'text-gray-400 border-gray-500/30' },
  ];

  return (
    <div className="flex items-center justify-center p-1.5 rounded-full bg-secCardDark/70 border border-white/10 backdrop-blur-md shadow-inner">
      <div className="flex space-x-1">
        {statuses.map((item) => {
          const Icon = item.icon;
          const isActive = currentStatus === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onStatusChange(item.id)}
              className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center space-x-1.5 ${
                isActive ? 'text-white font-semibold' : 'text-textSec hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeStatusPill"
                  className="absolute inset-0 rounded-full bg-blue-600/30 border border-blue-400/40 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center space-x-1.5">
                <Icon className={`w-3.5 h-3.5 ${isActive ? item.color.split(' ')[0] : ''}`} />
                <span>{item.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
