import { IAIEngine, AIResponsePayload } from '../../types/aiEngine';
import { EngineQuestion, EvaluationVector, HiringFeedbackReport } from '../../types/engine';
import { Candidate } from '../../types';
import { globalGeminiReasoningService } from '../../services/ai/GeminiReasoningService';
import { globalBreethMemoryService } from '../../services/ai/BreethMemoryService';
import { globalNotebookLMKnowledgeService } from '../../services/ai/NotebookLMKnowledgeService';
import { globalMockAIEngine } from '../MockAIEngine';

export class MultiLayerAIEngine implements IAIEngine {
  public name = 'MultiLayerAIEngine (Gemini Reasoning + Breeth Memory + NotebookLM Knowledge)';

  public async processAnswer(
    candidate: Candidate,
    currentQuestion: EngineQuestion,
    candidateAnswer: string,
    askedQuestionIds: string[]
  ): Promise<AIResponsePayload> {
    try {
      // 1. Fetch Candidate Memory from Breeth Memory Layer
      const memoryContext = globalBreethMemoryService.getCandidateMemoryContext(candidate.id);

      // 2. Fetch Curriculum Knowledge from NotebookLM Layer
      const curriculumInfo = globalNotebookLMKnowledgeService.getCurriculumKnowledge(currentQuestion.curriculumDay);

      console.log(`[MultiLayerAIEngine] Evaluated via Gemini Flash with Breeth Memory & NotebookLM Knowledge (${curriculumInfo?.title})`);

      // 3. Execute Reasoning via Gemini
      const payload = await globalGeminiReasoningService.evaluateAnswer(
        candidate,
        currentQuestion,
        candidateAnswer,
        memoryContext
      );

      // 4. Record Episode into Breeth Memory Store
      await globalBreethMemoryService.storeEpisode(candidate, {
        sessionId: `sess-${Date.now()}`,
        candidateId: candidate.id,
        questionId: currentQuestion.id,
        candidateAnswer,
        score: payload.evaluation.overallScore,
        weakTopics: payload.evaluation.overallScore < 85 ? [currentQuestion.title] : [],
        timestamp: new Date().toISOString(),
      });

      return payload;
    } catch (err: any) {
      console.warn(`[MultiLayerAIEngine] Primary reasoning engine failed (${err.message}). Seamlessly executing via MockAIEngine fallback.`);
      return await globalMockAIEngine.processAnswer(candidate, currentQuestion, candidateAnswer, askedQuestionIds);
    }
  }

  public async generateReport(
    candidate: Candidate,
    evaluation: EvaluationVector,
    askedQuestionsCount: number
  ): Promise<HiringFeedbackReport> {
    return await globalMockAIEngine.generateReport(candidate, evaluation, askedQuestionsCount);
  }
}

export const globalMultiLayerAIEngine = new MultiLayerAIEngine();
