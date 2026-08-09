import React from 'react';
import { useInterview } from '../context/InterviewContext';
import { IntervixIcon } from './IntervixLogo';
import { ArrowLeft, SlidersHorizontal, Zap, Shield } from 'lucide-react';
import { ScreenRoute } from '../types';

export const TopBar: React.FC = () => {
  const { currentRoute, goBack, historyStack, setSettingsOpen, selectedCandidate, startDemoMode } = useInterview();

  const routeTitles: Record<ScreenRoute, string> = {
    splash: 'Intervix / Initializing',
    welcome: 'Intervix / Welcome',
    dashboard: 'Intervix / Platform Dashboard',
    'candidate-selection': 'Intervix / Candidate Selection',
    'interview-config': 'Intervix / Session Configuration',
    'interview-session': `Intervix / Live Evaluation — ${selectedCandidate.name}`,
    'interview-summary': `Intervix / Performance Brief — ${selectedCandidate.name}`,
    history: 'Intervix / Assessment History',
    analytics: 'Intervix / Enterprise Analytics',
    settings: 'Intervix / System Settings',
    '404': 'Intervix / Route Not Found',
  };

  const showBackButton = historyStack.length > 1 && currentRoute !== 'dashboard' && currentRoute !== 'splash';

  return (
    <header className="h-16 w-full border-b border-white/10 bg-[#09090B]/80 backdrop-blur-xl px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Left: Back Button & Route Breadcrumb */}
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <button
            onClick={goBack}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all flex items-center space-x-1.5 text-xs font-medium focus-visible:ring-2 focus-visible:ring-blue-400"
            title="Go Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        )}

        <div className="flex items-center space-x-2.5">
          <IntervixIcon size={22} />
          <h1 className="text-xs font-mono font-semibold tracking-wider text-gray-200 uppercase">
            {routeTitles[currentRoute]}
          </h1>
        </div>
      </div>

      {/* Right: Judge Demo Mode Trigger & Settings */}
      <div className="flex items-center space-x-3">
        {/* Judge Demo Button */}
        <button
          onClick={startDemoMode}
          className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-mono text-xs font-bold border border-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 transition-all flex items-center space-x-1.5"
          title="Launch 2-Minute Automated Judge Demo"
        >
          <Zap className="w-3.5 h-3.5 fill-white text-white" />
          <span>Launch 2-Min Demo</span>
        </button>

        <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-300">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span>E2E Encrypted</span>
        </div>

        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-blue-400"
          title="System Settings"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
