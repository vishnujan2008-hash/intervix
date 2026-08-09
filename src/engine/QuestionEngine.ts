import { EngineQuestion, AdaptiveDifficultyLevel, QuestionCategory } from '../types/engine';
import { QUESTIONS_100 } from '../data/questionsData';

export class QuestionEngine {
  private questions: EngineQuestion[] = [];

  constructor() {
    this.questions = QUESTIONS_100.map(q => ({
      id: q.id,
      category: 'primary',
      title: q.title,
      difficulty: q.difficulty.toLowerCase() as AdaptiveDifficultyLevel || 'hard',
      curriculumDay: q.curriculumDay,
      estimatedTimeMinutes: 8,
      skillsTested: ['Vector Indexing', 'HNSW Graph', 'System Design'],
      content: q.content,
      codeSnippet: q.codeSnippet,
      hints: q.hints,
      explanation: q.explanation || 'HNSW graph indexing enables sub-linear search complexity for high-dimensional embeddings.',
    }));
  }

  public getNextQuestion(
    curriculumDay: number,
    difficulty: AdaptiveDifficultyLevel,
    askedIds: string[],
    category: QuestionCategory = 'primary'
  ): EngineQuestion {
    // Attempt matching unasked questions by curriculum day
    const matchingDay = this.questions.filter(q => q.curriculumDay === curriculumDay && !askedIds.includes(q.id));
    if (matchingDay.length > 0) {
      return { ...matchingDay[0], category, difficulty };
    }

    // Fallback to any unasked question
    const unasked = this.questions.filter(q => !askedIds.includes(q.id));
    if (unasked.length > 0) {
      return { ...unasked[0], category, difficulty };
    }

    // Dynamic generated question if all 100 questions asked
    return {
      id: `gen-${Date.now()}`,
      category,
      title: `Advanced ${difficulty.toUpperCase()} AI Architecture Challenge`,
      difficulty,
      curriculumDay,
      estimatedTimeMinutes: 10,
      skillsTested: ['Distributed Systems', 'LLM Fine-Tuning', 'PEFT'],
      content: `Explain how QLoRA quantization reduces memory bandwidth bottlenecks during multi-GPU parameter fine-tuning.`,
      hints: [
        'Focus on 4-bit NormalFloat (NF4) data type representation.',
        'Discuss double quantization and paged optimizers.'
      ],
      explanation: 'QLoRA quantizes pretrained model weights to 4-bit NormalFloat while maintaining full 16-bit precision for adapter gradient updates.',
    };
  }
}
