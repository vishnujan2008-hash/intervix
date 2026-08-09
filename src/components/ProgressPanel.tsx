import React from 'react';
import { motion } from 'framer-motion';
import { LiveScores, InterviewMetrics } from '../types';
import { Activity, ShieldCheck } from 'lucide-react';
import { LiveScore } from './LiveScore';
import { AdaptiveDifficulty } from './AdaptiveDifficulty';
import { ConfidenceMeter } from './ConfidenceMeter';

interface ProgressPanelProps {
  scores: LiveScores;
  metrics: InterviewMetrics;
}

export const ProgressPanel: React.FC<ProgressPanelProps> = ({ scores, metrics }) => {
  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-white/10 shadow-xl flex flex-col space-y-5">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Live Assessment Matrix</h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          REAL-TIME
        </span>
      </div>

      {/* Overall Score Wheel Badge */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#09090B]/80 border border-white/10">
        <div>
          <span className="text-[10px] font-mono uppercase text-textSec block">Overall Technical Index</span>
          <span className="text-2xl font-extrabold text-white tracking-tight font-sans">
            {scores.overallScore}<span className="text-xs text-textSec font-normal"> / 100</span>
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#09090B] flex items-center justify-center font-mono text-xs font-bold text-blue-400">
            A+
          </div>
        </div>
      </div>

      {/* Adaptive Rigor & Candidate Confidence Meter */}
      <AdaptiveDifficulty difficulty={metrics.adaptiveDifficulty} />
      <ConfidenceMeter confidencePercent={metrics.candidateConfidence || 94} />

      {/* Live Metric Progress Bars with Trend Arrows */}
      <div className="pt-2">
        <LiveScore scores={scores} />
      </div>
    </div>
  );
};
