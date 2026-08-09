import { Candidate, CurriculumTopic, Question, TranscriptMessage, LiveScores, InterviewMetrics } from '../types';
import { CandidateService } from '../services/data/CandidateService';
import { CurriculumService } from '../services/data/CurriculumService';
import { QUESTIONS_100 } from './questionsData';

// Dynamic candidates directly from candidates.json
export const getDynamicCandidates = () => CandidateService.getAllCandidates() as any;
export const MOCK_CANDIDATES: Candidate[] = CandidateService.getAllCandidates() as any;
export const MOCK_QUESTIONS: Question[] = QUESTIONS_100;

// Dynamic 31-day 8-module curriculum derived from curriculum.json
export const INITIAL_CURRICULUM: CurriculumTopic[] = CurriculumService.getAllDays().map((d, i) => ({
  id: `curr-${d.dayNumber}`,
  day: d.dayNumber,
  title: d.title,
  description: `${d.objectives.join('; ')} (Tools: ${d.tools.join(', ')})`,
  status: i === 0 ? 'current' : i < 15 ? 'completed' : 'pending',
  estimatedMinutes: 30,
}));

export const INITIAL_TRANSCRIPT: TranscriptMessage[] = [
  {
    id: 't-1',
    sender: 'ai',
    text: "Welcome to Intervix. I am your Lead AI System Assessor. Today we'll evaluate your mastery over Vector Databases, RAG Indexing, and High-Throughput Model Architectures. Shall we begin with Question 1?",
    timestamp: '10:14:02 AM',
    audioDuration: '00:12'
  },
  {
    id: 't-2',
    sender: 'candidate',
    text: "Thanks! Yes, I'm ready. HNSW graph indexing is particularly fascinating because it structures high-dimensional embeddings into hierarchical layers, allowing logarithmic search time while keeping recall near 95%+",
    timestamp: '10:14:38 AM',
    audioDuration: '00:24',
    metrics: { confidence: 96, clarity: 94 }
  },
  {
    id: 't-3',
    sender: 'ai',
    text: "Impressive observation on the hierarchical graph layers. How do you handle graph reconstruct overhead when vectors are continuously inserted in a live streaming database?",
    timestamp: '10:15:10 AM',
    audioDuration: '00:15'
  }
];

export const INITIAL_SCORES: LiveScores = {
  communication: 94,
  technicalAccuracy: 96,
  reasoning: 95,
  problemSolving: 93,
  architectureThinking: 97,
  confidence: 92,
  overallScore: 95,
};

export const INITIAL_METRICS: InterviewMetrics = {
  questionsAsked: 1,
  questionsRemaining: 30,
  timeElapsedSeconds: 872,
  adaptiveDifficulty: 'Hardcore Tier +',
  candidateEnergy: 'High',
  candidateConfidence: 94,
  sessionHealth: 'Optimal (99.8%)',
};
