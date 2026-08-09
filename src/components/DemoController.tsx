import React from 'react';
import { motion } from 'framer-motion';
import { useInterview } from '../context/InterviewContext';
import { Zap, Pause, Play, SkipForward, X } from 'lucide-react';
import { DEMO_TIMELINE } from '../engine/DemoPlayer';

export const DemoController: React.FC = () => {
  const { isDemoActive, demoStepIndex, isDemoPaused, togglePauseDemo, skipDemoStep, stopDemoMode } = useInterview();

  if (!isDemoActive) return null;

  const currentStep = DEMO_TIMELINE.find(s => s.stepIndex === demoStepIndex) || DEMO_TIMELINE[0];
  const progressPercent = Math.round((demoStepIndex / DEMO_TIMELINE.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
    >
      <div className="glass-panel rounded-full px-5 py-2.5 border border-blue-500/40 bg-[#09090B]/90 backdrop-blur-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center justify-between gap-4 select-none">
        {/* Left: Demo Indicator Pill & Title */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-mono font-bold flex items-center space-x-1 flex-shrink-0 animate-pulse">
            <Zap className="w-3 h-3 text-blue-400 fill-blue-400" />
            <span>JUDGE DEMO ({demoStepIndex}/{DEMO_TIMELINE.length})</span>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{currentStep.label}</h4>
            <div className="h-1 w-full bg-white/10 rounded-full mt-1 overflow-hidden">
              <div 
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-blue-400 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Controls (Play/Pause, Skip, Exit) */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={togglePauseDemo}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title={isDemoPaused ? 'Play Demo' : 'Pause Demo'}
          >
            {isDemoPaused ? <Play className="w-3.5 h-3.5 fill-white" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={skipDemoStep}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Next Demo Step"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={stopDemoMode}
            className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
            title="Exit Demo Mode"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
