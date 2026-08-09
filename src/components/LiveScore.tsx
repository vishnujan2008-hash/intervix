import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MessageSquare, Code2, ShieldCheck, Cpu, BrainCircuit, Layers } from 'lucide-react';
import { LiveScores } from '../types';

interface LiveScoreProps {
  scores: LiveScores;
}

export const LiveScore: React.FC<LiveScoreProps> = ({ scores }) => {
  const getQualitativeRating = (score: number, label: string) => {
    if (label === 'Reasoning' && score < 95) return 'Needs deeper trade-offs';
    if (score >= 95) return 'Excellent';
    if (score >= 90) return 'Strong';
    if (score >= 85) return 'Optimal';
    return 'Adequate';
  };

  const metrics = [
    { label: 'Communication', score: scores.communication, icon: MessageSquare, color: 'from-blue-500 to-cyan-400', trend: '+1.8%' },
    { label: 'Technical Accuracy', score: scores.technicalAccuracy, icon: Code2, color: 'from-indigo-500 to-blue-400', trend: '+2.4%' },
    { label: 'Reasoning', score: scores.reasoning, icon: BrainCircuit, color: 'from-purple-500 to-indigo-400', trend: '+1.2%' },
    { label: 'Problem Solving', score: scores.problemSolving, icon: Cpu, color: 'from-sky-500 to-blue-600', trend: '+3.1%' },
    { label: 'Architecture Thinking', score: scores.architectureThinking, icon: Layers, color: 'from-cyan-500 to-teal-400', trend: '+2.9%' },
    { label: 'Confidence', score: scores.confidence, icon: ShieldCheck, color: 'from-emerald-500 to-teal-400', trend: '+0.5%' },
  ];

  return (
    <div className="space-y-3">
      {metrics.map((item, i) => {
        const Icon = item.icon;
        const rating = getQualitativeRating(item.score, item.label);

        return (
          <div 
            key={i} 
            className="group relative glass-card-subtle p-3 rounded-2xl border border-white/5 hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center space-x-2 text-gray-200 font-semibold">
                <Icon className="w-3.5 h-3.5 text-blue-400" />
                <span>{item.label}</span>
              </span>
              
              {/* REQUIREMENT 11: Qualitative Insights badge with percentage on hover */}
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 group-hover:hidden transition-all">
                  {rating}
                </span>
                <span className="hidden group-hover:inline font-mono font-bold text-emerald-400 text-xs transition-all">
                  {item.score}% ({item.trend})
                </span>
              </div>
            </div>

            <div className="h-1.5 w-full rounded-full bg-white/5 border border-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 1.2, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full rounded-full bg-gradient-to-r ${item.color} shadow-[0_0_10px_rgba(59,130,246,0.35)]`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
