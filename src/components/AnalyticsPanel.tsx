import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Brain, 
  Target, 
  Activity, 
  Sparkles, 
  Clock, 
  Award, 
  Cpu, 
  Zap,
  UserCheck,
  ChevronRight,
  CheckCircle2,
  FileText,
  Layers,
  AlertTriangle,
  BarChart3,
  GitCommit,
  TrendingUp,
  FastForward,
  HelpCircle
} from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { InterviewResultStore } from '../services/data/InterviewResultStore';
import { CandidateService } from '../services/data/CandidateService';
import { IntervixLogo } from './IntervixLogo';

export const AnalyticsPanel: React.FC = () => {
  const { selectedCandidate, setSelectedCandidate, navigateTo } = useInterview();

  // Fetch all completed interview sessions for the selected candidate
  const candidateResults = InterviewResultStore.getResultsForCandidate(selectedCandidate.id);
  const [selectedSessionId, setSelectedSessionId] = useState<string>(candidateResults[0]?.sessionId || '');

  // Current active result (defaults to newest interview session)
  const currentResult = candidateResults.find(r => r.sessionId === selectedSessionId) || candidateResults[0] || InterviewResultStore.getAllResults()[0];

  const handleCandidateSwitch = (candidateId: string) => {
    const cand = CandidateService.getCandidate(candidateId);
    if (cand) {
      setSelectedCandidate(cand);
      const results = InterviewResultStore.getResultsForCandidate(cand.id);
      if (results.length > 0) {
        setSelectedSessionId(results[0].sessionId);
      }
    }
  };

  const allCandidates = CandidateService.getAllCandidates();

  if (!currentResult) {
    return (
      <div className="glass-panel p-10 rounded-3xl border border-amber-500/20 text-center space-y-4 bg-[#050507]/90">
        <IntervixLogo variant="compact" iconSize={36} className="justify-center" />
        <h3 className="text-xl font-bold text-white">No Interview Results Recorded</h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto font-mono">
          Launch a live technical assessment for {selectedCandidate.name} to generate real-time evaluation analytics, topic performance graphs, and hiring decision verdicts.
        </p>
        <button
          onClick={() => navigateTo('interview-config')}
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold shadow-[0_0_20px_rgba(59,130,246,0.4)]"
        >
          Launch Session for {selectedCandidate.name}
        </button>
      </div>
    );
  }

  // Recommendation Badge Color Helper
  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'STRONG HIRE':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
      case 'HIRE':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]';
      case 'CONSIDER':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'HOLD':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-red-500/20 text-red-300 border-red-500/40';
    }
  };

  return (
    <div className="w-full space-y-8 font-sans">
      {/* 1. ENTERPRISE SELECTOR BAR (Candidate & Multi-Session Switcher) */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-[#050507]/90 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <IntervixLogo variant="compact" iconSize={28} />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center space-x-2">
                <span>Enterprise Candidate Analytics Dashboard</span>
                <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  LIVE INTERVIEW TELEMETRY
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Evaluation results for <span className="text-white font-bold">{currentResult.candidateName}</span> ({currentResult.candidateRole})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 font-mono">Session ID:</span>
            <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-amber-200">
              {currentResult.sessionId}
            </span>
          </div>
        </div>

        {/* Candidate Selector Buttons */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Select Candidate:</div>
          <div className="flex flex-wrap items-center gap-2">
            {allCandidates.map(cand => {
              const isSelected = cand.id === selectedCandidate.id;
              const candLatestRes = InterviewResultStore.getLatestResultForCandidate(cand.id);
              return (
                <button
                  key={cand.id}
                  onClick={() => handleCandidateSwitch(cand.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-mono transition-all flex items-center space-x-2 border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.4)] font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                  }`}
                >
                  <span>{cand.name}</span>
                  {candLatestRes && (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${getBadgeStyle(candLatestRes.recommendationBadge)}`}>
                      {candLatestRes.recommendationBadge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-Session Run Selector if candidate has multiple interviews */}
        {candidateResults.length > 1 && (
          <div className="pt-2 border-t border-white/10 flex items-center space-x-3 text-xs font-mono">
            <span className="text-gray-400">Previous Interview Runs:</span>
            <div className="flex items-center space-x-2 overflow-x-auto py-1">
              {candidateResults.map((run, idx) => (
                <button
                  key={run.sessionId}
                  onClick={() => setSelectedSessionId(run.sessionId)}
                  className={`px-3 py-1 rounded-xl text-[11px] transition-all border ${
                    run.sessionId === currentResult.sessionId
                      ? 'bg-amber-500/20 text-amber-200 border-amber-500/40 font-bold'
                      : 'bg-white/5 text-gray-400 hover:text-white border-white/10'
                  }`}
                >
                  Interview #{candidateResults.length - idx} ({run.durationFormatted}) — {run.overallScore}/100
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. TOP EXECUTIVE METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Overall Assessment Score */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-1 bg-[#050507]/80">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>Overall Score</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-300">
            {currentResult.overallScore} <span className="text-xs text-gray-500 font-normal">/ 100</span>
          </div>
          <p className="text-[10px] text-amber-400/90 font-mono">Dynamic Multi-Factor Evaluation</p>
        </div>

        {/* Hiring Verdict */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-1 bg-[#050507]/80">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>Hiring Decision</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-black font-mono">
            <span className={`px-2.5 py-1 rounded-xl border text-xs font-bold ${getBadgeStyle(currentResult.recommendationBadge)}`}>
              {currentResult.recommendationBadge}
            </span>
          </div>
          <p className="text-[10px] text-emerald-300 font-mono">AI Committee Decision</p>
        </div>

        {/* Questions Breakdown */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-1 bg-[#050507]/80">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>Questions & Skipped</span>
            <HelpCircle className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {currentResult.statistics.questionsAnswered} <span className="text-xs text-blue-400 font-bold">Answered</span>
          </div>
          <p className="text-[10px] text-gray-400 font-mono">{currentResult.statistics.questionsSkipped} Skipped by Interviewer</p>
        </div>

        {/* Session Duration */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-1 bg-[#050507]/80">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>Session Duration</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-300">
            {currentResult.durationFormatted}
          </div>
          <p className="text-[10px] text-purple-400 font-mono">Exact Session Telemetry</p>
        </div>
      </div>

      {/* 3. EXECUTIVE SUMMARY & HIRING VERDICT */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-amber-500/20 bg-[#050507]/90 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              AI Evaluator Verdict & Executive Rationale
            </h3>
          </div>
          <span className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-300 font-bold">
            {currentResult.thinkingProfile}
          </span>
        </div>

        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
          "{currentResult.executiveSummary}"
        </p>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-mono font-bold text-emerald-300 uppercase">Hiring Committee Rationale:</span>
            <p className="text-gray-300 font-sans">{currentResult.recommendationReason}</p>
          </div>
        </div>
      </div>

      {/* 4. TOPIC PERFORMANCE GRAPH (DYNAMIC HORIZONTAL PROGRESS BARS) */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 bg-[#050507]/90 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2.5">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Interview Topic Performance Graph (Discussed Topics)
            </h3>
          </div>
          <span className="text-xs font-mono text-gray-400">
            Calculated Knowledge Scores (0-100%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentResult.topicPerformance.map((topic, idx) => (
            <div key={idx} className="space-y-2 p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-white">{topic.topic}</span>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    topic.level === 'Mastered' ? 'bg-emerald-500/20 text-emerald-300' :
                    topic.level === 'Proficient' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {topic.level}
                  </span>
                  <span className="text-amber-300 font-black">{topic.score}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/10 p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.score}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className={`h-full rounded-full ${
                    topic.score >= 88
                      ? 'bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-300'
                      : topic.score >= 75
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                      : 'bg-gradient-to-r from-amber-500 to-amber-300'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. QUESTION ANALYSIS & BREAKDOWN TABLE */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 bg-[#050507]/90 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2.5">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Detailed Question Breakdown & Correctness Matrix
            </h3>
          </div>
          <span className="text-xs font-mono text-gray-400">
            {currentResult.questionBreakdown.length} Questions Evaluated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Question Title</th>
                <th className="py-3 px-4">Topic</th>
                <th className="py-3 px-4">Rigor</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Correctness</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentResult.questionBreakdown.map((q, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-amber-300">Q{q.questionNumber}</td>
                  <td className="py-3.5 px-4 text-white font-sans font-medium">{q.title}</td>
                  <td className="py-3.5 px-4 text-blue-300">{q.topic}</td>
                  <td className="py-3.5 px-4 text-gray-300">{q.difficulty}</td>
                  <td className="py-3.5 px-4 text-purple-300">{q.confidence}%</td>
                  <td className="py-3.5 px-4 text-emerald-300 font-bold">{q.correctness}%</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase ${
                      q.status === 'PASSED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. AUTOMATED STRENGTHS & WEAKNESSES DETECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 bg-[#050507]/90 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Automated Strength Detection
            </h3>
          </div>
          <div className="space-y-2 font-sans text-xs">
            {currentResult.strengths.map((str, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-[#050507]/90 space-y-4">
          <div className="flex items-center space-x-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Automated Weakness Detection
            </h3>
          </div>
          <div className="space-y-2 font-sans text-xs">
            {currentResult.weaknesses.map((wk, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 flex items-start space-x-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{wk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. CHRONOLOGICAL INTERVIEW TIMELINE */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 bg-[#050507]/90 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2.5">
            <GitCommit className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Chronological Interview Session Event Timeline
            </h3>
          </div>
          <span className="text-xs font-mono text-gray-400">Real-Time Event Stream</span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {currentResult.interviewTimeline.map((ev, idx) => (
            <div key={idx} className="flex items-start space-x-4 p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-blue-400 font-bold shrink-0">{ev.timestamp}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                ev.type === 'QUESTION_ASKED' ? 'bg-blue-500/20 text-blue-300' :
                ev.type === 'CANDIDATE_ANSWER' ? 'bg-purple-500/20 text-purple-300' :
                ev.type === 'AI_EVALUATION' ? 'bg-emerald-500/20 text-emerald-300' :
                ev.type === 'SKIPPED' ? 'bg-amber-500/20 text-amber-300' :
                'bg-cyan-500/20 text-cyan-300'
              }`}>
                {ev.type}
              </span>
              <span className="text-gray-300 font-sans text-xs">{ev.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
