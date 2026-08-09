export type DayType = 'Core' | 'Applied' | 'Advanced' | 'Capstone' | 'System Design';

export interface CurriculumDay {
  dayNumber: number;
  title: string;
  objectives: string[];
  tools: string[];
  type: DayType;
  moduleNumber: number;
}

export interface CurriculumModule {
  moduleNumber: number;
  title: string;
  days: CurriculumDay[];
}

export interface MissionProgress {
  missionId: string;
  dayNumber: number;
  passed: boolean;
  skipped: boolean;
  attempts: number;
  firstTry: boolean;
  commitDays: number;
}

export interface CandidateSignal {
  completionRate: number;
  firstTryRate: number;
  avgAttempts: number;
  avgCommitDays: number;
  technicalDepth: number;
  reasoningScore: number;
  communicationScore: number;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  education: string;
  avatar: string;
  email: string;
  status: 'Ready' | 'In Progress' | 'Completed';
  targetDifficulty: 'Standard' | 'Adaptive High' | 'Hardcore';
  missions: MissionProgress[];
  signals: CandidateSignal;
  techStack?: string[];
  score?: number;
  lastInterviewDate?: string;
}
