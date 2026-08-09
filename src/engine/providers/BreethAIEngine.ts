import { IAIEngine, AIResponsePayload } from '../../types/aiEngine';
import { EngineQuestion, EvaluationVector, HiringFeedbackReport } from '../../types/engine';
import { Candidate } from '../../types';
import { globalBreethService } from '../../services/ai/BreethService';
import { globalMockAIEngine } from '../MockAIEngine';

export class BreethAIEngine implements IAIEngine {
  public name = 'BreethAIEngine (Official Breeth AI Engine)';

  public async processAnswer(
    candidate: Candidate,
    currentQuestion: EngineQuestion,
    candidateAnswer: string,
    askedQuestionIds: string[]
  ): Promise<AIResponsePayload> {
    try {
      console.log(`[BreethAIEngine] Requesting answer evaluation from Breeth AI API...`);
      return await globalBreethService.evaluateAnswer(candidate, currentQuestion, candidateAnswer, askedQuestionIds);
    } catch (err: any) {
      console.warn(`[BreethAIEngine] Breeth AI API call failed or timed out: ${err.message}. Seamlessly falling back to MockAIEngine.`);
      return await globalMockAIEngine.processAnswer(candidate, currentQuestion, candidateAnswer, askedQuestionIds);
    }
  }

  public async generateReport(
    candidate: Candidate,
    evaluation: EvaluationVector,
    askedQuestionsCount: number
  ): Promise<HiringFeedbackReport> {
    try {
      console.log(`[BreethAIEngine] Requesting executive report from Breeth AI API...`);
      return await globalBreethService.generateHiringReport(candidate, evaluation, askedQuestionsCount);
    } catch (err: any) {
      console.warn(`[BreethAIEngine] Breeth Report API call failed: ${err.message}. Seamlessly falling back to MockAIEngine.`);
      return await globalMockAIEngine.generateReport(candidate, evaluation, askedQuestionsCount);
    }
  }
}

export const globalBreethAIEngine = new BreethAIEngine();
