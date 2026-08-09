import React, { createContext, useContext, useState, useEffect } from 'react';
import { globalInterviewEngine, InterviewEngine } from '../engine/InterviewEngine';
import { InterviewStage, HiringFeedbackReport, EngineQuestion, EvaluationVector } from '../types/engine';
import { Candidate } from '../types';
import { globalComprehensiveReportEngine } from '../engine/ComprehensiveReportEngine';
import { CandidateService } from '../services/data/CandidateService';

interface EngineContextType {
  engine: InterviewEngine;
  currentStage: InterviewStage;
  activeReport: HiringFeedbackReport | null;
  startSession: (candidate: Candidate) => void;
  submitAnswer: (question: EngineQuestion, answerText: string) => EvaluationVector;
  compileReport: (candidate: Candidate) => HiringFeedbackReport;
  exportReportJSON: (report: HiringFeedbackReport, candidate: Candidate) => string;
  exportReportMarkdown: (report: HiringFeedbackReport, candidate: Candidate) => string;
}

const EngineContext = createContext<EngineContextType | undefined>(undefined);

export const EngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStage, setCurrentStage] = useState<InterviewStage>(globalInterviewEngine.stateMachine.getStage());
  const [activeReport, setActiveReport] = useState<HiringFeedbackReport | null>(null);

  useEffect(() => {
    const unsub = globalInterviewEngine.stateMachine.subscribe((stage) => {
      setCurrentStage(stage);
    });
    return () => unsub();
  }, []);

  const startSession = (candidate: Candidate) => {
    globalInterviewEngine.initializeSession(candidate);
  };

  const submitAnswer = (question: EngineQuestion, answerText: string) => {
    return globalInterviewEngine.submitCandidateAnswer(question, answerText);
  };

  const compileReport = (candidate: Candidate) => {
    const report = globalInterviewEngine.generateReport(candidate);
    setActiveReport(report);
    return report;
  };

  const exportReportJSON = (report: HiringFeedbackReport, candidate: Candidate) => {
    const res = globalComprehensiveReportEngine.buildInterviewResult(CandidateService.normalizeCandidate(candidate), [], { questionsAsked: 4, questionsRemaining: 0, timeElapsedSeconds: 500, adaptiveDifficulty: 'Hardcore', candidateEnergy: 'Optimal', candidateConfidence: 94, sessionHealth: 'Optimal (99.8%)' }, Date.now() - 500000, Date.now());
    return globalInterviewEngine.reportEngine.exportJSON(res);
  };

  const exportReportMarkdown = (report: HiringFeedbackReport, candidate: Candidate) => {
    const res = globalComprehensiveReportEngine.buildInterviewResult(CandidateService.normalizeCandidate(candidate), [], { questionsAsked: 4, questionsRemaining: 0, timeElapsedSeconds: 500, adaptiveDifficulty: 'Hardcore', candidateEnergy: 'Optimal', candidateConfidence: 94, sessionHealth: 'Optimal (99.8%)' }, Date.now() - 500000, Date.now());
    return globalInterviewEngine.reportEngine.exportMarkdown(res);
  };

  return (
    <EngineContext.Provider
      value={{
        engine: globalInterviewEngine,
        currentStage,
        activeReport,
        startSession,
        submitAnswer,
        compileReport,
        exportReportJSON,
        exportReportMarkdown,
      }}
    >
      {children}
    </EngineContext.Provider>
  );
};

export const useEngine = () => {
  const context = useContext(EngineContext);
  if (!context) {
    throw new Error('useEngine must be used within an EngineProvider');
  }
  return context;
};
