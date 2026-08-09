import React from 'react';
import { motion } from 'framer-motion';
import { useInterview } from '../context/InterviewContext';
import { IntervixLogo } from '../components/IntervixLogo';
import { AnalyticsPanel } from '../components/AnalyticsPanel';
import { CandidateCard } from '../components/CandidateCard';
import { CurriculumTimeline } from '../components/CurriculumTimeline';
import { AnalyticsService } from '../services/data/AnalyticsService';
import { Play, Users, Award, TrendingUp, ShieldCheck, Cpu, AlertTriangle, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const { candidates, navigateTo, setSelectedCandidate } = useInterview();
  const stats = AnalyticsService.calculateDashboardStats();

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 bg-[#050507]/90"
      >
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <IntervixLogo variant="compact" iconSize={32} />
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-300">
              <Cpu className="w-3.5 h-3.5" />
              <span>OFFICIAL ENTERPRISE PLATFORM</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight font-sans">
            Technical Assessment Hub
          </h1>
          <p className="text-xs md:text-sm text-gray-400 max-w-xl font-light">
            Real-time evaluation platform calculated from <span className="text-white font-semibold">{stats.totalCandidates} Candidate Datasets</span> across 31 Days of telemetry.
          </p>
        </div>

        <button
          onClick={() => navigateTo('candidate-selection')}
          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider border border-blue-400/40 shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all flex items-center space-x-2 flex-shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Launch New Interview</span>
        </button>
      </motion.div>

      {/* REQUIREMENT 2: Computed Live Analytics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-1 bg-[#050507]/80">
          <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
            <span>Total Candidates</span>
            <Users className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">
            {stats.totalCandidates} <span className="text-xs text-gray-500">Active</span>
          </div>
          <p className="text-[10px] text-blue-400 font-mono">{stats.completedInterviews} Completed • {stats.inProgress} In Progress</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-1 bg-[#050507]/80">
          <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
            <span>Avg Experience</span>
            <Award className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-purple-300">
            {stats.averageExperience} <span className="text-xs text-gray-500">Years</span>
          </div>
          <p className="text-[10px] text-purple-400 font-mono">Seniority benchmark</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-1 bg-[#050507]/80">
          <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
            <span>Avg Missions Done</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">
            {stats.averageMissionsCompleted} <span className="text-xs text-gray-500">/ 31</span>
          </div>
          <p className="text-[10px] text-emerald-300 font-mono">Derived from curriculum.json</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-1 bg-[#050507]/80">
          <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
            <span>First-Try Success</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-cyan-300">
            {stats.averageFirstAttemptSuccess}%
          </div>
          <p className="text-[10px] text-cyan-400 font-mono">Calculated telemetry</p>
        </div>
      </div>

      {/* REQUIREMENT 2: Highest & Lowest Performer + Most Common Failed Mission */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Highest Performer */}
        <div className="glass-panel p-5 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-bold text-emerald-400 uppercase">
            <span>Highest Performing</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          {stats.highestPerformingCandidate ? (
            <div>
              <h3 className="text-sm font-extrabold text-white">{stats.highestPerformingCandidate.name}</h3>
              <p className="text-xs text-gray-400">{(stats.highestPerformingCandidate as any).jobRole || stats.highestPerformingCandidate.role}</p>
              <div className="mt-2 text-[11px] font-mono text-emerald-300">
                Completion Rate: {stats.highestPerformingCandidate.signals.completionRate}%
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400">No candidates evaluated</p>
          )}
        </div>

        {/* Lowest Performer */}
        <div className="glass-panel p-5 rounded-3xl border border-amber-500/20 bg-amber-500/5 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-bold text-amber-400 uppercase">
            <span>Requires Development</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          {stats.lowestPerformingCandidate ? (
            <div>
              <h3 className="text-sm font-extrabold text-white">{stats.lowestPerformingCandidate.name}</h3>
              <p className="text-xs text-gray-400">{(stats.lowestPerformingCandidate as any).jobRole || stats.lowestPerformingCandidate.role}</p>
              <div className="mt-2 text-[11px] font-mono text-amber-300">
                Completion Rate: {stats.lowestPerformingCandidate.signals.completionRate}%
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400">No candidates evaluated</p>
          )}
        </div>

        {/* Most Common Failed Mission */}
        <div className="glass-panel p-5 rounded-3xl border border-purple-500/20 bg-purple-500/5 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-bold text-purple-400 uppercase">
            <span>Most Common Friction Point</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white leading-relaxed">{stats.mostCommonFailedMission}</h3>
            <p className="text-[11px] text-purple-300 mt-2 font-mono">
              {stats.candidatesRequiringReview.length} candidates requiring review
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Candidate Pipeline (candidates.json)
              </h2>
            </div>
            <button
              onClick={() => navigateTo('candidate-selection')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              View Roster →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onSelect={(cand) => {
                  setSelectedCandidate(cand);
                  navigateTo('interview-config');
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <CurriculumTimeline />
        </div>
      </div>

      {/* System Analytics */}
      <div className="pt-4">
        <AnalyticsPanel />
      </div>
    </div>
  );
};
