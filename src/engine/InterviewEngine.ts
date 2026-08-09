import { Candidate } from '../types';
import { InterviewStateMachine } from './InterviewStateMachine';
import { SessionEngine } from './SessionEngine';
import { MemoryEngine } from './MemoryEngine';
import { DifficultyEngine } from './DifficultyEngine';
import { QuestionEngine } from './QuestionEngine';
import { EvaluationEngine } from './EvaluationEngine';
import { ConversationEngine } from './ConversationEngine';
import { CurriculumEngine } from './CurriculumEngine';
import { CandidateEngine } from './CandidateEngine';
import { PromptEngine } from './PromptEngine';
import { FeedbackEngine } from './FeedbackEngine';
import { AnalyticsEngine } from './AnalyticsEngine';
import { ReportEngine } from './ReportEngine';
import { EngineQuestion, EvaluationVector, HiringFeedbackReport } from '../types/engine';
import { IAIEngine } from '../types/aiEngine';
import { globalGeminiAIEngine } from './providers/GeminiAIEngine';

export class InterviewEngine {
  public aiEngine: IAIEngine;

  public stateMachine: InterviewStateMachine;
  public sessionEngine: SessionEngine | null = null;
  public memoryEngine: MemoryEngine | null = null;
  public difficultyEngine: DifficultyEngine;
  public questionEngine: QuestionEngine;
  public evaluationEngine: EvaluationEngine;
  public conversationEngine: ConversationEngine;
  public curriculumEngine: CurriculumEngine;
  public candidateEngine: CandidateEngine;
  public promptEngine: PromptEngine;
  public feedbackEngine: FeedbackEngine;
  public analyticsEngine: AnalyticsEngine;
  public reportEngine: ReportEngine;

  constructor(aiEngineProvider?: IAIEngine) {
    this.aiEngine = aiEngineProvider || globalGeminiAIEngine;

    this.stateMachine = new InterviewStateMachine();
    this.difficultyEngine = new DifficultyEngine('hard');
    this.questionEngine = new QuestionEngine();
    this.evaluationEngine = new EvaluationEngine();
    this.conversationEngine = new ConversationEngine();
    this.curriculumEngine = new CurriculumEngine();
    this.candidateEngine = new CandidateEngine();
    this.promptEngine = new PromptEngine();
    this.feedbackEngine = new FeedbackEngine();
    this.analyticsEngine = new AnalyticsEngine();
    this.reportEngine = new ReportEngine();
  }

  public initializeSession(candidate: Candidate): void {
    this.sessionEngine = new SessionEngine(candidate);
    this.memoryEngine = new MemoryEngine(candidate.id);
    this.stateMachine.transitionTo('initializing');
    setTimeout(() => this.stateMachine.transitionTo('greeting'), 400);
  }

  public async submitCandidateAnswerAsync(
    candidate: Candidate,
    question: EngineQuestion,
    answerText: string
  ) {
    this.stateMachine.transitionTo('evaluating');

    const askedIds = this.memoryEngine ? this.memoryEngine.getMemory().askedQuestionIds : [];

    // Execute via GeminiAIEngine (Google Gemini API with automatic fallback)
    const payload = await this.aiEngine.processAnswer(candidate, question, answerText, askedIds);

    // Update memory & session
    if (this.memoryEngine) {
      this.memoryEngine.recordAnswer(
        question.id,
        answerText,
        payload.evaluation.overallScore,
        question.title,
        question.difficulty
      );
    }

    if (this.sessionEngine) {
      this.sessionEngine.updateScores(payload.evaluation);
      this.sessionEngine.updateDifficulty(payload.newDifficulty);
    }

    this.stateMachine.transitionTo('thinking');
    return payload;
  }

  public submitCandidateAnswer(question: EngineQuestion, answerText: string): EvaluationVector {
    this.stateMachine.transitionTo('evaluating');

    const evaluation = this.evaluationEngine.evaluateResponse(question, answerText);

    if (this.memoryEngine) {
      this.memoryEngine.recordAnswer(
        question.id,
        answerText,
        evaluation.overallScore,
        question.title,
        question.difficulty
      );
    }

    if (this.sessionEngine) {
      this.sessionEngine.updateScores(evaluation);
    }

    const nextDiff = this.difficultyEngine.evaluateNextDifficulty(evaluation.overallScore);
    if (this.sessionEngine) {
      this.sessionEngine.updateDifficulty(nextDiff);
    }

    this.stateMachine.transitionTo('thinking');
    return evaluation;
  }

  public generateReport(candidate: Candidate): HiringFeedbackReport {
    this.stateMachine.transitionTo('interview-complete');
    this.stateMachine.transitionTo('feedback');

    const scores = this.sessionEngine ? this.sessionEngine.getSession().evaluationScores : {
      technicalAccuracy: 96,
      conceptualUnderstanding: 95,
      reasoning: 94,
      communication: 95,
      problemSolving: 93,
      architectureThinking: 97,
      confidence: 92,
      productionReadiness: 95,
      overallScore: 95,
      feedbackSummary: 'Completed evaluation report.',
    };

    const report = this.feedbackEngine.generateHiringReport(
      this.sessionEngine?.getSession().sessionId || `sess-${Date.now()}`,
      candidate,
      scores,
      4
    );

    this.stateMachine.transitionTo('export-report');
    return report;
  }
}

// Global Singleton Engine Orchestrator
export const globalInterviewEngine = new InterviewEngine();
