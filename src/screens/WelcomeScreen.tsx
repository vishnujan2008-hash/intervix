import React from 'react';
import { motion } from 'framer-motion';
import { useInterview } from '../context/InterviewContext';
import { ArrowRight, Bot, ShieldCheck, Zap, Layers, Play } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { navigateTo } = useInterview();

  return (
    <div className="w-full min-h-screen bg-[#09090B] bg-radial-glow flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden select-none">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Hero Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl glass-panel rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl relative z-10 text-center flex flex-col items-center"
      >
        {/* Top Tagline Pill */}
        <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-mono font-medium mb-6 inline-flex items-center space-x-2">
          <Zap className="w-3.5 h-3.5" />
          <span>REPLACING HUMAN TECHNICAL INTERVIEWERS WITH ZERO BIAS</span>
        </div>

        {/* Large Typography Heading */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-2xl font-sans">
          The Next-Generation <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            AI Technical Interviewer
          </span>
        </h1>

        <p className="text-sm md:text-base text-textSec mt-4 max-w-xl leading-relaxed font-light">
          Conduct deep, adaptive technical evaluations across Vector Search, RAG Architectures, System Design, and Model Context Protocol — in real-time voice.
        </p>

        {/* Feature Grid Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 w-full max-w-2xl text-left">
          <div className="glass-panel-interactive p-4 rounded-2xl border border-white/10">
            <Bot className="w-5 h-5 text-blue-400 mb-2" />
            <h3 className="text-xs font-bold text-white">Adaptive Difficulty</h3>
            <p className="text-[11px] text-textSec mt-1">Dynamically adjusts question rigor based on candidate response clarity.</p>
          </div>

          <div className="glass-panel-interactive p-4 rounded-2xl border border-white/10">
            <Layers className="w-5 h-5 text-cyan-400 mb-2" />
            <h3 className="text-xs font-bold text-white">10-Day Curriculum</h3>
            <p className="text-[11px] text-textSec mt-1">Covers complete modern AI stack from Prompting to Security.</p>
          </div>

          <div className="glass-panel-interactive p-4 rounded-2xl border border-white/10">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
            <h3 className="text-xs font-bold text-white">Real-Time Analytics</h3>
            <p className="text-[11px] text-textSec mt-1">Multi-dimensional scoring across communication & depth.</p>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigateTo('candidate-selection')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider border border-blue-400/40 shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center space-x-2 group cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Select Candidate & Begin</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigateTo('dashboard')}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs uppercase tracking-wider border border-white/10 transition-all"
          >
            Explore Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};
