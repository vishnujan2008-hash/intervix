export type InterviewStage = 
  | 'idle'
  | 'initializing'
  | 'greeting'
  | 'question'
  | 'listening'
  | 'transcribing'
  | 'evaluating'
  | 'thinking'
  | 'follow-up'
  | 'next-question'
  | 'interview-complete'
  | 'feedback'
  | 'export-report';

export type AdaptiveDifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export type QuestionCategory = 
  | 'primary'
  | 'follow-up'
  | 'recovery'
  | 'challenge'
  | 'scenario'
  | 'system-design'
  | 'behavioral';

export interface EvaluationVector {
  technicalAccuracy: number;
  conceptualUnderstanding: number;
  reasoning: number;
  communication: number;
  problemSolving: number;
  architectureThinking: number;
  confidence: number;
  productionReadiness: number;
  overallScore: number;
  feedbackSummary: string;
}

export interface CandidateMemory {
  candidateId: string;
  askedQuestionIds: string[];
  answersHistory: { questionId: string; answerText: string; score: number }[];
  weakTopics: string[];
  strongTopics: string[];
  repeatedMistakes: string[];
  confidenceTrend: number[];
  difficultyTrend: AdaptiveDifficultyLevel[];
}

export interface EngineQuestion {
  id: string;
  category: QuestionCategory;
  title: string;
  difficulty: AdaptiveDifficultyLevel;
  curriculumDay: number;
  estimatedTimeMinutes: number;
  skillsTested: string[];
  content: string;
  codeSnippet?: string;
  hints: string[];
  explanation: string;
}

export interface HiringFeedbackReport {
  sessionId: string;
  candidateId: string;
  candidateName: string;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  knowledgeGaps: string[];
  recommendedRevision: string[];
  hiringRecommendation: 'Strong Hire' | 'Hire' | 'Weak Hire' | 'No Hire';
  learningRoadmap: { week: number; topic: string; objective: string }[];
  executiveSummary: string;
  completedAt: string;
}

export interface SessionData {
  sessionId: string;
  candidateId: string;
  candidateName: string;
  persona: string;
  questionIndex: number;
  currentDifficulty: AdaptiveDifficultyLevel;
  durationSeconds: number;
  currentTopic: string;
  previousTopics: string[];
  askedQuestions: EngineQuestion[];
  skippedQuestions: EngineQuestion[];
  evaluationScores: EvaluationVector;
  isCompleted: boolean;
}
