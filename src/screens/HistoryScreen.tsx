import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInterview } from '../context/InterviewContext';
import { InterviewResultStore } from '../services/data/InterviewResultStore';
import { CandidateService } from '../services/data/CandidateService';
import { History as HistoryIcon, Search, FileText, BarChart3, Clock, ShieldCheck } from 'lucide-react';

export const HistoryScreen: React.FC = () => {
  const { navigateTo, setSelectedCandidate } = useInterview();
  const [searchQuery, setSearchQuery] = useState('');

  const results = InterviewResultStore.getAllResults();

  const filteredResults = results.filter(res => 
    res.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.candidateRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.recommendationBadge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 mb-2">
          <HistoryIcon className="w-3.5 h-3.5" />
          <span>PAST INTERVIEW TELEMETRY ARCHIVE</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Assessment History & Interview Results
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-light">
          Access complete candidate interview results, executive briefs, and real-time telemetry across all evaluation runs.
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center space-x-3 bg-[#09090B]">
        <Search className="w-4 h-4 text-gray-500" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter history by candidate name, role, or hiring decision..." 
          className="bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none w-full font-mono"
        />
      </div>

      {/* History Items List */}
      <div className="space-y-4">
        {filteredResults.map((res, i) => {
          const cand = CandidateService.getCandidate(res.candidateId);
          const avatar = cand?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';

          return (
            <motion.div
              key={res.sessionId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/5 transition-all bg-[#050507]/90"
            >
              <div className="flex items-center space-x-4">
                <img src={avatar} alt={res.candidateName} className="w-14 h-14 rounded-2xl object-cover border border-white/20 shadow-lg" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-white">{res.candidateName}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      res.recommendationBadge === 'STRONG HIRE'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : res.recommendationBadge === 'HIRE'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {res.recommendationBadge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{res.candidateRole} • {res.experienceYears} Yrs Exp</p>
                  <div className="flex items-center space-x-3 text-[11px] font-mono text-gray-400 mt-1">
                    <span className="flex items-center space-x-1 text-blue-400">
                      <Clock className="w-3 h-3" />
                      <span>Duration: {res.durationFormatted}</span>
                    </span>
                    <span>Turns: {res.statistics.conversationTurns}</span>
                    <span>Score: {res.overallScore}/100</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    if (cand) setSelectedCandidate(cand);
                    navigateTo('interview-summary');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all font-mono"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Brief</span>
                </button>

                <button
                  onClick={() => {
                    if (cand) setSelectedCandidate(cand);
                    navigateTo('analytics');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all font-mono"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>View Analytics</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
