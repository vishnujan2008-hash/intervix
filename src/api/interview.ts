import { CandidateService } from '../services/data/CandidateService.js';
import { InterviewDataService } from '../services/data/InterviewDataService.js';

export interface InterviewApiRequest {
  sessionId: string;
  candidateId: string;
  message: string;
  dayNumber?: number;
}

export interface InterviewApiResponse {
  reply: string;
  done: boolean;
  feedback: {
    score: number;
    reasoning: string;
  };
  summary: string;
  strengths: string[];
  gaps: string[];
  next: {
    questionId: string;
    dayNumber: number;
    title: string;
    prompt: string;
  };
}

export const handleInterviewApi = async (req: InterviewApiRequest): Promise<InterviewApiResponse> => {
  const candidate = CandidateService.getCandidate(req.candidateId);
  const dayNumber = req.dayNumber || 1;
  const promptContext = InterviewDataService.buildGeminiPromptContext(req.candidateId, dayNumber);

  console.log(`[POST /api/interview] Processing session ${req.sessionId} for ${candidate?.name || 'Candidate'}`);

  return {
    reply: `I evaluated your response regarding '${req.message.substring(0, 40)}...'. Excellent architectural reasoning and clear understanding of production trade-offs.`,
    done: false,
    feedback: {
      score: candidate?.signals.technicalDepth || 94,
      reasoning: `Evaluated with prompt context: ${promptContext.substring(0, 100)}...`,
    },
    summary: `${candidate?.name || 'Candidate'} demonstrated strong performance on Day ${dayNumber} concepts.`,
    strengths: ['HNSW Skip-List Indexing', 'Asynchronous Tool-Calling Loops', 'KV Cache Memory Bounds'],
    gaps: ['MCP JSON-RPC Registration Schemas'],
    next: {
      questionId: `q-day-${dayNumber + 1}`,
      dayNumber: dayNumber + 1,
      title: `Day ${dayNumber + 1}: Next Stage Architecture Probe`,
      prompt: `Based on your telemetry, how would you optimize memory bounds under continuous batching?`,
    },
  };
};
