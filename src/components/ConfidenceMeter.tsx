import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface ConfidenceMeterProps {
  confidencePercent: number;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ confidencePercent }) => {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center space-x-1.5 text-gray-300 font-semibold">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Candidate Confidence Index</span>
        </span>
        <span className="font-mono font-bold text-amber-400">{confidencePercent}%</span>
      </div>

      <div className="h-2 w-full rounded-full bg-white/5 border border-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidencePercent}%` }}
          transition={{ duration: 1 }}
          className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-300 shadow-[0_0_10px_#F59E0B]"
        />
      </div>
    </div>
  );
};
