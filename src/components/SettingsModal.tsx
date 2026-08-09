import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInterview } from '../context/InterviewContext';
import { X, Sliders, Volume2, Mic, Cpu, Shield, Sparkles } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setSettingsOpen } = useInterview();

  if (!isSettingsOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg glass-panel rounded-3xl p-6 border border-white/15 shadow-2xl relative overflow-hidden"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-400/30">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight">System Settings</h3>
                <p className="text-xs text-textSec">Intervix AI Engine Parameters</p>
              </div>
            </div>

            <button
              onClick={() => setSettingsOpen(false)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Sections */}
          <div className="space-y-5 text-xs">
            {/* AI Persona Selection */}
            <div>
              <label className="text-gray-300 font-semibold mb-2 flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>AI Interviewer Personality & Tone</span>
              </label>
              <select className="w-full bg-[#09090B] border border-white/10 rounded-xl p-3 text-gray-200 focus:outline-none focus:border-blue-500">
                <option>Strict Technical Architect (Standard)</option>
                <option>Adaptive Socratic Mentor</option>
                <option>Hardcore Silicon Valley Staff Engineer</option>
              </select>
            </div>

            {/* Audio Hardware Input */}
            <div>
              <label className="text-gray-300 font-semibold mb-2 flex items-center space-x-2">
                <Mic className="w-3.5 h-3.5 text-cyan-400" />
                <span>Default Microphone Input</span>
              </label>
              <select className="w-full bg-[#09090B] border border-white/10 rounded-xl p-3 text-gray-200 focus:outline-none focus:border-blue-500">
                <option>Studio Microphone (Built-in Audio)</option>
                <option>MacBook Pro Microphone (Array)</option>
              </select>
            </div>

            {/* Audio Voice Synthesizer Output */}
            <div>
              <label className="text-gray-300 font-semibold mb-2 flex items-center space-x-2">
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                <span>ElevenLabs Neural Voice Model</span>
              </label>
              <select className="w-full bg-[#09090B] border border-white/10 rounded-xl p-3 text-gray-200 focus:outline-none focus:border-blue-500">
                <option>ElevenLabs Adam — Deep Authoritative Technical</option>
                <option>ElevenLabs Rachel — Professional & Precise</option>
                <option>ElevenLabs Antoni — Silicon Valley CTO Tone</option>
              </select>
            </div>

            {/* Adaptive Difficulty Sensitivity */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-gray-300">
                <span className="font-semibold flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real-time Adaptive Sensitivity</span>
                </span>
                <span className="font-mono text-blue-400">High (0.85)</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                defaultValue="85" 
                className="w-full accent-blue-500 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-4 border-t border-white/10 flex justify-end space-x-3">
            <button
              onClick={() => setSettingsOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setSettingsOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all"
            >
              Save Configuration
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
