import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Activity, Database, Sparkles, X } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { globalBreethMemoryService } from '../services/ai/BreethMemoryService';

export const DevDebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedCandidate, currentQuestion, scores, metrics, aiStatus } = useInterview();

  // Toggle debug panel with Ctrl+Shift+D shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Do not render in production unless explicitly toggled
  if (!(import.meta as any).env?.DEV && !isOpen) {
    return null;
  }

  const memoryContext = globalBreethMemoryService.getCandidateMemoryContext(selectedCandidate.id);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 px-3 py-1.5 rounded-full bg-[#09090B] border border-blue-500/30 text-blue-400 font-mono text-[11px] hover:bg-blue-950/40 transition-colors shadow-2xl flex items-center space-x-1.5"
      >
        <Terminal className="w-3.5 h-3.5" />
        <span>DEV DEBUG (Ctrl+Shift+D)</span>
      </button>

      {/* Debug Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 bottom-0 left-0 w-80 bg-[#09090B]/95 backdrop-blur-xl border-r border-white/10 p-5 z-50 overflow-y-auto space-y-5 text-xs font-mono text-gray-300 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2 text-blue-400 font-bold">
                <Terminal className="w-4 h-4" />
                <span>INTERVIX DEVELOPER PANEL</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Provider Status Grid */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">AI Pipeline Status</div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="flex items-center space-x-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Gemini AI Engine</span>
                  </span>
                  <span className="text-emerald-400 font-bold">ONLINE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center space-x-1.5">
                    <Database className="w-3 h-3 text-blue-400" />
                    <span>Breeth Memory</span>
                  </span>
                  <span className="text-blue-400 font-bold">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center space-x-1.5">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    <span>NotebookLM Context</span>
                  </span>
                  <span className="text-cyan-400 font-bold">INJECTED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center space-x-1.5">
                    <Activity className="w-3 h-3 text-purple-400" />
                    <span>Browser WebSpeech TTS</span>
                  </span>
                  <span className="text-purple-400 font-bold font-mono">0.94x RATE</span>
                </div>
              </div>
            </div>

            {/* Live Session State */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Live Session Metrics</div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1 text-gray-400">
                <div>AI Status: <span className="text-white font-bold">{aiStatus}</span></div>
                <div>Candidate: <span className="text-white font-bold">{selectedCandidate.name}</span></div>
                <div>Difficulty: <span className="text-amber-400 font-bold">{currentQuestion?.difficulty || 'hard'}</span></div>
                <div>Question #: <span className="text-blue-400 font-bold">{metrics.questionsAsked + 1} / 31</span></div>
                <div>Overall Index: <span className="text-emerald-400 font-bold">{scores.overallScore}%</span></div>
              </div>
            </div>

            {/* Active Breeth Memory Context */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Active Memory Context</div>
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 leading-relaxed">
                {memoryContext}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
