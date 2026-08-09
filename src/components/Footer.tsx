import React from 'react';
import { IntervixLogo } from './IntervixLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 border-t border-white/10 text-xs text-gray-400 flex flex-col md:flex-row items-center justify-between gap-3 px-6 mt-12 font-mono">
      <div className="flex items-center space-x-3">
        <IntervixLogo variant="compact" iconSize={22} />
        <span className="text-gray-500">•</span>
        <span className="text-gray-400">Enterprise Technical Assessment Platform</span>
      </div>
      <div>
        <span className="text-amber-300/80">Autonomous AI Recruiter Engine</span>
      </div>
    </footer>
  );
};
