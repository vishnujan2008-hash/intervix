import React from 'react';
import { motion } from 'framer-motion';
import { Candidate } from '../types';
import { CandidateService } from '../services/data/CandidateService';
import { AnalyticsService } from '../services/data/AnalyticsService';
import { ArrowRight, CheckCircle2, Sparkles, Clock, ShieldCheck } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  isSelected?: boolean;
  onSelect: (candidate: Candidate) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isSelected,
  onSelect,
}) => {
  const cand: any = candidate;
  const completedMissions = CandidateService.getCompletedMissions(candidate.id);
  const completionRate = AnalyticsService.calculateCompletion(candidate.id);
  const firstTryRate = AnalyticsService.calculateSuccessRate(candidate.id);
  const avgAttempts = AnalyticsService.calculateAttempts(candidate.id);
  const currentModule = AnalyticsService.calculateCurrentModule(candidate.id);

  const name = cand.name || candidate.name;
  const role = cand.jobRole || candidate.role;
  const expYears = cand.yearsExperience || candidate.experienceYears || 3;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect(candidate)}
      className={`glass-panel-interactive rounded-3xl p-6 border cursor-pointer relative overflow-hidden transition-all bg-[#050507]/80 ${
        isSelected
          ? 'bg-blue-600/15 border-blue-400/60 shadow-[0_0_35px_rgba(59,130,246,0.3)]'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/20 to-transparent pointer-events-none rounded-tr-3xl" />
      )}

      {/* REQUIREMENT 3: Name, Role, Years Experience, Status Badge */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={candidate.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
            alt={name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
          />
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">{name}</h3>
            <p className="text-xs text-gray-400 font-medium">{role}</p>
            <span className="text-[11px] font-mono text-blue-400 font-semibold">{expYears} Yrs Exp.</span>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border uppercase tracking-wider ${
          candidate.status === 'Completed'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : candidate.status === 'In Progress'
            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 animate-pulse'
            : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
        }`}>
          {candidate.status}
        </span>
      </div>

      {/* REQUIREMENT 3 & 4: Completed Missions, Completion %, Commit Days, Attempts, First Try % */}
      <div className="mt-4 p-3 rounded-2xl bg-white/5 border border-white/5 grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-300">
        <div className="flex items-center space-x-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>Done: {completedMissions.length} / 31 ({completionRate}%)</span>
        </div>
        <div className="flex items-center space-x-1 text-cyan-300 font-bold justify-end">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>1st-Try: {firstTryRate}%</span>
        </div>
        <div className="flex items-center space-x-1.5 text-gray-400">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>Commit: {cand.signals?.avgCommitDays || 1.4}d</span>
        </div>
        <div className="flex items-center space-x-1 text-purple-300 font-bold justify-end">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Avg Att: {avgAttempts}</span>
        </div>
      </div>

      {/* REQUIREMENT 5: Remove fake tech chips (LangChain/Zod); display Current Module & Current Mission */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-300 font-mono font-bold">
          Module {currentModule} Active
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-300 font-mono font-bold">
          Mission {completedMissions.length + 1} / 31
        </span>
      </div>

      {/* REQUIREMENT 3: Configure Session Button */}
      <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <span className="text-[11px] text-gray-500 font-mono">ID: {candidate.id}</span>
        <button className="flex items-center space-x-1.5 text-blue-400 hover:text-blue-300 font-semibold transition-colors">
          <span>Configure Session</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
