import { IAIEngine, AIResponsePayload } from '../types/aiEngine';
import { EngineQuestion, EvaluationVector, HiringFeedbackReport, AdaptiveDifficultyLevel } from '../types/engine';
import { Candidate } from '../types';
import { EvaluationEngine } from './EvaluationEngine';
import { DifficultyEngine } from './DifficultyEngine';
import { QuestionEngine } from './QuestionEngine';
import { ConversationEngine } from './ConversationEngine';
import { FeedbackEngine } from './FeedbackEngine';

export class MockAIEngine implements IAIEngine {
  public name = 'MockAIEngine (Breeth Pipeline Compatible)';

  private evaluationEngine = new EvaluationEngine();
  private difficultyEngine = new DifficultyEngine('hard');
  private questionEngine = new QuestionEngine();
  private conversationEngine = new ConversationEngine();
  private feedbackEngine = new FeedbackEngine();

  public async processAnswer(
    candidate: Candidate,
    currentQuestion: EngineQuestion,
    candidateAnswer: string,
    askedQuestionIds: string[]
  ): Promise<AIResponsePayload> {
    // Simulate 1400ms realistic LLM inference latency
    await new Promise(resolve => setTimeout(resolve, 1400));

    // 1. Score response via EvaluationEngine
    const evaluation: EvaluationVector = this.evaluationEngine.evaluateResponse(currentQuestion, candidateAnswer);

    // 2. Scale adaptive difficulty via DifficultyEngine
    const newDifficulty: AdaptiveDifficultyLevel = this.difficultyEngine.evaluateNextDifficulty(evaluation.overallScore);

    // 3. Generate follow-up dialog via ConversationEngine
    const aiResponseText = this.conversationEngine.generateFollowUp(currentQuestion.title, candidateAnswer);

    // 4. Select next question from 100-question database
    const nextQuestion = this.questionEngine.getNextQuestion(
      currentQuestion.curriculumDay < 10 ? currentQuestion.curriculumDay + 1 : 1,
      newDifficulty,
      askedQuestionIds,
      evaluation.overallScore >= 90 ? 'challenge' : 'follow-up'
    );

    // 5. Calculate updated candidate confidence
    const updatedConfidence = Math.min(99, Math.max(70, evaluation.confidence + Math.floor(Math.random() * 4)));

    const reasoningText = `Evaluated candidate answer against ${currentQuestion.title}. Response exhibits ${evaluation.technicalAccuracy}% technical precision. Difficulty scaled to ${newDifficulty.toUpperCase()}.`;

    return {
      evaluation,
      reasoningText,
      aiResponseText,
      nextQuestion,
      newDifficulty,
      updatedConfidence,
    };
  }

  public async generateReport(
    candidate: Candidate,
    evaluation: EvaluationVector,
    askedQuestionsCount: number
  ): Promise<HiringFeedbackReport> {
    // Simulate 800ms report generation
    await new Promise(resolve => setTimeout(resolve, 800));

    return this.feedbackEngine.generateHiringReport(
      `sess-${Date.now()}`,
      candidate,
      evaluation,
      askedQuestionsCount
    );
  }
}

export const globalMockAIEngine = new MockAIEngine();
