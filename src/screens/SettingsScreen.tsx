import React from 'react';
import { SettingsModal } from '../components/SettingsModal';
import { Sliders, Sparkles } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 mb-2">
          <Sliders className="w-3.5 h-3.5" />
          <span>SYSTEM CONFIGURATION</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Intervix Settings & Engine Tuning
        </h1>
        <p className="text-xs text-textSec mt-1 font-light">
          Configure hardware inputs, neural voice models, and adaptive assessment sensitivity.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-8 border border-white/10 text-center space-y-4">
        <Sparkles className="w-12 h-12 text-blue-400 mx-auto animate-pulse" />
        <h3 className="text-lg font-bold text-white">System Settings Control Panel Active</h3>
        <p className="text-xs text-textSec max-w-md mx-auto">
          All changes saved here dynamically adjust the Intervix neural engine behavior during live sessions.
        </p>
      </div>
    </div>
  );
};
