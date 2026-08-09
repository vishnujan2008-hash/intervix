import { EngineQuestion, EvaluationVector, HiringFeedbackReport, AdaptiveDifficultyLevel } from './engine';
import { Candidate } from './index';

export interface AIResponsePayload {
  evaluation: EvaluationVector;
  reasoningText: string;
  aiResponseText: string;
  nextQuestion: EngineQuestion;
  newDifficulty: AdaptiveDifficultyLevel;
  updatedConfidence: number;
}

export interface IAIEngine {
  name: string;
  processAnswer(
    candidate: Candidate,
    currentQuestion: EngineQuestion,
    candidateAnswer: string,
    askedQuestionIds: string[]
  ): Promise<AIResponsePayload>;

  generateReport(
    candidate: Candidate,
    evaluation: EvaluationVector,
    askedQuestionsCount: number
  ): Promise<HiringFeedbackReport>;
}
