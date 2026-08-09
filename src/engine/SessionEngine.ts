import { SessionData, AdaptiveDifficultyLevel, EngineQuestion, EvaluationVector } from '../types/engine';
import { Candidate } from '../types';

export class SessionEngine {
  private session: SessionData;

  constructor(candidate: Candidate) {
    this.session = {
      sessionId: `sess-${Date.now()}`,
      candidateId: candidate.id,
      candidateName: candidate.name,
      persona: 'Senior Technical Architect',
      questionIndex: 0,
      currentDifficulty: 'hard',
      durationSeconds: 0,
      currentTopic: 'Vector Databases & RAG Indexing',
      previousTopics: ['Prompt Engineering', 'RAG Foundations'],
      askedQuestions: [],
      skippedQuestions: [],
      evaluationScores: {
        technicalAccuracy: 96,
        conceptualUnderstanding: 95,
        reasoning: 94,
        communication: 95,
        problemSolving: 93,
        architectureThinking: 97,
        confidence: 92,
        productionReadiness: 95,
        overallScore: 95,
        feedbackSummary: 'Initial assessment matrix active.',
      },
      isCompleted: false,
    };
  }

  public getSession(): SessionData {
    return { ...this.session };
  }

  public updateDifficulty(newDifficulty: AdaptiveDifficultyLevel): void {
    this.session.currentDifficulty = newDifficulty;
  }

  public recordQuestion(question: EngineQuestion): void {
    this.session.askedQuestions.push(question);
    this.session.questionIndex++;
  }

  public updateScores(newScores: EvaluationVector): void {
    this.session.evaluationScores = newScores;
  }

  public completeSession(): void {
    this.session.isCompleted = true;
  }
}
