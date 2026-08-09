import { IAIEngine, AIResponsePayload } from '../../types/aiEngine';
import { EngineQuestion, EvaluationVector, HiringFeedbackReport } from '../../types/engine';
import { Candidate } from '../../types';
import { globalGeminiService } from '../../services/ai/GeminiService';
import { globalMockAIEngine } from '../MockAIEngine';

export class GeminiAIEngine implements IAIEngine {
  public name = 'GeminiAIEngine (Official Google Gemini 3.6 / Flash Engine)';

  public async processAnswer(
    candidate: Candidate,
    currentQuestion: EngineQuestion,
    candidateAnswer: string,
    askedQuestionIds: string[]
  ): Promise<AIResponsePayload> {
    try {
      console.log(`[GeminiAIEngine] Requesting AI answer evaluation from Google Gemini API...`);
      return await globalGeminiService.evaluateAnswer(candidate, currentQuestion, candidateAnswer, askedQuestionIds);
    } catch (err: any) {
      console.warn(`[GeminiAIEngine] Gemini API call failed or timed out (${err.message}). Seamlessly executing via MockAIEngine fallback.`);
      return await globalMockAIEngine.processAnswer(candidate, currentQuestion, candidateAnswer, askedQuestionIds);
    }
  }

  public async generateReport(
    candidate: Candidate,
    evaluation: EvaluationVector,
    askedQuestionsCount: number
  ): Promise<HiringFeedbackReport> {
    try {
      console.log(`[GeminiAIEngine] Requesting executive report from Google Gemini API...`);
      return await globalGeminiService.generateReport(candidate, evaluation, askedQuestionsCount);
    } catch (err: any) {
      console.warn(`[GeminiAIEngine] Gemini Report API call failed (${err.message}). Seamlessly executing via MockAIEngine fallback.`);
      return await globalMockAIEngine.generateReport(candidate, evaluation, askedQuestionsCount);
    }
  }
}

export const globalGeminiAIEngine = new GeminiAIEngine();
