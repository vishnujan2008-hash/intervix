import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInterview } from '../context/InterviewContext';
import { InterviewMode } from '../types';
import { Sliders, Play, Cpu, Mic, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';

export const InterviewConfigurationScreen: React.FC = () => {
  const { selectedCandidate, navigateTo, interviewMode, setInterviewMode, startNewInterviewSession } = useInterview();
  const [difficulty, setDifficulty] = useState<'Standard' | 'Adaptive High' | 'Hardcore'>('Adaptive High');
  const [duration, setDuration] = useState('30 Minutes');
  const [mcpEnabled, setMcpEnabled] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 mb-2">
          <Sliders className="w-3.5 h-3.5" />
          <span>PRE-SESSION PARAMS</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
          Configure Interview Session
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-light">
          Targeting Candidate: <span className="text-white font-semibold">{selectedCandidate.name}</span> ({selectedCandidate.role})
        </p>
      </div>

      {/* Main Configuration Card */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
        {/* Candidate Summary */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-4">
          <img
            src={selectedCandidate.avatar}
            alt={selectedCandidate.name}
            className="w-12 h-12 rounded-full object-cover border border-white/20"
          />
          <div>
            <h3 className="text-sm font-bold text-white">{selectedCandidate.name}</h3>
            <p className="text-xs text-gray-400">{selectedCandidate.role} • {selectedCandidate.experienceYears} Years Exp.</p>
          </div>
        </div>

        {/* REQUIREMENT 1: Interview Mode Selection Cards */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 block">
            Choose Interview Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Voice Mode */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => setInterviewMode('voice')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                interviewMode === 'voice'
                  ? 'bg-blue-600/20 border-blue-400/60 shadow-[0_0_25px_rgba(59,130,246,0.25)]'
                  : 'bg-white/5 border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">🎤 Voice Interview</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Recommended</span>
                  </div>
                </div>
                {interviewMode === 'voice' && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed mt-2">
                Real-time voice interaction with WebSpeech audio synthesis, instant interruption, and neural visualizer.
              </p>
            </motion.div>

            {/* Text Mode */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => setInterviewMode('text')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                interviewMode === 'text'
                  ? 'bg-purple-600/20 border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.25)]'
                  : 'bg-white/5 border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">⌨️ Text Interview</span>
                    <span className="text-[10px] font-mono text-purple-300 font-bold uppercase">No Mic Required</span>
                  </div>
                </div>
                {interviewMode === 'text' && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed mt-2">
                Enterprise AI Chat experience (ChatGPT/Linear style) with syntax highlighting, markdown rendering, and hotkeys.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 block">
            Adaptive Rigor Tier
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'Standard', title: 'Standard Tier', desc: 'Core fundamentals & baseline algorithms' },
              { id: 'Adaptive High', title: 'Adaptive High (Recommended)', desc: 'Real-time difficulty scaling based on candidate confidence' },
              { id: 'Hardcore', title: 'Hardcore CTO Tier', desc: 'Deep distributed systems edge cases & LLM infra internals' },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => setDifficulty(item.id as any)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  difficulty === item.id
                    ? 'bg-blue-600/20 border-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                    : 'bg-white/5 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{item.title}</span>
                  {difficulty === item.id && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                </div>
                <p className="text-[11px] text-gray-400 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Duration & MCP Protocol Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 block mb-2">
              Session Time Limit
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-[#09090B] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option>15 Minutes (Express Assessment)</option>
              <option>30 Minutes (Standard Deep Dive)</option>
              <option>45 Minutes (Full Curriculum Rigor)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 block mb-2">
              Model Context Protocol (MCP) Tools
            </label>
            <button
              onClick={() => setMcpEnabled(!mcpEnabled)}
              className={`w-full p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors ${
                mcpEnabled
                  ? 'bg-blue-600/15 border-blue-400/40 text-blue-200'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              <span className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>Enable Real-time Sandbox & Tool Execution</span>
              </span>
              <span>{mcpEnabled ? 'ACTIVE' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={() => {
              startNewInterviewSession();
              navigateTo('interview-session');
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider border border-blue-400/40 shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all flex items-center justify-center space-x-3 group"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Live Intervix ({interviewMode === 'text' ? 'Text Chat' : 'Voice'})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
