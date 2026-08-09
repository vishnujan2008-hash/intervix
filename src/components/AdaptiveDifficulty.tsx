import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck } from 'lucide-react';

interface AdaptiveDifficultyProps {
  difficulty: string;
}

export const AdaptiveDifficulty: React.FC<AdaptiveDifficultyProps> = ({ difficulty }) => {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-textSec block">Adaptive Rigor Mode</span>
          <span className="text-xs font-bold text-white tracking-tight">{difficulty}</span>
        </div>
      </div>

      <div className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-400/30 flex items-center space-x-1">
        <ShieldCheck className="w-3 h-3 text-purple-400" />
        <span>AUTO-SCALING</span>
      </div>
    </div>
  );
};
