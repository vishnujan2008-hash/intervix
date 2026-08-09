import { AdaptiveDifficultyLevel } from '../types/engine';

export class DifficultyEngine {
  private currentLevel: AdaptiveDifficultyLevel;

  constructor(initialLevel: AdaptiveDifficultyLevel = 'medium') {
    this.currentLevel = initialLevel;
  }

  public getCurrentDifficulty(): AdaptiveDifficultyLevel {
    return this.currentLevel;
  }

  public evaluateNextDifficulty(score: number): AdaptiveDifficultyLevel {
    if (score >= 90) {
      this.increaseDifficulty();
    } else if (score < 65) {
      this.decreaseDifficulty();
    }
    return this.currentLevel;
  }

  public increaseDifficulty(): AdaptiveDifficultyLevel {
    if (this.currentLevel === 'easy') this.currentLevel = 'medium';
    else if (this.currentLevel === 'medium') this.currentLevel = 'hard';
    else if (this.currentLevel === 'hard') this.currentLevel = 'expert';
    return this.currentLevel;
  }

  public decreaseDifficulty(): AdaptiveDifficultyLevel {
    if (this.currentLevel === 'expert') this.currentLevel = 'hard';
    else if (this.currentLevel === 'hard') this.currentLevel = 'medium';
    else if (this.currentLevel === 'medium') this.currentLevel = 'easy';
    return this.currentLevel;
  }

  public reset(level: AdaptiveDifficultyLevel = 'medium'): void {
    this.currentLevel = level;
  }
}
