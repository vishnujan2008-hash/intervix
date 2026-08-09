import React from 'react';
import { motion } from 'framer-motion';
import { useInterview } from '../context/InterviewContext';
import { globalComprehensiveReportEngine } from '../engine/ComprehensiveReportEngine';
import { CandidateService } from '../services/data/CandidateService';
import { 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  FileText, 
  Code, 
  Target, 
  AlertTriangle,
  Brain,
  Layers,
  Sparkles,
  ListChecks,
  Quote,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { globalReportEngine } from '../engine/ReportEngine';

export const InterviewSummaryScreen: React.FC = () => {
  const { 
    selectedCandidate, 
    transcript, 
    metrics, 
    interviewStartTimestamp, 
    interviewEndTimestamp, 
    navigateTo 
  } = useInterview();

  // RULE 12: Receive ONE InterviewResult object & compute everything from it
  const result = globalComprehensiveReportEngine.buildInterviewResult(
    CandidateService.normalizeCandidate(selectedCandidate),
    transcript,
    metrics,
    interviewStartTimestamp,
    interviewEndTimestamp
  );

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportMarkdown = () => {
    const md = globalReportEngine.exportMarkdown(result);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Recruiter_Copilot_Report_${selectedCandidate.id}.md`;
    a.click();
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Recruiter_Copilot_Report_${selectedCandidate.id}.json`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AUTONOMOUS RECRUITER ASSESSMENT REPORT</span>
        </div>
        <h1 className="text-3xl md:text-6xl font-extrabold text-white tracking-tight font-sans">
          Candidate Analysis Brief
        </h1>
        <p className="text-sm text-gray-400 font-light max-w-2xl mx-auto">
          Senior Engineering Staff Assessment Report for <span className="text-white font-semibold">{result.candidateName}</span> ({result.candidateRole})
        </p>
      </div>

      {/* Main Glass Report Container */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl space-y-12 bg-[#050507]/95"
      >
        {/* Candidate Profile Bar & Export Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-8 gap-6">
          <div className="flex items-center space-x-5">
            <img
              src={selectedCandidate.avatar}
              alt={selectedCandidate.name}
              className="w-20 h-20 rounded-3xl object-cover border-2 border-white/20 shadow-2xl"
            />
            <div>
              <h2 className="text-2xl font-extrabold text-white">{selectedCandidate.name}</h2>
              <p className="text-sm text-gray-400">{selectedCandidate.role} • {selectedCandidate.experienceYears} Years Exp.</p>
              <div className="mt-1 flex items-center space-x-2 text-xs font-mono text-blue-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Session Duration: {result.durationFormatted}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportPDF}
              className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center space-x-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF Brief</span>
            </button>
            <button
              onClick={handleExportMarkdown}
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white flex items-center space-x-1.5 transition-all"
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Markdown</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white flex items-center space-x-1.5 transition-all"
            >
              <Code className="w-4 h-4 text-cyan-400" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* SECTION 1 — Executive Summary */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5 text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
            <Sparkles className="w-4 h-4" />
            <span>SECTION 1 — Executive Summary</span>
          </div>
          <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 text-sm md:text-base text-gray-200 leading-relaxed font-normal">
            {result.executiveSummary}
          </div>
        </div>

        {/* SECTION 2 — Hiring Recommendation */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>SECTION 2 — Hiring Recommendation ({result.overallScore} / 100)</span>
          </div>
          <div className="p-6 md:p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
            <div className="text-3xl md:text-4xl font-extrabold text-emerald-300 tracking-tight uppercase font-sans">
              {result.recommendationBadge}
            </div>
            <p className="text-xs md:text-sm text-emerald-200/90 leading-relaxed font-mono">
              <span className="font-bold">Reasoning:</span> {result.recommendationReason}
            </p>
          </div>
        </div>

        {/* SECTION 3 & 4 — Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* SECTION 3: Strengths */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>SECTION 3 — Candidate Strengths</span>
            </div>
            <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
              <ul className="space-y-3 text-xs md:text-sm text-emerald-100 font-mono">
                {result.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SECTION 4: Weaknesses */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>SECTION 4 — Areas for Improvement (Needs Improvement)</span>
            </div>
            <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 space-y-3">
              <ul className="space-y-3 text-xs md:text-sm text-amber-100 font-mono">
                {result.weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* SECTION 5 — Question Timeline */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5 text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
            <Layers className="w-4 h-4" />
            <span>SECTION 5 — Question Timeline & Reasoning Log</span>
          </div>
          <div className="space-y-4">
            {result.questionTimeline.map((item, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-gray-300 font-bold">
                  <span>Question {item.questionNumber}: {item.questionTitle}</span>
                  <span className="text-emerald-400 font-mono font-bold">{item.result}</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-gray-300">
                  <span className="text-blue-400 font-bold">Candidate Answer:</span> "{item.candidateAnswerText}"
                </div>
                <div className="text-emerald-300 text-[11px]">
                  <span className="font-bold text-emerald-400">Gemini Evaluation:</span> {item.geminiEvaluation}
                </div>
                {item.followUpQuestion && (
                  <div className="text-purple-300 text-[11px] pt-1 border-t border-white/5">
                    <span className="font-bold text-purple-400">Adaptive Follow-up:</span> {item.followUpQuestion}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6 — Skill Radar (Qualitative Chips) */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            <Target className="w-4 h-4" />
            <span>SECTION 6 — Qualitative Skill Evaluation</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {result.skillRadar.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-center">
                <span className="text-xs font-semibold text-gray-300 block">{item.skill}</span>
                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase inline-block ${
                  item.rating === 'Excellent'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : item.rating === 'Strong'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : item.rating === 'Good'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {item.rating}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 7 — Evidence Based Quotes */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5 text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
            <Quote className="w-4 h-4" />
            <span>SECTION 7 — Evidence-Based Statements & Quotes</span>
          </div>
          <div className="space-y-3">
            {result.evidenceQuotes.map((quote, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/15 text-xs font-mono text-blue-200 italic">
                {quote}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 8 & 9 — Missed Opportunities & Improvement Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* SECTION 8: Missed Opportunities */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>SECTION 8 — Missed Opportunities</span>
            </div>
            <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 space-y-3">
              <span className="text-xs text-amber-300 font-mono font-bold block">Candidate did not mention:</span>
              <ul className="space-y-2.5 text-xs md:text-sm text-amber-100 font-mono">
                {result.missedOpportunities.map((m, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SECTION 9: Improvement Plan */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5 text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
              <ListChecks className="w-4 h-4" />
              <span>SECTION 9 — Next Learning Focus (Roadmap)</span>
            </div>
            <div className="p-6 rounded-3xl bg-purple-500/5 border border-purple-500/20 space-y-3">
              <ol className="space-y-2.5 text-xs md:text-sm text-purple-100 font-mono">
                {result.improvementPlan.map((p, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <span className="text-purple-400 font-bold">{idx + 1}.</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* SECTION 10 — Interview Analytics */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            <Clock className="w-4 h-4" />
            <span>SECTION 10 — Interview Analytics</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-gray-400 block text-[11px]">Questions Asked</span>
              <span className="text-xl font-bold text-white">{result.statistics.questionsAsked}</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-gray-400 block text-[11px]">Questions Answered</span>
              <span className="text-xl font-bold text-emerald-400">{result.statistics.questionsAnswered}</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-gray-400 block text-[11px]">Avg Response Length</span>
              <span className="text-xl font-bold text-purple-300">{result.statistics.avgAnswerLengthChars} chars</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-gray-400 block text-[11px]">Adaptive Rigor</span>
              <span className="text-xl font-bold text-cyan-300">{result.statistics.adaptiveDifficultyReached}</span>
            </div>
          </div>
        </div>

        {/* SECTION 11 — AI Confidence */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Brain className="w-4 h-4" />
            <span>SECTION 11 — AI Assessor Confidence</span>
          </div>
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <div className="text-xl font-extrabold text-emerald-300 font-mono">
              {result.aiConfidence} Confidence
            </div>
            <p className="text-xs text-emerald-200 leading-relaxed font-sans">
              <span className="font-bold">Reasoning:</span> "{result.aiConfidenceReason}"
            </p>
          </div>
        </div>

        {/* SECTION 12 — Final Verdict */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5 text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
            <ShieldCheck className="w-4 h-4" />
            <span>SECTION 12 — Final Hiring Committee Verdict</span>
          </div>
          <div className="p-8 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-sm md:text-base text-gray-200 leading-relaxed font-normal italic">
            "{result.finalVerdict}"
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
          <button
            onClick={() => navigateTo('dashboard')}
            className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-400 hover:text-white flex items-center space-x-2 font-mono transition-colors"
          >
            <span>Return to Dashboard</span>
          </button>

          <button
            onClick={() => navigateTo('candidate-selection')}
            className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs border border-blue-400/30 shadow-[0_0_25px_rgba(59,130,246,0.4)] flex items-center space-x-2 group transition-all"
          >
            <span>Evaluate Next Candidate</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
