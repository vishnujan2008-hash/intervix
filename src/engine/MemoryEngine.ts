import { CandidateMemory, AdaptiveDifficultyLevel } from '../types/engine';

export class MemoryEngine {
  private memory: CandidateMemory;

  constructor(candidateId: string) {
    this.memory = {
      candidateId,
      askedQuestionIds: [],
      answersHistory: [],
      weakTopics: [],
      strongTopics: [],
      repeatedMistakes: [],
      confidenceTrend: [],
      difficultyTrend: [],
    };
  }

  public getMemory(): CandidateMemory {
    return { ...this.memory };
  }

  public recordQuestionAsked(questionId: string): void {
    if (!this.memory.askedQuestionIds.includes(questionId)) {
      this.memory.askedQuestionIds.push(questionId);
    }
  }

  public recordAnswer(questionId: string, answerText: string, score: number, topic: string, difficulty: AdaptiveDifficultyLevel): void {
    this.memory.answersHistory.push({ questionId, answerText, score });
    this.memory.confidenceTrend.push(score);
    this.memory.difficultyTrend.push(difficulty);

    if (score >= 85) {
      if (!this.memory.strongTopics.includes(topic)) {
        this.memory.strongTopics.push(topic);
      }
    } else if (score < 70) {
      if (!this.memory.weakTopics.includes(topic)) {
        this.memory.weakTopics.push(topic);
      }
    }
  }

  public hasQuestionBeenAsked(questionId: string): boolean {
    return this.memory.askedQuestionIds.includes(questionId);
  }

  public recordMistake(mistakeDescription: string): void {
    this.memory.repeatedMistakes.push(mistakeDescription);
  }
}
