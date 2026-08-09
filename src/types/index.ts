export type ScreenRoute = 
  | 'splash'
  | 'welcome'
  | 'dashboard'
  | 'candidate-selection'
  | 'interview-config'
  | 'interview-session'
  | 'interview-summary'
  | 'history'
  | 'analytics'
  | 'settings'
  | '404';

export type AIStatus = 'idle' | 'listening' | 'thinking' | 'speaking' | 'paused';
export type InterviewMode = 'voice' | 'text';
export type CurriculumStatus = 'pending' | 'current' | 'completed';

export interface CurriculumTopic {
  id: string;
  day: number;
  title: string;
  description: string;
  status: CurriculumStatus;
  estimatedMinutes: number;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  avatar: string;
  email: string;
  targetDifficulty: 'Standard' | 'Adaptive High' | 'Hardcore';
  score?: number;
  status: 'Ready' | 'In Progress' | 'Completed';
  lastInterviewDate?: string;
  techStack?: string[];
  missionsCompleted?: number;
  signals?: any;
}

export interface Question {
  id: string;
  number: number;
  totalQuestions: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Adaptive';
  curriculumDay: number;
  estimatedTime: string;
  content: string;
  codeSnippet?: string;
  hints: string[];
  explanation?: string;
}

export interface TranscriptMessage {
  id: string;
  sender: 'ai' | 'candidate';
  text: string;
  timestamp: string;
  audioDuration?: string;
  messageType?: 'question' | 'answer' | 'followup' | 'system' | 'evaluation';
  metrics?: {
    confidence: number;
    clarity: number;
  };
  codeSnippet?: string;
}

export interface LiveScores {
  communication: number;
  technicalAccuracy: number;
  reasoning: number;
  problemSolving: number;
  architectureThinking: number;
  confidence: number;
  overallScore: number;
}

export interface InterviewMetrics {
  questionsAsked: number;
  questionsRemaining: number;
  timeElapsedSeconds: number;
  adaptiveDifficulty: string;
  candidateEnergy: 'High' | 'Optimal' | 'Tired';
  candidateConfidence: number;
  sessionHealth: 'Optimal (99.8%)' | 'Good' | 'Degraded';
}
